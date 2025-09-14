import React from 'react';

const COLORS = [
  '#4F8A8B', '#FBD46D', '#F76B8A', '#A8D8EA', '#FFB677', '#D7263D', '#1B1B1E', '#A2D5C6', '#0779E4', '#FFC93C'
];

const rotateIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" style={{ verticalAlign: 'middle', marginLeft: 2 }}>
    <path d="M7.11 8.53A5.978 5.978 0 0 1 12 6c1.63 0 3.09.66 4.19 1.74l-1.42 1.42C14.07 8.44 13.07 8 12 8c-2.21 0-4 1.79-4 4h3l-4 4-4-4h3c0-2.21 1.79-4 4-4 .55 0 1.08.11 1.57.29l1.54-1.54C13.09 6.66 12.55 6.5 12 6.5c-2.76 0-5 2.24-5 5h-2l3 3 3-3h-2c0-1.1.9-2 2-2z" fill="#1976d2"/>
  </svg>
);

const PlankVisualizer = ({ plank, pieces }) => {
  // Scale to fit SVG viewport
  const maxW = 700, maxH = 350;
  const scale = Math.min(maxW / plank.width, maxH / plank.height);

  return (
    <div style={{ marginTop: 32 }}>
      <h2>Cutting Plan</h2>
      <svg
        width={plank.width * scale + 2}
        height={plank.height * scale + 2}
        style={{ border: '2px solid #333', background: '#fff' }}
      >
        {/* Plank outline */}
        <rect
          x={1}
          y={1}
          width={plank.width * scale}
          height={plank.height * scale}
          fill="#f4f4f4"
          stroke="#333"
          strokeWidth={2}
        />
        {/* Pieces */}
        {pieces.map((piece, i) => (
          <g key={i}>
            <rect
              x={piece.x * scale + 1}
              y={piece.y * scale + 1}
              width={piece.width * scale}
              height={piece.height * scale}
              fill={COLORS[piece.index % COLORS.length]}
              stroke="#222"
              strokeWidth={1}
              opacity={0.85}
            />
            <text
              x={(piece.x + piece.width / 2) * scale + 1}
              y={(piece.y + piece.height / 2) * scale + 1}
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize={14}
              fill="#222"
              style={{ pointerEvents: 'none', fontWeight: 600 }}
            >
              {piece.rotated
                ? `${piece.height}×${piece.width} #${piece.count} (rot)`
                : `${piece.width}×${piece.height} #${piece.count}`}
            </text>
            {/* Rotation icon for rotated pieces */}
            {piece.rotated && (
              <text
                x={(piece.x + piece.width / 2) * scale + 1}
                y={(piece.y + piece.height / 2) * scale + 18}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize={12}
                fill="#1976d2"
                style={{ pointerEvents: 'none', fontWeight: 400 }}
              >
                ⟳ Rotated
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default PlankVisualizer;
