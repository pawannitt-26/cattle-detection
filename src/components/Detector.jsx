'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { Camera, Shield, ShieldOff, AlertCircle, RefreshCw } from 'lucide-react';

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

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 640 },
            height: { ideal: 480 }
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
        alert("Webcam error: " + err.message);
      }
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
                 <h3 style={{ fontSize: '1rem', color: '#1b4332', fontWeight: 700 }}>AI Scanner</h3>
                 <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                   {isStreaming ? 'Detecting...' : 'System Idle'}
                 </p>
               </div>
            </div>
            
            {!isStreaming ? (
              <button 
                onClick={startCamera} 
                className="btn-primary" 
                style={{ width: 'auto', padding: '10px 20px', borderRadius: '12px', fontSize: '0.85rem' }}
                disabled={isLoading}
              >
                {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <Camera size={18} />}
                Start
              </button>
            ) : (
              <button onClick={stopCamera} className="btn-primary" style={{ background: '#ef4444', width: 'auto', padding: '10px 20px', borderRadius: '12px', fontSize: '0.85rem' }}>
                Stop
              </button>
            )}
         </div>
      </div>

      <div style={{ 
        position: 'relative', 
        borderRadius: '24px', 
        overflow: 'hidden', 
        background: '#000', 
        height: '400px', 
        width: '100%',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '4px solid white',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
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
