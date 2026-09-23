export const fetchRecommendations = async () => {
  return new Promise(resolve => setTimeout(() => resolve({
    food: ['Vegetables', 'Whole grains', 'Nuts', 'Fruits', 'Hydration'],
    lifestyle: ['Hydration', 'Sleep', 'Physical activity', 'Stress management'],
    treatment: ['Medication', 'Procedure', 'Surgical treatment', 'Follow-up care']
  }), 500));
};