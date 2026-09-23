import React from 'react';
import { Card } from '../components/ui/Card';
import { demoHospitals } from '../mocks/demoHospitals';

export const CompareHospitals = () => {
  const h1 = demoHospitals[0];
  const h2 = demoHospitals[1];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Hospital Comparison</h1>
      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-900">Feature</th>
              <th className="p-4 font-semibold text-gray-900">{h1.name}</th>
              <th className="p-4 font-semibold text-gray-900">{h2.name}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-4 font-medium text-gray-700">Distance</td>
              <td className="p-4">{h1.distance_km} km</td>
              <td className="p-4">{h2.distance_km} km</td>
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium text-gray-700">Estimated Cost</td>
              <td className="p-4">{h1.estimatedTreatmentCost}</td>
              <td className="p-4">{h2.estimatedTreatmentCost}</td>
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium text-gray-700">Facilities</td>
              <td className="p-4">{h1.facilities.join(', ')}</td>
              <td className="p-4">{h2.facilities.join(', ')}</td>
            </tr>
            <tr>
              <td className="p-4 font-medium text-gray-700">Data Source</td>
              <td className="p-4">{h1.isVerified ? 'Verified' : 'Unknown'}</td>
              <td className="p-4">{h2.isVerified ? 'Verified' : 'Unknown'}</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
};