import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import { requestNotificationPermission } from './services/notificationService';
import { auth } from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App(): JSX.Element {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Auth Listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        requestNotificationPermission();
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background">
        <header className="glass-panel sticky top-0 z-50 rounded-none border-t-0 border-x-0 border-b border-white/10 py-4 px-6 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            SmartVenue AI
          </Link>
          <nav className="flex gap-4">
            <Link to="/" className="hover:text-primary transition-colors focus:ring-2 focus:ring-primary outline-none rounded px-2 py-1">Dashboard</Link>
          </nav>
        </header>
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto" role="main" aria-label="Main Application Area">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
