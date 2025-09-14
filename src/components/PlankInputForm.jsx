import React from 'react';

const PlankInputForm = ({ plank, pieces, onChangePlank, onChangePieces, onCalculate }) => {
  const handlePlankChange = (e) => {
    const { name, value } = e.target;
    onChangePlank({ ...plank, [name]: Number(value) });
  };

  const handlePieceChange = (idx, field, value) => {
    const updated = pieces.map((p, i) => i === idx ? { ...p, [field]: value } : p);
    onChangePieces(updated);
  };

  const handleAddPiece = () => {
    onChangePieces([...pieces, { width: 100, height: 100, quantity: 1 }]);
  };

  const handleRemovePiece = (idx) => {
    onChangePieces(pieces.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate(plank, pieces);
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: 16, borderRadius: 8 }}>
      <h2>Plank Dimensions</h2>
      <div style={{ display: 'flex', gap: 16 }}>
        <label>
          Width (mm):
          <input type="number" name="width" value={plank.width} min={1} onChange={handlePlankChange} required />
        </label>
        <label>
          Height (mm):
          <input type="number" name="height" value={plank.height} min={1} onChange={handlePlankChange} required />
        </label>
      </div>
      <h2 style={{ marginTop: 24 }}>Pieces</h2>
      {pieces.map((piece, idx) => (
        <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <label>
            Width:
            <input type="number" value={piece.width} min={1} onChange={e => handlePieceChange(idx, 'width', Number(e.target.value))} required />
          </label>
          <label>
            Height:
            <input type="number" value={piece.height} min={1} onChange={e => handlePieceChange(idx, 'height', Number(e.target.value))} required />
          </label>
          <label>
            Qty:
            <input type="number" value={piece.quantity} min={1} onChange={e => handlePieceChange(idx, 'quantity', Number(e.target.value))} required />
          </label>
          <button type="button" onClick={() => handleRemovePiece(idx)} disabled={pieces.length === 1}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={handleAddPiece} style={{ marginBottom: 16 }}>Add Piece</button>
      <br />
      <button type="submit" style={{ marginTop: 8 }}>Calculate</button>
    </form>
  );
};

export default PlankInputForm;
