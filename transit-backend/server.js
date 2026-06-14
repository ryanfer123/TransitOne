const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const websocket = require('@fastify/websocket');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'transitone-super-secret-key-123!';
let users = []; // In-memory database for prototype

const NAVITIA_TOKEN = process.env.NAVITIA_TOKEN || 'YOUR_NAVITIA_TOKEN';
const NAVITIA_COVERAGE = 'sandbox'; // Global sandbox by default

const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_KEY || 'AIzaSyAc8xi0tbirbrzer04LBhd1HV25kMHibyM';

function decodePolyline(encoded) {
  if (!encoded) {
    return [];
  }
  var poly = [];
  var index = 0, len = encoded.length;
  var lat = 0, lng = 0;

  while (index < len) {
    var b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    var p = {
      latitude: (lat / 1E5),
      longitude: (lng / 1E5)
    };
    poly.push(p);
  }
  return poly;
}

fastify.register(cors, {
  origin: '*'
});

fastify.register(websocket);

// Unified Transit Schema:
// Vehicle: { id, mode, routeId, lat, lon, heading, status, occupancy, nextStops: [{ stopId, stopName, eta, status }] }

function futureEta(minutesFromNow) {
  return Math.floor(Date.now() / 1000) + minutesFromNow * 60;
}

const mockVehicles = [
  { id: 'v1', mode: 'BUS', routeId: '19B', lat: 13.0604, lon: 80.2496, heading: 90, status: 'ON_TIME', occupancy: 'CROWDED', speed: 25, nextStops: [
    { stopId: 's1', stopName: 'T. Nagar', eta: futureEta(3), status: 'ON_TIME' },
    { stopId: 's2', stopName: 'Mambalam', eta: futureEta(8), status: 'ON_TIME' },
  ]},
  { id: 'v2', mode: 'BUS', routeId: '21G', lat: 13.0418, lon: 80.2341, heading: 180, status: 'DELAYED', occupancy: 'MODERATE', speed: 30, nextStops: [
    { stopId: 's3', stopName: 'Adyar Signal', eta: futureEta(5), status: 'DELAYED' },
    { stopId: 's4', stopName: 'Besant Nagar', eta: futureEta(12), status: 'ON_TIME' },
  ]},
  { id: 'v3', mode: 'METRO', routeId: 'Blue Line', lat: 13.0102, lon: 80.2158, heading: 220, status: 'ON_TIME', occupancy: 'SEATS_AVAILABLE', speed: 50, nextStops: [
    { stopId: 's5', stopName: 'Guindy', eta: futureEta(2), status: 'ON_TIME' },
    { stopId: 's6', stopName: 'Alandur', eta: futureEta(5), status: 'ON_TIME' },
  ]},
  { id: 'v4', mode: 'METRO', routeId: 'Green Line', lat: 13.0827, lon: 80.2707, heading: 0, status: 'ON_TIME', occupancy: 'MODERATE', speed: 45, nextStops: [
    { stopId: 's7', stopName: 'Central', eta: futureEta(1), status: 'ON_TIME' },
    { stopId: 's8', stopName: 'Egmore', eta: futureEta(4), status: 'ON_TIME' },
  ]},
  { id: 'v5', mode: 'TRAIN', routeId: 'MRTS', lat: 13.0330, lon: 80.2750, heading: 160, status: 'ON_TIME', occupancy: 'CROWDED', speed: 40, nextStops: [
    { stopId: 's9', stopName: 'Thiruvanmiyur', eta: futureEta(4), status: 'ON_TIME' },
    { stopId: 's10', stopName: 'Velachery', eta: futureEta(10), status: 'ON_TIME' },
  ]},
];

// Update vehicle positions every 3s
setInterval(() => {
  mockVehicles.forEach(v => {
    v.lat += (Math.random() - 0.5) * 0.002;
    v.lon += (Math.random() - 0.5) * 0.002;
    v.heading = (v.heading + (Math.random() - 0.5) * 10) % 360;
    // Refresh ETAs so they stay realistic
    v.nextStops.forEach((s, i) => {
      s.eta = Math.floor(Date.now() / 1000) + (i + 1) * (Math.floor(Math.random() * 3) + 2) * 60;
    });
  });
  
  const message = JSON.stringify({ type: 'VEHICLE_UPDATE', data: mockVehicles });
  for (const client of fastify.websocketServer.clients) {
    if (client.readyState === 1) { // OPEN
      client.send(message);
    }
  }
}, 3000);

fastify.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, (connection, req) => {
    connection.send(JSON.stringify({ type: 'INIT', data: mockVehicles }));
    
    connection.on('message', message => {
      // Handle client messages if any
    });
  });
});

fastify.get('/api/vehicles', async (request, reply) => {
  return { vehicles: mockVehicles };
});


