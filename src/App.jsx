import React, { useState } from 'react';
import PlankInputForm from './components/PlankInputForm.jsx';
import PlankVisualizer from './components/PlankVisualizer.jsx';
import { calculateCuttingPlan } from './utils/cuttingAlgorithm.js';

// Google Fonts and Material Icons
const materialFont = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap';
const materialIcons = 'https://fonts.googleapis.com/icon?family=Material+Icons';

function getWasteStats(plank, placed) {
  if (!placed || !placed.length) {
    return { wasteArea: plank.width * plank.height };
  }
  const usedArea = placed.reduce((sum, p) => sum + p.width * p.height, 0);
  const wasteArea = plank.width * plank.height - usedArea;
  return { wasteArea };
}

const App = () => {
  const [plank, setPlank] = useState({ width: 2400, height: 1200 });
  const [pieces, setPieces] = useState([
    { width: 600, height: 400, quantity: 2 },
    { width: 300, height: 600, quantity: 3 },
  ]);
  const [cutPlan, setCutPlan] = useState({ placed: [], freeRects: [] });
  const [error, setError] = useState(null);

  const handleCalculate = (plank, pieces) => {
    try {
      const plan = calculateCuttingPlan(plank, pieces);
      setCutPlan(plan);
      setError(null);
    } catch (e) {
      setError(e.message || 'Failed to calculate cutting plan.');
      setCutPlan({ placed: [], freeRects: [] });
    }
  };

  const { wasteArea } = getWasteStats(plank, cutPlan.placed);

  return (
    <div style={{ fontFamily: 'Roboto, Arial, sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Google Fonts and Material Icons */}
      <link rel="stylesheet" href={materialFont} />
      <link rel="stylesheet" href={materialIcons} />
      {/* AppBar */}
      <header style={{
        background: '#1976d2', color: '#fff', padding: '32px 0 24px 0', marginBottom: 32,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center',
      }}>
        <span className="material-icons" style={{ fontSize: 48, verticalAlign: 'middle', marginRight: 12 }}>precision_manufacturing</span>
        <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: 1 }}>Optimal Wood Slicer</span>
        <div style={{ fontSize: 18, fontWeight: 400, marginTop: 8, opacity: 0.85 }}>Interior Team Wood Plank Cutting Optimizer</div>
      </header>
      <div style={{ maxWidth: 1000, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 32 }}>
        <PlankInputForm
          plank={plank}
          pieces={pieces}
          onChangePlank={setPlank}
          onChangePieces={setPieces}
          onCalculate={handleCalculate}
        />
        {error && <div style={{ color: '#d32f2f', marginTop: 16, fontWeight: 500 }}>{error}</div>}
        <PlankVisualizer plank={plank} pieces={cutPlan.placed} />
        {cutPlan.placed.length > 0 && (
          <div style={{ marginTop: 32, textAlign: 'center', fontSize: 20, color: '#1976d2', fontWeight: 500 }}>
            <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: 8 }}>crop_free</span>
            Remaining Plank Area: <b>{wasteArea} mm²</b>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
