import { useEffect, useState } from 'react';
import './Dashboard.css';
import { getComparisons } from '../../api/adminApi';

export default function ComparisonsAnalytics() {
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await getComparisons();
        if (!isMounted) return;
        setComparisons(data);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setComparisons([]);
        setError('Vergelijkingen konden niet geladen worden.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (value) => {
    if (!value) return '—';
    try {
      return new Date(value).toLocaleString('nl-BE', { hour12: false });
    } catch (error) {
      return value;
    }
  };

  return (
    <section className="panel">
      <h2>Vergelijkingen</h2>
      {loading && <p>Gegevens worden geladen...</p>}
      {error && !loading && <p className="error-text">{error}</p>}
      {!loading && !error && !comparisons.length && <p>Nog geen vergelijkingen.</p>}

      {!loading && comparisons.length > 0 && (
        <table className="analytics-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Gebruiker</th>
              <th>Items</th>
              <th>Winnaars</th>
              <th>Datum</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((comparison) => (
              <tr key={comparison.id}>
                <td>{comparison.id}</td>
                <td>{comparison.user_uid || comparison.user_id}</td>
                <td>{comparison.total_items ?? 0}</td>
                <td>{comparison.winners ?? 0}</td>
                <td>{formatDate(comparison.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
