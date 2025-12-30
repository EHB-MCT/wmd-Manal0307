import './Charts.css';

export default function PieChart({ data }) {
  const safeData = Array.isArray(data) ? data : [];
  const total = safeData.reduce((sum, item) => sum + item.value, 0) || 1;
  let cumulative = 0;

  return (
    <div className="chart chart--pie">
      <div className="chart__pie">
        {safeData.map((item) => {
          const dash = (item.value / total) * 100;
          const gap = 100 - dash;
          const offset = cumulative;
          cumulative += dash;

          return (
            <div
              key={item.label}
              className="chart__pie-slice"
              style={{
                background: `conic-gradient(${item.color} 0 ${dash}%, transparent ${dash}% 100%)`,
                transform: `rotate(${offset * 3.6}deg)`,
              }}
            />
          );
        })}
      </div>
      <ul className="chart__legend">
        {safeData.map((item) => (
          <li key={item.label}>
            <span className="legend-dot" style={{ background: item.color }} />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
