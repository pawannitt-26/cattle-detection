'use client';

import React from 'react';
import { ShieldAlert, TrendingUp, Zap, Clock, Bird, Bug, CloudSun } from 'lucide-react';

function Dashboard({ alerts }) {
  const stats = [
    { label: 'Threats', value: alerts.filter(a => a.status === 'Danger').length, icon: ShieldAlert, color: '#ef4444', bg: '#fee2e2' },
    { label: 'Weather', value: '28°C', icon: CloudSun, color: '#92400e', bg: '#fef3c7' },
    { label: 'Uptime', value: '24d', icon: Clock, color: '#1e40af', bg: '#dbeafe' },
    { label: 'Health', value: '98%', icon: Zap, color: '#166534', bg: '#dcfce7' },
  ];

  return (
    <div className="dashboard" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Welcome Banner */}
      <div className="glass-card" style={{ padding: '24px', borderRadius: '24px', background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)', color: 'white', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px' }}>Good Morning, Farmer</h2>
        <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>System is active in Sector 4. No major threats detected in the last hour.</p>
      </div>

      {/* Stats Grid - 2x2 for mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '16px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ background: stat.bg, width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon color={stat.color} size={18} />
            </div>
            <div>
              <p style={{ color: '#64748b', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1b4332' }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Alerts List */}
      <div className="glass-card" style={{ padding: '24px', borderRadius: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
           <h3 style={{ fontSize: '1rem', color: '#1b4332', fontWeight: 800 }}>Recent Activity</h3>
           <span style={{ fontSize: '0.75rem', color: '#2d6a4f', fontWeight: 600 }}>See all</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {alerts.slice(0, 3).map(alert => (
            <div key={alert.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '16px' }}>
              <div style={{ 
                background: alert.status === 'Danger' ? '#fee2e2' : '#fef3c7', 
                minWidth: '40px', 
                height: '40px', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                {alert.type === 'Cattle' ? <Bird size={18} color="#92400e" /> : <Bug size={18} color="#991b1b" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1b4332' }}>{alert.label}</div>
                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{alert.time} • Local Monitoring</div>
              </div>
              <div className={`badge ${alert.status === 'Danger' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.6rem' }}>
                {alert.status}
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', padding: '20px' }}>No active threats detected.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
