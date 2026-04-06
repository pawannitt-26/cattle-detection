'use client';

import React, { useState } from 'react';
import { Search, Bug, Wind, Droplets, Leaf, ShieldAlert, CheckCircle2, ChevronRight, X } from 'lucide-react';

const PEST_DATA = [
  {
    id: 1,
    name: 'Desert Locust',
    scientific: 'Schistocerca gregaria',
    threat: 'Critical',
    crops: ['Wheat', 'Maize', 'Barley'],
    description: 'Highly mobile and destructive, can consume their own weight in food every day. Found in massive swarms.',
    prevention: 'Early detection in breeding areas and targeted mapping.',
    solution: 'Bio-pesticides or coordinated chemical spraying in safe zones.',
    icon: Wind,
    color: '#991b1b',
    bg: '#fee2e2'
  },
  {
    id: 2,
    name: 'Peach Aphid',
    scientific: 'Myzus persicae',
    threat: 'Moderate',
    crops: ['Potato', 'Tobacco', 'Cabbage'],
    description: 'Small sap-sucking insects that transmit over 100 different plant viruses.',
    prevention: 'Maintain healthy soil and encourage natural predators like ladybugs.',
    solution: 'Neem oil sprays or soap-water solution for small outbreaks.',
    icon: Droplets,
    color: '#92400e',
    bg: '#fef3c7'
  },
  {
    id: 3,
    name: 'Potato Beetle',
    scientific: 'Leptinotarsa decemlineata',
    threat: 'High',
    crops: ['Potato', 'Tomato', 'Eggplant'],
    description: 'Stripped beetles that can completely defoliate plants if left unchecked.',
    prevention: 'Crop rotation and plastic-lined trenches to catch migrating beetles.',
    solution: 'Manual removal for small farms; organic Spinosad for larger ones.',
    icon: Bug,
    color: '#b91c1c',
    bg: '#fef2f2'
  },
  {
    id: 4,
    name: 'Fall Armyworm',
    scientific: 'Spodoptera frugiperda',
    threat: 'Critical',
    crops: ['Maize', 'Sorghum', 'Rice'],
    description: 'Larvae that hide in the whorls of maize plants, eating from the inside out.',
    prevention: 'Intercropping with pest-repellent plants like Desmodium.',
    solution: 'Pheromone traps to monitor and early-stage Bt-based insecticides.',
    icon: ShieldAlert,
    color: '#991b1b',
    bg: '#fee2e2'
  },
  {
    id: 5,
    name: 'Whiteflies',
    scientific: 'Aleyrodidae',
    threat: 'Low-Moderate',
    crops: ['Cotton', 'Tomato', 'Cassava'],
    description: 'Tiny white insects that cluster on the underside of leaves and excrete honeydew.',
    prevention: 'Reflective mulches and yellow sticky traps to capture adults.',
    solution: 'Introduce parasitic wasps or use insecticidal soaps.',
    icon: Leaf,
    color: '#3f6212',
    bg: '#f0fdf4'
  },
  {
    id: 6,
    name: 'Cotton Bollworm',
    scientific: 'Helicoverpa armigera',
    threat: 'Critical',
    crops: ['Cotton', 'Chickpea', 'Tomato'],
    description: 'Highly polyphagous pest that bores into reproductive parts, causing direct yield loss.',
    prevention: 'Planting trap crops like marigold and sunflower around the field.',
    solution: 'Use NPV (Nuclear Polyhedrosis Virus) or neem-based biopesticides.',
    icon: Bug,
    color: '#991b1b',
    bg: '#fee2e2'
  },
  {
    id: 7,
    name: 'Spider Mites',
    scientific: 'Tetranychidae',
    threat: 'Moderate',
    crops: ['Bean', 'Cucumber', 'Strawberry'],
    description: 'Minute pests that spin silk webs and suck plant juices, causing stippling on leaves.',
    prevention: 'Maintain high humidity and avoid excessive nitrogen fertilizers.',
    solution: 'Sulfur-based sprays or predatory mites (Phytoseiulus persimilis).',
    icon: Wind,
    color: '#92400e',
    bg: '#fef3c7'
  },
  {
    id: 8,
    name: 'Mealybugs',
    scientific: 'Pseudococcidae',
    threat: 'High',
    crops: ['Grapes', 'Citrus', 'Papaya'],
    description: 'White, waxy-coated insects that cluster in leaf axils and secrete honey-dew leading to sooty mold.',
    prevention: 'Destroy ant nests around plants, as ants "farm" and protect mealybugs.',
    solution: 'Horticultural oils or alcohol-based spot treatments for small areas.',
    icon: ShieldAlert,
    color: '#b91c1c',
    bg: '#fef2f2'
  },
  {
    id: 9,
    name: 'Diamondback Moth',
    scientific: 'Plutella xylostella',
    threat: 'High',
    crops: ['Cabbage', 'Cauliflower', 'Mustard'],
    description: 'Small caterpillars that eat the lower leaf surface, leaving "windows" of upper epidermis.',
    prevention: 'Crop rotation and intercropping with carrot or tomato.',
    solution: 'Bacillus thuringiensis (Bt) sprays used at short intervals.',
    icon: Leaf,
    color: '#3f6212',
    bg: '#f0fdf4'
  },
  {
    id: 10,
    name: 'Slugs & Snails',
    scientific: 'Gastropoda',
    threat: 'Low-Moderate',
    crops: ['Lettuce', 'Hostas', 'Seedlings'],
    description: 'Nocturnal mollusks that chew large, ragged holes in leaves and can eat entire seedlings overnight.',
    prevention: 'Remove garden debris and use copper tape barriers around beds.',
    solution: 'Iron phosphate baits or beer traps at ground level.',
    icon: Droplets,
    color: '#1e40af',
    bg: '#dbeafe'
  }
];

