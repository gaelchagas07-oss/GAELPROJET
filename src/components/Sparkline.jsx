export default function Sparkline({ data, width = 120, height = 36, color = '#16a34a', strokeWidth = 2 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 0);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const stepX = data.length > 1 ? width / (data.length - 1) : 0;
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y];
  });
  const pointsStr = points.map((p) => p.join(',')).join(' ');
  const areaStr = `0,${height} ${pointsStr} ${width},${height}`;
  const last = points[points.length - 1];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', overflow: 'visible' }}>
      <polygon points={areaStr} fill={color} fillOpacity={0.12} stroke="none" />
      <polyline
        points={pointsStr}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last[0]} cy={last[1]} r={3} fill={color} />
    </svg>
  );
}
