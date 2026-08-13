import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard'; // Assuming AdminDashboard.jsx is in src/

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setCurrentRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // If URL ends with #admin, render the admin back-office dashboard
  if (currentRoute === '#admin') {
    return <AdminDashboard />;
  }

  // Otherwise, render your normal merchant POS terminal
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans p-6">
      <h1 className="text-lg font-extrabold text-white">Ntemba POS Terminal</h1>
      <p className="text-xs text-stone-400">Merchant cash register and inventory view.</p>
    </div>
  );
}
