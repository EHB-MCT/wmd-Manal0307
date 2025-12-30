import { useEffect, useState } from 'react';
import './Dashboard.css';
import { getUsers } from '../../api/adminApi';

export default function UsersAnalytics() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await getUsers();
        if (!isMounted) return;
        setUsers(data);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setUsers([]);
        setError('Gebruikers konden niet geladen worden.');
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
      return new Date(value).toLocaleString('nl-BE', {
        hour12: false,
      });
    } catch (error) {
      return value;
    }
  };

  return (
    <section className="panel">
      <h2>Gebruikers</h2>
      {loading && <p>Gegevens worden geladen...</p>}
      {error && !loading && <p className="error-text">{error}</p>}
      {!loading && !error && !users.length && <p>Nog geen gebruikers geregistreerd.</p>}

      {!loading && users.length > 0 && (
        <table className="analytics-table">
          <thead>
            <tr>
              <th>UID</th>
              <th>Sessies</th>
              <th>Laatste mood</th>
              <th>Quiz voltooid</th>
              <th>Laatst actief</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.uid}>
                <td>{user.uid}</td>
                <td>{user.sessions_count}</td>
                <td>{user.last_mood || '—'}</td>
                <td>{user.quiz_completed ? 'Ja' : 'Nee'}</td>
                <td>{formatDate(user.last_activity_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
