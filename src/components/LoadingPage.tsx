import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingPageProps {
  isDarkMode?: boolean;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ isDarkMode = true }) => {
  return (
    <div className={`flex flex-col items-center justify-center h-screen w-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <Loader2 className="w-16 h-16 animate-spin mb-4" />
      <h2 className="text-2xl font-semibold">Loading Canvas...</h2>
      <p className="mt-2 text-sm text-gray-500">Please wait while we set things up for you.</p>
    </div>
  );
};

export default LoadingPage;
