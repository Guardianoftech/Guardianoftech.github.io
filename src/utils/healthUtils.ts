export const getTrendStatus = (current, previous, isHigherBetter = true) => {
  if (!previous) return 'Insufficient data';
  if (current === previous) return 'Stable';
  if (current > previous) return isHigherBetter ? 'Improving' : 'Needs attention';
  return isHigherBetter ? 'Needs attention' : 'Improving';
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Improving': return 'text-green-600 bg-green-50 border-green-200';
    case 'Needs attention': return 'text-red-600 bg-red-50 border-red-200';
    case 'Stable': return 'text-blue-600 bg-blue-50 border-blue-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};