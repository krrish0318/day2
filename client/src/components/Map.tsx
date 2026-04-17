import { useCallback, memo } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem' // tailwind rounded-lg
};

// Default setup near a generic stadium coordinate
const center = {
  lat: 37.7749,
  lng: -122.4194
};

/**
 * MapView Component
 * Renders the Google Map utilizing the internal JS API array.
 * Highly optimized with memo to prevent API reloading on typical dashboard tab shifts.
 * 
 * @returns {JSX.Element} Map visualizer.
 */
const MapView = memo(function MapView(): JSX.Element {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    // Fallback if not configured properly, just ensuring type safety
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY"
  });

  const onLoad = useCallback(function callback(mapInstance: google.maps.Map) {
    // optional logic
  }, []);

  const onUnmount = useCallback(function callback() {
    // optional component logic
  }, []);

  // For visual wow-factor even without valid API keys (it might show "for development purposes only")
  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            { featureType: "water", stylers: [{ color: "#17263c" }] }
          ],
          disableDefaultUI: true
        }}
      >
        { /* Example markers representing crowd hot-spots */ }
        <Marker position={{ lat: 37.7749, lng: -122.4194 }} label="Gate 1" />
        <Marker position={{ lat: 37.7758, lng: -122.4180 }} label="Food A" />
      </GoogleMap>
  ) : <div className="animate-pulse w-full h-full bg-surface rounded-lg flex items-center justify-center text-gray-500">Loading Map...</div>;
});

export default MapView;
