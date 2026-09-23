import { useState, useEffect } from 'react';
import { fetchHealthMetrics } from '../services/healthApi';

export const useHealthData = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthMetrics().then(data => {
      setMetrics(data);
      setLoading(false);
    });
  }, []);

  return { metrics, loading };
};