import React, { useState, useEffect } from 'react';
import ChatAssistant from './ChatAssistant';
import MapView from './Map';
import QueuePredictions from './QueuePredictions';
import { listenForAlerts } from '../services/notificationService';

export default function Dashboard(): JSX.Element {
  const [activeTab, setActiveTab] = useState<'map' | 'assistant' | 'queues'>('map');
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsub = listenForAlerts((payload) => {
      setAlertMsg(payload.notification?.body || 'New Venue Update');
    });
    // Mocking an emergency integration event for demo
    setTimeout(() => setAlertMsg("Important: Sector C entrance is closed for cleaning. Please use Sector D."), 60000);
    return () => unsub && unsub();
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full h-full xl:flex-row pb-10">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-6">
        <header className="mb-4">
          <h1 className="text-3xl font-bold mb-2" tabIndex={0}>Welcome to the Venue</h1>
          <p className="text-gray-400" tabIndex={0}>Your smart guide to a seamless event experience.</p>
        </header>

        {alertMsg && (
          <div className="bg-alert/20 border border-alert text-white p-4 rounded-lg flex justify-between" role="alert" aria-live="assertive">
            <span>{alertMsg}</span>
            <button onClick={() => setAlertMsg(null)} aria-label="Dismiss Alert" className="font-bold ml-4">✕</button>
          </div>
        )}

        {/* Mobile Tabs */}
        <nav className="flex xl:hidden bg-surface/50 p-1 rounded-lg border border-white/5" aria-label="Mobile Navigation">
          <button 
            className={`flex-1 py-3 text-sm font-semibold rounded-md transition-all outline-none focus:ring-2 focus:ring-primary ${activeTab === 'map' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('map')}
          >
            Map
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-semibold rounded-md transition-all outline-none focus:ring-2 focus:ring-primary ${activeTab === 'queues' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('queues')}
          >
            Queues
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-semibold rounded-md transition-all outline-none focus:ring-2 focus:ring-primary ${activeTab === 'assistant' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('assistant')}
          >
            Assistant
          </button>
        </nav>

        {/* Dynamic Content Space for Mobile, Fixed Layout for Desktop */}
        <div className="flex-1 flex flex-col xl:flex-row gap-6 min-h-[500px]">
          <section aria-label="Venue Map" className={`xl:flex xl:flex-col xl:flex-[2] gap-6 ${activeTab === 'map' ? 'block' : 'hidden xl:flex'}`}>
            <div className="glass-panel p-4 flex-1 h-[400px] xl:h-auto overflow-hidden relative group">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold" tabIndex={0}>Live Crowd Map</h2>
                <button className="text-xs bg-secondary/20 text-secondary border border-secondary/50 px-2 py-1 rounded" aria-label="Scan Seat QR">Scan QR</button>
              </div>
              <MapView />
            </div>
          </section>
          
          <section aria-label="Interactive Tools" className={`xl:flex xl:flex-col xl:flex-1 gap-6 ${activeTab === 'queues' || activeTab === 'assistant' ? 'block' : 'hidden xl:flex'}`}>
            <div className={`glass-panel p-5 flex flex-col h-[300px] xl:h-[40%] ${activeTab === 'queues' || activeTab === 'map' ? 'block' : 'hidden xl:flex'}`}>
              <h2 className="text-lg font-semibold mb-3" tabIndex={0}>Live Wait Times</h2>
              <QueuePredictions />
            </div>

            <div className={`glass-panel p-0 flex flex-col flex-1 h-[500px] xl:h-[60%] overflow-hidden ${activeTab === 'assistant' || activeTab === 'map' ? 'block' : 'hidden xl:flex'}`}>
              <ChatAssistant />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
