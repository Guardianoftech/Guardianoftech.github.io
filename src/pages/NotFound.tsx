import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
    <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
    <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
    <p className="text-gray-500 mb-6">The page you're looking for doesn't exist or has been moved.</p>
    <Link to="/"><Button variant="primary">Return Home</Button></Link>
  </div>
);