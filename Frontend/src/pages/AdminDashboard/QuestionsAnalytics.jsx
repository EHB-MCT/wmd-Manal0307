import './Dashboard.css';

export default function QuestionsAnalytics({ stats, loading, error }) {
  const hasData = Array.isArray(stats) && stats.length > 0;

  return (
    <section className="panel">
      <h2>Analyse per vraag</h2>
      {loading && <p>Gegevens worden geladen...</p>}
      {error && !loading && <p className="error-text">{error}</p>}
      {!loading && !error && !hasData && <p>Geen antwoorden geregistreerd.</p>}

      {!loading && hasData && (
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Vraag</th>
              <th>Gemiddelde tijd</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat) => (
              <tr key={stat.id}>
                <td>{stat.question_text}</td>
                <td>{Number(stat.avg_time || 0).toFixed(1)}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
