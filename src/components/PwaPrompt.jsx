'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Globe, ShieldCheck } from 'lucide-react';

function PwaPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait 5 seconds before showing to not annoy user immediately
      setTimeout(() => setShowPrompt(true), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // If already installed, don't show
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="pwa-prompt-container" style={{
      position: 'fixed',
      zIndex: 2000,
      animation: 'slideUpPrompt 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div className="glass-card" style={{ 
        padding: '24px', 
        background: 'white', 
        borderRadius: '32px',
        boxShadow: '0 20px 50px rgba(27, 67, 50, 0.2)',
        border: '2px solid var(--primary)'
      }}>
        <button 
          onClick={() => setShowPrompt(false)}
          style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: '#f1f5f9', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}
        >
          <X size={16} color="#64748b" />
        </button>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: 'var(--accent)', padding: '16px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifySelf: 'center' }}>
            <Smartphone color="var(--primary)" size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#1b4332', fontWeight: 800, marginBottom: '4px' }}>Install CropGuardian</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Add to your home screen for instant field monitoring and faster access.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontSize: '0.75rem', fontWeight: 600 }}>
             <Globe size={14} /> Works Offline
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontSize: '0.75rem', fontWeight: 600 }}>
             <ShieldCheck size={14} /> Full Security
           </div>
        </div>

        <button 
          onClick={handleInstall}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px', 
            fontSize: '1rem',
            background: 'linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)',
            boxShadow: '0 8px 20px rgba(27, 67, 50, 0.25)',
            border: 'none',
            padding: '16px 24px',
            borderRadius: '16px',
            color: 'white',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '100%',
            outline: 'none'
          }}
        >
          <Download size={22} color="white" />
          <span>Add to Home Screen</span>
        </button>
      </div>

      <style jsx>{`
        .pwa-prompt-container {
          bottom: 100px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 40px);
          max-width: 460px;
        }
        @media (min-width: 768px) {
          .pwa-prompt-container {
            bottom: 40px;
            left: auto;
            right: 40px;
            transform: none;
            width: 400px;
          }
        }
        @keyframes slideUpPrompt {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default PwaPrompt;
