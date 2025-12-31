import './Charts.css';

export default function BarChart({ data }) {
  const safeData = Array.isArray(data) && data.length ? data : [];
  const maxValue = safeData.length ? Math.max(...safeData.map((item) => item.value)) : 1;

  return (
    <div className="chart chart--bar">
      {safeData.map((item) => (
        <div key={item.label} className="chart__bar-row">
          <span>{item.label}</span>
          <div className="chart__bar">
            <div
              className="chart__bar-fill"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
          <span className="chart__value">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
