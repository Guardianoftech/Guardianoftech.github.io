import { useState, useEffect } from 'react';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const requestLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  };

  const applyExternalLocation = (lat: number, lon: number) => {
    setLocation({ lat, lon });
    setError(null);
  };

  useEffect(() => {
    // We don't auto-request to respect privacy, user must trigger it.
    // But for demo purposes if they already granted it, we can fetch.
    setLoading(false);
  }, []);

  return { location, error, loading, requestLocation, applyExternalLocation };
};