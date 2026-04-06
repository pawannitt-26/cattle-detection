'use client';

import React from 'react';
import { LayoutDashboard, Camera, History, Bug, ShieldAlert, LogOut } from 'lucide-react';

function Sidebar({ activeTab, setActiveTab, navItems }) {
  return (
    <aside className="desktop-sidebar glass-card" style={{ margin: '20px', borderRadius: '32px' }}>
      <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
        <div style={{ background: '#2d6a4f', padding: '10px', borderRadius: '12px' }}>
          <ShieldAlert color="white" size={28} />
        </div>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1b4332', letterSpacing: '-0.5px' }}>
          CropGuardian
        </span>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              borderRadius: '16px',
              border: 'none',
              background: activeTab === item.id ? '#2d6a4f' : 'transparent',
              color: activeTab === item.id ? 'white' : '#64748b',
              marginBottom: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontWeight: activeTab === item.id ? 600 : 500,
              fontSize: '0.95rem'
            }}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
        <button style={{ 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          padding: '16px', 
          color: '#ef4444', 
          background: 'transparent', 
          border: 'none',
          cursor: 'pointer',
          fontWeight: 600
        }}>
          <LogOut size={20} />
          Logout
        </button>
      </div>

      <style jsx>{`
        .nav-btn:hover:not(.active) {
          background: #f1f5f9 !important;
          color: #1b4332 !important;
          transform: translateX(4px);
        }
      `}</style>
    </aside>
  );
}

export default Sidebar;
