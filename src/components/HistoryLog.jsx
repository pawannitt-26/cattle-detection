'use client';

import React from 'react';
import { Search, Filter, Download, MoreVertical, ShieldAlert, Bug, ShieldCheck, Clock } from 'lucide-react';

function HistoryLog({ alerts }) {
  return (
    <div className="history-log" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Mobile Search & Filter */}
      <div className="glass-card" style={{ padding: '20px', borderRadius: '24px', marginBottom: '20px' }}>
         <div style={{ position: 'relative', marginBottom: '12px' }}>
            <Search size={18} color="#64748b" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search alerts..." 
              style={{
                width: '100%',
                padding: '14px 14px 14px 48px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                fontSize: '0.9rem'
              }}
            />
         </div>
         <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem', color: '#1a1c1a', fontWeight: 600 }}>
               <Filter size={16} /> Filter
            </button>
            <button style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem', color: '#1a1c1a', fontWeight: 600 }}>
               <Download size={16} /> Export
            </button>
         </div>
      </div>

      {/* Alert List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className="glass-card" 
            style={{ 
              padding: '20px', 
              borderRadius: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
             <div style={{ 
               background: alert.status === 'Danger' ? '#fee2e2' : '#fef3c7', 
               minWidth: '48px', 
               height: '48px', 
               borderRadius: '14px', 
               display: 'flex', 
               alignItems: 'center', 
               justifyContent: 'center' 
             }}>
                {alert.type === 'Cattle' ? <ShieldAlert size={20} color="#92400e" /> : <Bug size={20} color="#991b1b" />}
             </div>
             
             <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                   <h3 style={{ fontSize: '0.95rem', color: '#1b4332', fontWeight: 800 }}>{alert.label}</h3>
                   <span className={`badge ${alert.status === 'Danger' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.6rem' }}>
                      {alert.status}
                   </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.75rem' }}>
                   <Clock size={12} />
                   {alert.time} • Sector 4 (North)
                </div>
             </div>
             
             <button style={{ background: 'transparent', border: 'none', padding: '8px' }}>
                <MoreVertical size={18} color="#94a3b8" />
             </button>
          </div>
        ))}
        {alerts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', opacity: 0.5 }}>
             <ShieldCheck size={48} color="#1b4332" style={{ margin: '0 auto 16px auto' }} />
             <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>No alerts found for this session.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryLog;
