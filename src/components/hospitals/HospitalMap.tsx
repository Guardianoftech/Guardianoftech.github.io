import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

// Fix for default leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 13);
  }, [center, map]);
  return null;
};

export const HospitalMap = ({ hospitals, userLocation }) => {
  const navigate = useNavigate();
  const defaultCenter = [30.7333, 76.7794];
  const center = userLocation ? [userLocation.lat, userLocation.lon] : defaultCenter;

  return (
    <div className="h-[500px] rounded-xl overflow-hidden shadow-sm border border-gray-200 relative z-0">
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapUpdater center={center} />
        
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lon]}>
            <Popup>📍 Current Location</Popup>
          </Marker>
        )}

        {hospitals.map(h => {
          let icon = new L.Icon.Default();
          if (h.matchScore !== undefined) {
             const color = h.matchScore >= 80 ? '#22c55e' : h.matchScore >= 50 ? '#f59e0b' : '#f43f5e';
             icon = L.divIcon({
               className: 'custom-div-icon',
               html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.4);"></div>`,
               iconSize: [20, 20],
               iconAnchor: [10, 10]
             });
          }
          return (
          <Marker key={h.id} position={[h.lat, h.lon]} icon={icon}>
            <Popup>
              <div className="p-1">
                <h4 className="font-bold mb-1">{h.name}</h4>
                <p className="text-xs text-gray-600 mb-2">{h.distance_km} km away</p>
                <p className="text-xs font-semibold mb-2">Specialty: {h.specialties?.[0] || 'General'}</p>
                <Button variant="primary" className="w-full text-xs py-1" onClick={() => navigate(`/hospitals/${h.id}`)}>View Details</Button>
              </div>
            </Popup>
          </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};