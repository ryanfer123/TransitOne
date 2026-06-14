import React from 'react';
import { Platform, View, Text } from 'react-native';

// Web-safe stubs — react-native-maps cannot be imported on web at all.
// On native platforms, screens should import react-native-maps directly
// using Platform.select or .native.js files.

export const UrlTile = () => null;
export const Polyline = () => null;

export const Marker = ({ children, coordinate }) => {
  if (Platform.OS !== 'web') return null;
  return <View>{children}</View>;
};

export default function MapView({ children, style, initialRegion }) {
  if (Platform.OS === 'web') {
    // Render a dark tile map using an iframe with Leaflet
    const lat = initialRegion?.latitude || 13.0827;
    const lon = initialRegion?.longitude || 80.2707;
    const zoom = 12;
    const leafletHtml = `
      <!DOCTYPE html>
      <html><head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>html,body,#map{margin:0;padding:0;width:100%;height:100%;background:#0e1417;}</style>
      </head><body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          var map = L.map('map',{zoomControl:false}).setView([${lat},${lon}],${zoom});
          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{
            maxZoom:19,subdomains:'abcd',
            attribution:'&copy; OpenStreetMap &copy; CARTO'
          }).addTo(map);
        </script>
      </body></html>
    `;
    return (
      <View style={[{ width: '100%', height: '100%', overflow: 'hidden' }, style]}>
        <iframe
          srcDoc={leafletHtml}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Map"
        />
      </View>
    );
  }
  // Native fallback (shouldn't be reached if screens import react-native-maps directly)
  return (
    <View style={[style, { backgroundColor: '#1a2024', justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ color: '#859398' }}>Map</Text>
      {children}
    </View>
  );
}
