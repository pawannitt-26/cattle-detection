'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { Camera, Shield, ShieldOff, AlertCircle, RefreshCw, Volume2 } from 'lucide-react';

const CATTLE_LABELS = ['cow', 'horse', 'sheep', 'dog', 'goat'];
const THREAT_LABELS = ['bird', 'cat', 'dog'];

function Detector({ onAlert }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [detections, setDetections] = useState([]);
  const [lastAlertTime, setLastAlertTime] = useState(0);
  const [visualAlert, setVisualAlert] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading model:", err);
        setIsLoading(false);
      }
    };
    loadModel();
  }, []);

  const playAlertSound = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const playBeep = (delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime + delay);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.1);
    };

    // Triple beep
    playBeep(0);
    playBeep(0.2);
    playBeep(0.4);
  };

  const startCamera = async () => {
    setCameraError(null);
    
    // Priming the AudioContext on direct user interaction (Sync)
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      // Play a tiny confirmation tick to "unlock" the audio engine
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.warn("Audio Context activation failed:", e);
    }
    
    if (!window.isSecureContext) {
      setCameraError("Camera access requires a secure (HTTPS) connection. Please check your URL.");
      return;
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false,
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setIsStreaming(true);
          };
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        if (err.name === 'NotAllowedError') {
          setCameraError("Camera permission denied. Please enable camera access in your browser settings and refresh.");
        } else if (err.name === 'NotFoundError') {
          setCameraError("No camera found on this device.");
        } else {
          setCameraError(`Camera Error: ${err.message}`);
        }
      }
    } else {
      setCameraError("Your browser does not support camera access.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    let frameId;
    const detect = async () => {
      if (model && isStreaming && videoRef.current && videoRef.current.readyState >= 2) {
        try {
          const predictions = await model.detect(videoRef.current);
          setDetections(predictions);

          predictions.forEach(p => {
            const now = Date.now();
            if (p.score > 0.5 && (CATTLE_LABELS.includes(p.class) || THREAT_LABELS.includes(p.class)) && (now - lastAlertTime > 3000)) {
              onAlert({
                id: now,
                type: CATTLE_LABELS.includes(p.class) ? 'Cattle' : 'Pest',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                status: 'Danger',
                label: `${p.class.toUpperCase()} detected!`
              });
              setLastAlertTime(now);
              setVisualAlert(`${p.class.toUpperCase()} DETECTED!`);
              playAlertSound();
              setTimeout(() => setVisualAlert(null), 2000);
            }
          });

          drawBoxes(predictions);
        } catch (err) {
          console.error("Detection error:", err);
        }
      }
      frameId = requestAnimationFrame(detect);
    };

    if (isStreaming) {
      detect();
    }

    return () => cancelAnimationFrame(frameId);
  }, [model, isStreaming, onAlert, lastAlertTime]);

  const drawBoxes = (predictions) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, 640, 480);

    predictions.forEach(p => {
      const isCattle = CATTLE_LABELS.includes(p.class);
      const isThreat = THREAT_LABELS.includes(p.class);
      const [x, y, width, height] = p.bbox;

      ctx.strokeStyle = isCattle ? '#f59e0b' : (isThreat ? '#ef4444' : '#2d6a4f');
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);

      ctx.fillStyle = isCattle ? '#f59e0b' : (isThreat ? '#ef4444' : '#2d6a4f');
      ctx.fillRect(x, y - 30, ctx.measureText(p.class).width + 30, 30);

      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Inter';
      ctx.fillText(`${p.class}`, x + 10, y - 8);
    });
  };

  return (
    <div className="detector-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="glass-card" style={{ padding: '24px', borderRadius: '24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: isStreaming ? '#dcfce7' : '#fee2e2', padding: '10px', borderRadius: '12px' }}>
              {isStreaming ? <Shield color="#166534" size={20} /> : <ShieldOff color="#991b1b" size={20} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', color: '#1b4332', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                AI Scanner
                {isStreaming && <div className="animate-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {isStreaming ? 'Detecting...' : 'System Idle'}
                {isStreaming && <><Volume2 size={12} /> <span style={{ color: '#166534', fontWeight: 600 }}>• Audio Active</span></>}
              </p>
            </div>
          </div>

          {!isStreaming ? (
            <button
              onClick={startCamera}
              className="btn-primary"
              style={{
                width: 'auto',
                padding: '12px 28px',
                borderRadius: '16px',
                fontSize: '0.9rem',
                background: 'linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)',
                boxShadow: '0 8px 20px rgba(27, 67, 50, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
              disabled={isLoading}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <Camera size={20} />}
              </div>
              <span>{isLoading ? 'Initializing...' : 'Start'}</span>
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="btn-primary"
              style={{
                background: '#ef4444',
                width: 'auto',
                padding: '12px 28px',
                borderRadius: '16px',
                fontSize: '0.9rem',
                boxShadow: '0 8px 20px rgba(239, 68, 68, 0.25)'
              }}
            >
              Stop
            </button>
          )}
        </div>
      </div>

      <div
        className="camera-container"
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          background: '#000',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '4px solid white',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}
      >
        <style jsx>{`
          .camera-container {
            height: 400px;
          }
          @media (min-width: 1024px) {
            .camera-container {
              height: 600px;
            }
          }
        `}</style>
        {cameraError && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(239, 68, 68, 0.9)',
            color: 'white',
            padding: '24px',
            borderRadius: '24px',
            textAlign: 'center',
            width: '80%',
            zIndex: 30,
            backdropFilter: 'blur(10px)',
            border: '2px solid white'
          }}>
            <AlertCircle size={40} style={{ marginBottom: '12px', margin: '0 auto 12px auto' }} />
            <h4 style={{ fontWeight: 800, marginBottom: '8px' }}>Camera Blocked</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>{cameraError}</p>
            <button onClick={startCamera} style={{ marginTop: '16px', background: 'white', color: '#ef4444', border: 'none', padding: '8px 20px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
               Retry Access
            </button>
          </div>
        )}

        {isLoading && (
          <div style={{ color: 'white', textAlign: 'center', zIndex: 20 }}>
            <RefreshCw size={40} className="animate-spin" style={{ marginBottom: '12px', opacity: 0.5 }} />
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>Loading AI Model...</p>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            opacity: isStreaming ? 1 : 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 10
          }}
        />

        {visualAlert && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(239, 68, 68, 0.95)',
            color: 'white',
            padding: '10px 24px',
            borderRadius: '40px',
            fontSize: '0.9rem',
            fontWeight: 800,
            whiteSpace: 'nowrap',
            boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)',
            animation: 'shake 0.5s both',
            zIndex: 1000,
            border: '2px solid white'
          }}>
            ⚠️ {visualAlert}
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '4px' }}>AI Confidence</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1b4332' }}>94%</div>
        </div>
        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '4px' }}>Latency</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2d6a4f' }}>14ms</div>
        </div>
      </div>
    </div>
  );
}

export default Detector;
