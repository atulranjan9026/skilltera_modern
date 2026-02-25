import React from 'react';
import { Link } from 'react-router-dom';
import { Home, SearchX } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-center px-4">
        <div className="mx-auto mb-6 w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center">
          <SearchX className="w-10 h-10 text-primary-600" />
        </div>
        <h1 className="text-6xl font-bold text-slate-900">404</h1>
        <p className="mt-4 text-xl text-slate-600">Page not found</p>
        <p className="mt-2 text-slate-500">The page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-8 inline-block">
          <Button variant="primary" size="md">
            <Home size={16} />
            Go back home
          </Button>
        </Link>
      </div>
    </div>
  );
}
