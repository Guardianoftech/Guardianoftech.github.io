import { api } from './api';

export const fetchHealthAnalytics = async (timeRange: string = '6M') => {
  const response = await api.get(`/analytics/dashboard?time_range=${timeRange}`);
  return response.data;
};
