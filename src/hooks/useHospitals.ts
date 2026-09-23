import { useState, useEffect } from 'react';
import { fetchHospitals } from '../services/hospitalApi';

export const useHospitals = (lat, lon) => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !lon) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchHospitals(lat, lon);
        setHospitals(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [lat, lon]);

  return { hospitals, loading, error };
};