'use client';

import React, { useState } from 'react';
import { LayoutDashboard, Camera, History, Bug, CloudSun, User, ShieldAlert } from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import Detector from '@/components/Detector';
import HistoryLog from '@/components/HistoryLog';
import PestWiki from '@/components/PestWiki';
import PwaPrompt from '@/components/PwaPrompt';
import Sidebar from '@/components/Sidebar';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'Cattle', time: '14:24:12', status: 'Warning', label: 'COW detected in Sector 4' },
    { id: 2, type: 'Pest', time: '10:15:05', status: 'Danger', label: 'LOCUST Cluster in Sector 2' },
    { id: 3, type: 'Pest', time: '09:45:22', status: 'Warning', label: 'APHID activity in Sector 1' },
    { id: 4, type: 'Cattle', time: '08:12:10', status: 'Safe', label: 'SHEEP flock moved to North' },
    { id: 5, type: 'Pest', time: '07:30:00', status: 'Danger', label: 'BOLLWORM alert in Cotton' },
    { id: 6, type: 'System', time: '06:00:00', status: 'Safe', label: 'Morning scan complete - 0 hazards' },
  ]);

  const addAlert = (newAlert) => {
    setAlerts(prev => [newAlert, ...prev].slice(0, 50));
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'camera', icon: Camera, label: 'Scanner' },
    { id: 'history', icon: History, label: 'Alerts' },
    { id: 'pests', icon: Bug, label: 'Wiki' },
  ];

  return (
    <div className="app-layout">
      {/* Desktop Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} navItems={navItems} />

      {/* Main Content Area */}
      <div className="main-content-flow">
        <header className="mobile-only" style={{ 
          padding: '16px 20px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          background: 'rgba(248, 251, 249, 0.8)',
          backdropFilter: 'blur(20px)',
          zIndex: 1100,
          borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <div style={{ background: '#2d6a4f', padding: '10px', borderRadius: '12px' }}>
                <Bug color="white" size={24} strokeWidth={2.5} />
             </div>
             <h1 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1b4332' }}>CropGuardian</h1>
          </div>
          <div style={{ background: 'white', padding: '10px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
             <CloudSun size={20} color="#64748b" />
          </div>
        </header>

        <main className="page-content">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 className="desktop-only" style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1b4332', marginBottom: '8px' }}>
              {navItems.find(i => i.id === activeTab)?.label}
            </h1>
            <p className="desktop-only" style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '40px' }}>
              Welcome back, Farmer. Your fields are safe today.
            </p>
            
            {activeTab === 'dashboard' && <Dashboard alerts={alerts} />}
            {activeTab === 'camera' && <Detector onAlert={addAlert} />}
            {activeTab === 'history' && <HistoryLog alerts={alerts} />}
            {activeTab === 'pests' && <PestWiki />}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="mobile-nav">
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              style={{ border: 'none', background: 'none', cursor: 'pointer' }}
            >
              <div className="nav-icon-wrapper">
                <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              </div>
              <span style={{ fontSize: '0.65rem' }}>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <PwaPrompt />

      <style jsx global>{`
        @media (min-width: 768px) {
          .mobile-only { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-only { display: none !important; }
        }
      `}</style>
    </div>
  );
}
