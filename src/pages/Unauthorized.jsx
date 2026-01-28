import React from 'react';

/**
 * Unauthorized/403 Page
 */
function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">403</h1>
        <p className="mt-4 text-xl text-gray-600">Access denied</p>
        <p className="mt-2 text-gray-500">You don't have permission to access this page.</p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}

export default Unauthorized;
