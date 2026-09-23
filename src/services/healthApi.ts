import { demoHealthMetrics } from '../mocks/demoHealthData';

export const fetchHealthMetrics = async () => {
  return new Promise(resolve => setTimeout(() => resolve(demoHealthMetrics), 500));
};