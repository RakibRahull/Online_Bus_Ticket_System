import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import { axiosInstance } from '../helpers/axiosInstance';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.75rem'
};

const defaultCenter = {
  lat: 23.8103, // Default center (Dhaka)
  lng: 90.4125
};

function BusStandMap({ busStands = [], selectedLocation, onSelectLocation }) {
  const [map, setMap] = useState(null);
  const [selectedStand, setSelectedStand] = useState(null);
  const [center, setCenter] = useState(selectedLocation || defaultCenter);
  const [zoom, setZoom] = useState(selectedLocation ? 15 : 12);
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [localBusStands, setLocalBusStands] = useState(busStands);

  // Fetch API key
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        // Try the authenticated endpoint first
        if (localStorage.getItem("token")) {
          const response = await axiosInstance.get("/api/config/map-api-key");

          if (response.data.success) {
            setApiKey(response.data.data.googleMapsApiKey);
            setLoading(false);
            return;
          }
        }

        // Fallback to public endpoint
        const publicResponse = await axiosInstance.get("/api/config/public-map-key");
        if (publicResponse.data.success) {
          setApiKey(publicResponse.data.data.googleMapsApiKey);
        }
      } catch (error) {
        console.error("Failed to fetch Google Maps API key", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  // Fetch bus stands if none provided
  useEffect(() => {
    const fetchBusStands = async () => {
      if (busStands.length === 0) {
        try {
          const response = await axiosInstance.get("/api/bus-stands/get-all-stands");
          if (response.data.success) {
            setLocalBusStands(response.data.data);
          }
        } catch (error) {
          console.error("Failed to fetch bus stands:", error);
        }
      } else {
        setLocalBusStands(busStands);
      }
    };

    fetchBusStands();
  }, [busStands]);

  // Update center when selected location changes
  useEffect(() => {
    if (selectedLocation && selectedLocation.lat && selectedLocation.lng) {
      setCenter(selectedLocation);
      setZoom(15);
    }
  }, [selectedLocation]);

  // Handle map load
  const onMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  // Handle marker click
  const handleMarkerClick = useCallback((stand) => {
    setSelectedStand(stand);
    if (onSelectLocation) {
      onSelectLocation(stand.location);
    }
  }, [onSelectLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-700 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading map...</p>
        </div>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg p-6">
        <div className="text-center">
          <p className="text-red-500">Unable to load Google Maps</p>
          <p className="text-gray-500 text-sm mt-2">API key not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full rounded-xl overflow-hidden shadow-md">
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
          onLoad={onMapLoad}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {localBusStands.map((stand, index) => (
            <Marker
              key={stand._id || `stand-${index}`}
              position={stand.location}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/bus.png',
                scaledSize: new window.google.maps.Size(40, 40)
              }}
              onClick={() => handleMarkerClick(stand)}
            />
          ))}

          {selectedStand && (
            <InfoWindow
              position={selectedStand.location}
              onCloseClick={() => setSelectedStand(null)}
            >
              <div className="p-2">
                <h3 className="font-bold text-gray-800">{selectedStand.name}</h3>
                <p className="text-sm text-gray-600">{selectedStand.address}</p>
                {selectedStand.routes && (
                  <div className="mt-1">
                    <p className="text-xs font-medium text-gray-700">Routes:</p>
                    <p className="text-xs text-blue-600">
                      {selectedStand.routes.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default BusStandMap;