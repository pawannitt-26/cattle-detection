'use client';

import React, { useState } from 'react';
import { LayoutDashboard, Camera, History, Bug, CloudSun, User } from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import Detector from '@/components/Detector';
import HistoryLog from '@/components/HistoryLog';
import PestWiki from '@/components/PestWiki';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'Cattle', time: '14:24:12', status: 'Warning', label: 'COW detected in Sector 4' },
    { id: 2, type: 'Pest', time: '10:15:05', status: 'Danger', label: 'LOCUST Cluster in Sector 2' },
  ]);

  const addAlert = (newAlert) => {
    setAlerts(prev => [newAlert, ...prev].slice(0, 50));
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
    { id: 'camera', icon: Camera, label: 'Scanner' },
    { id: 'history', icon: History, label: 'Alerts' },
    { id: 'pests', icon: Bug, label: 'Wiki' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile Top Header */}
      <header style={{ padding: '24px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

      {/* Main Content Area */}
      <main className="page-content" style={{ flex: 1 }}>
        {activeTab === 'dashboard' && <Dashboard alerts={alerts} />}
        {activeTab === 'camera' && <Detector onAlert={addAlert} />}
        {activeTab === 'history' && <HistoryLog alerts={alerts} />}
        {activeTab === 'pests' && <PestWiki />}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav">
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

      <style jsx global>{`
        .page-content {
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
}
