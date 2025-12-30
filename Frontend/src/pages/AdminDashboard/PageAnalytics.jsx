import './Dashboard.css';

export default function PageAnalytics({ stats }) {
  const hasData = Array.isArray(stats) && stats.length > 0;

  return (
    <section className="panel">
      <h3>Pagina-interacties</h3>
      {!hasData ? (
        <p>Nog geen interacties geregistreerd.</p>
      ) : (
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Pagina</th>
              <th>Gem. duur (s)</th>
              <th>Totaal tijd (s)</th>
              <th>Bezoeken</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((item) => (
              <tr key={item.page}>
                <td>{item.page}</td>
                <td>{Number(item.avg_duration || 0).toFixed(1)}</td>
                <td>{Number(item.total_duration || 0).toFixed(1)}</td>
                <td>{item.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