async function geocode(query) {
  const res = await fetch(`https://api.navitia.io/v1/coverage/${NAVITIA_COVERAGE}/places?q=${encodeURIComponent(query)}`, {
    headers: { Authorization: NAVITIA_TOKEN }
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.places && data.places.length > 0) {
    const place = data.places[0];
    const type = place.embedded_type;
    const coord = place[type] && place[type].coord ? place[type].coord : null;
    if (coord) return `${coord.lon};${coord.lat}`;
  }
  return null;
}

fastify.get('/api/journeys', async (request, reply) => {
  const { origin, destination } = request.query;
  
  if (!origin || !destination) {
    return reply.status(400).send({ error: 'Missing origin or destination' });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=transit&key=${GOOGLE_MAPS_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch from Google Maps');
    const data = await res.json();

    if (data.status !== 'OK') {
      if (data.status === 'ZERO_RESULTS') {
        return { routes: [], origin, destination };
      }
      
      // FALLBACK TO MOCK DATA IF GOOGLE API FAILS (e.g. REQUEST_DENIED)
      const mockJourneys = [
        {
          id: 'mtc-19B', time: '45 min', fare: '₹15', interchanges: 0, legs: ['BUS'], sortValue: 45,
          path: [{ latitude: 13.0827, longitude: 80.2707 }, { latitude: 13.0604, longitude: 80.2496 }, { latitude: 13.0418, longitude: 80.2341 }, { latitude: 13.0102, longitude: 80.2158 }, { latitude: 12.9800, longitude: 80.2200 }]
        },
        {
          id: 'metro-blue', time: '25 min', fare: '₹40', interchanges: 0, legs: ['METRO'], sortValue: 25,
          path: [{ latitude: 13.0827, longitude: 80.2707 }, { latitude: 13.0640, longitude: 80.2600 }, { latitude: 13.0450, longitude: 80.2500 }, { latitude: 13.0102, longitude: 80.2158 }, { latitude: 12.9822, longitude: 80.1636 }]
        },
        {
          id: 'mrts-local', time: '35 min', fare: '₹5', interchanges: 1, legs: ['TRAIN', 'BUS'], sortValue: 35,
          path: [{ latitude: 13.0827, longitude: 80.2707 }, { latitude: 13.0620, longitude: 80.2820 }, { latitude: 13.0330, longitude: 80.2750 }, { latitude: 12.9900, longitude: 80.2550 }, { latitude: 12.9800, longitude: 80.2200 }]
        }
      ];
      return { routes: mockJourneys, origin, destination };
    }

    const routes = data.routes.map((route, i) => {
      const leg = route.legs[0]; // Usually 1 leg for point A to B
      const time = leg.duration.text;
      const fareText = route.fare ? `${route.fare.currency} ${route.fare.text || route.fare.value}` : '₹' + Math.floor(Math.random() * 40 + 10);
      
      const modes = [];
      let transitCount = 0;
      const path = [];

      leg.steps.forEach(step => {
        if (step.travel_mode === 'TRANSIT') {
          transitCount++;
          let type = step.transit_details.line.vehicle.type;
          if (type === 'SUBWAY' || type === 'METRO') modes.push('METRO');
          else if (type === 'HEAVY_RAIL' || type === 'COMMUTER_TRAIN' || type === 'TRAIN') modes.push('TRAIN');
          else modes.push('BUS');
        } else if (step.travel_mode === 'WALKING') {
          if (!modes.includes('WALK') && modes.length === 0) modes.push('WALK');
        }
        
        const decodedStep = decodePolyline(step.polyline.points);
        path.push(...decodedStep);
      });

      // Filter out 'WALK' if there are other transit modes to keep the tags clean
      const displayModes = modes.length > 1 ? modes.filter(m => m !== 'WALK') : modes;

      return {
        id: `gmaps-${i}`,
        time: time,
        fare: fareText,
        interchanges: Math.max(0, transitCount - 1),
        legs: displayModes.slice(0, 3), // limit to 3 tags max on UI
        sortValue: leg.duration.value,
        path: path
      };
    });

    return { routes, origin, destination };
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ error: 'Internal Server Error fetching routing data' });
  }
});

// --- AUTHENTICATION ROUTES ---

fastify.post('/api/auth/register', async (request, reply) => {
  const { name, email, password } = request.body;
  if (!name || !email || !password) return reply.status(400).send({ error: 'Missing fields' });

  if (users.find(u => u.email === email)) {
    return reply.status(400).send({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: `u-${Date.now()}`, name, email, password: hashedPassword, isPro: false };
  users.push(newUser);

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
  return { token, user: { id: newUser.id, name: newUser.name, email: newUser.email, isPro: newUser.isPro } };
});

fastify.post('/api/auth/login', async (request, reply) => {
  const { email, password } = request.body;
  if (!email || !password) return reply.status(400).send({ error: 'Missing fields' });

  const user = users.find(u => u.email === email);
  if (!user) return reply.status(401).send({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return reply.status(401).send({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  return { token, user: { id: user.id, name: user.name, email: user.email, isPro: user.isPro } };
});

fastify.get('/api/auth/me', async (request, reply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    if (!user) return reply.status(404).send({ error: 'User not found' });
    
    return { user: { id: user.id, name: user.name, email: user.email, isPro: user.isPro } };
  } catch (err) {
    return reply.status(401).send({ error: 'Invalid token' });
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '::' });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
