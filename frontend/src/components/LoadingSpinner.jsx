import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <div className="mt-4 text-white text-center font-medium">Loading...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;