function PestWiki() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPest, setSelectedPest] = useState(null);

  const filteredPests = PEST_DATA.filter(pest => 
    pest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    pest.crops.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="pest-wiki-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="glass-card" style={{ padding: '24px', borderRadius: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1b4332', marginBottom: '16px' }}>Pest Directory</h2>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="#64748b" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search pests or crops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 14px 14px 48px',
              borderRadius: '16px',
              border: '2px solid #e2e8f0',
              background: '#f8fafc',
              fontSize: '0.9rem',
              fontWeight: 500,
              outline: 'none',
              transition: 'all 0.3s ease',
              color: '#1b4332'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {filteredPests.map(pest => (
          <div 
            key={pest.id} 
            className="glass-card" 
            onClick={() => setSelectedPest(pest)}
            style={{ 
              padding: '20px', 
              borderRadius: '24px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
             <div style={{ background: pest.bg, padding: '12px', borderRadius: '16px', minWidth: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <pest.icon color={pest.color} size={24} />
             </div>
             
             <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.05rem', color: '#1b4332', fontWeight: 800 }}>{pest.name}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                   {pest.crops.slice(0, 2).map(crop => (
                     <span key={crop} style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>{crop}</span>
                   ))}
                </div>
             </div>

             <div className="badge" style={{ background: pest.bg, color: pest.color, fontSize: '0.6rem' }}>
                {pest.threat}
             </div>
          </div>
        ))}
      </div>

      {selectedPest && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.4)', 
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center', 
          zIndex: 2000 
        }} onClick={() => setSelectedPest(null)}>
          <div className="glass-card" style={{ 
            maxWidth: '500px', width: '100%', 
            maxHeight: '85vh', overflowY: 'auto', 
            background: 'white', borderRadius: '32px 32px 0 0',
            padding: '40px 32px 32px 32px', position: 'relative',
            animation: 'slideUp 0.4s ease-out'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ width: '40px', height: '4px', background: '#e2e8f0', borderRadius: '2px', position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
               <div style={{ background: selectedPest.bg, padding: '20px', borderRadius: '24px' }}>
                  <selectedPest.icon color={selectedPest.color} size={32} />
               </div>
               <div>
                  <h2 style={{ fontSize: '1.75rem', color: '#1b4332', fontWeight: 800 }}>{selectedPest.name}</h2>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>{selectedPest.scientific}</p>
               </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
               <div>
                  <h4 style={{ color: '#1b4332', marginBottom: '8px', fontSize: '1rem', fontWeight: 800 }}>Symptoms</h4>
                  <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.9rem' }}>{selectedPest.description}</p>
               </div>
               <div>
                  <h4 style={{ color: '#1b4332', marginBottom: '8px', fontSize: '1rem', fontWeight: 800 }}>Prevention</h4>
                  <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.9rem' }}>{selectedPest.prevention}</p>
               </div>
            </div>

            <div style={{ marginTop: '32px', padding: '24px', background: '#f0fdf4', borderRadius: '20px', border: '1px solid #dcfce7' }}>
               <h4 style={{ color: '#166534', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 800 }}>Recommended Solution</h4>
               <p style={{ color: '#166534', fontWeight: 600, fontSize: '1rem' }}>{selectedPest.solution}</p>
            </div>
            
            <button 
              onClick={() => setSelectedPest(null)}
              className="btn-primary"
              style={{ 
                marginTop: '32px', 
                background: '#f8fafc', 
                color: '#1b4332', 
                border: '2px solid #e2e8f0',
                padding: '14px',
                fontSize: '0.95rem'
              }}
            >
              <ChevronRight size={18} style={{ transform: 'rotate(180deg)', marginRight: '8px' }} />
              Back to Pest Directory
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PestWiki;
