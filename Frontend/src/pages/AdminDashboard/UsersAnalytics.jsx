import { useCallback, useEffect, useMemo, useState } from 'react';
import './Dashboard.css';
import { getUserDetail, getUsers } from '../../api/adminApi';

const DEFAULT_FILTERS = {
  from: '',
  to: '',
  device: '',
};

export default function UsersAnalytics() {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);
  const [searchDraft, setSearchDraft] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedUid, setSelectedUid] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  const [filterDraft, setFilterDraft] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    setUsersLoading(true);

    async function loadUsers() {
      try {
        const params = searchQuery ? { search: searchQuery } : {};
        const data = await getUsers(params);
        if (!isMounted) return;
        setUsers(data);
        setUsersError(null);
        setSelectedUid((prev) => {
          if (prev && data.some((item) => item.uid === prev)) {
            return prev;
          }
          return data[0]?.uid || null;
        });
      } catch (error) {
        if (!isMounted) return;
        setUsers([]);
        setUsersError('Gebruikers konden niet geladen worden.');
      } finally {
        if (isMounted) {
          setUsersLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, [searchQuery]);

  const sanitizedFilters = useMemo(() => {
    return Object.fromEntries(
      Object.entries(appliedFilters).filter(([, value]) => Boolean(value && value.trim?.() !== ''))
    );
  }, [appliedFilters]);

  const loadDetail = useCallback(async () => {
    if (!selectedUid) {
      setDetail(null);
      return;
    }
    setDetailLoading(true);
    try {
      const data = await getUserDetail(selectedUid, sanitizedFilters);
      setDetail(data);
      setDetailError(null);
    } catch (error) {
      setDetail(null);
      setDetailError('Details konden niet geladen worden.');
    } finally {
      setDetailLoading(false);
    }
  }, [selectedUid, sanitizedFilters]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

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

  const formatMetadata = (metadata) => {
    if (!metadata || typeof metadata !== 'object') return '—';
    const keys = ['label', 'id', 'route', 'percentage', 'x', 'y', 'key'];
    const parts = keys
      .map((key) => {
        if (metadata[key] === undefined || metadata[key] === null || metadata[key] === '') {
          return null;
        }
        return `${key}: ${metadata[key]}`;
      })
      .filter(Boolean);

    if (parts.length) {
      return parts.join(' · ');
    }

    const fallback = Object.entries(metadata)
      .slice(0, 3)
      .map(([key, value]) => `${key}: ${value}`);
    return fallback.length ? fallback.join(' · ') : '—';
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchQuery(searchDraft.trim());
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilterDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiltersSubmit = (event) => {
    event.preventDefault();
    setAppliedFilters(filterDraft);
  };

  const handleResetFilters = () => {
    setFilterDraft(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  const handleAction = (type) => {
    const message =
      type === 'risk'
        ? 'Gebruiker gemarkeerd als risicovol segment.'
        : 'Persoonlijke promotie verstuurd.';
    setActionMessage(message);
    setTimeout(() => setActionMessage(''), 3500);
  };

  const profileTraits = useMemo(() => {
    const traits = detail?.profile?.traits || {};
    return Object.entries(traits)
      .filter(([, value]) => Boolean(value))
      .map(([key, value]) => `${key}: ${value}`);
  }, [detail]);

  const sessions = detail?.sessions ?? [];
  const interactions = detail?.interactions ?? [];
  const answers = detail?.answers ?? [];
  const comparisons = detail?.comparisons ?? [];

  return (
    <section className="panel users-panel">
      <div className="users-list">
        <div className="users-list__header">
          <h2>Gebruikers</h2>
          <form className="users-search" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              placeholder="Zoek op UID…"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
            />
            <button type="submit">Zoek</button>
          </form>
        </div>

        {usersLoading && <p>Gegevens worden geladen...</p>}
        {usersError && !usersLoading && <p className="error-text">{usersError}</p>}
        {!usersLoading && !usersError && !users.length && <p>Nog geen gebruikers geregistreerd.</p>}

        {!usersLoading && users.length > 0 && (
          <table className="analytics-table selectable">
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
                <tr
                  key={user.uid}
                  className={user.uid === selectedUid ? 'selected' : ''}
                  onClick={() => setSelectedUid(user.uid)}
                >
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
      </div>

      <div className="user-detail">
        <div className="user-detail__header">
          <div>
            <h2>Detail</h2>
            {selectedUid && <p className="detail-subtitle">UID: {selectedUid}</p>}
          </div>
          <div className="detail-actions">
            <button type="button" onClick={() => handleAction('risk')} disabled={!selectedUid}>
              Markeer riskant
            </button>
            <button type="button" onClick={() => handleAction('promote')} disabled={!selectedUid}>
              Stuur promotie
            </button>
          </div>
        </div>

        {actionMessage && <p className="action-message">{actionMessage}</p>}

        <form className="detail-filters" onSubmit={handleFiltersSubmit}>
          <label>
            Van
            <input type="date" name="from" value={filterDraft.from} onChange={handleFilterChange} />
          </label>
          <label>
            Tot
            <input type="date" name="to" value={filterDraft.to} onChange={handleFilterChange} />
          </label>
          <label>
            Device
            <input
              type="text"
              name="device"
              placeholder="mobile, Chrome…"
              value={filterDraft.device}
              onChange={handleFilterChange}
            />
          </label>
          <div className="filter-actions">
            <button type="submit" disabled={!selectedUid}>
              Filters toepassen
            </button>
            <button type="button" onClick={handleResetFilters}>
              Reset
            </button>
          </div>
        </form>

        {detailLoading && <p>Details worden geladen…</p>}
        {detailError && !detailLoading && <p className="error-text">{detailError}</p>}
        {!detailLoading && !detailError && !detail && <p>Selecteer een gebruiker links.</p>}

        {!detailLoading && detail && (
          <div className="detail-grid">
            <section className="detail-card">
              <h3>Profielscore</h3>
              <p className="detail-score">{detail.profile?.score ?? 0}</p>
              <p className="detail-segment">{detail.profile?.segment || 'segment onbekend'}</p>
              <div className="detail-chips">
                {profileTraits.length ? (
                  profileTraits.map((trait) => (
                    <span key={trait} className="chip">
                      {trait}
                    </span>
                  ))
                ) : (
                  <span className="muted">Nog geen antwoorden gekend.</span>
                )}
              </div>
            </section>

            <section className="detail-card">
              <h3>Laatste sessies</h3>
              <table className="mini-table">
                <thead>
                  <tr>
                    <th>Gestart</th>
                    <th>Duur (s)</th>
                    <th>Voltooid</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.slice(0, 5).map((session) => (
                    <tr key={session.id}>
                      <td>{formatDate(session.started_at)}</td>
                      <td>{Number(session.duration || 0).toFixed(1)}</td>
                      <td>{session.completed ? 'Ja' : 'Nee'}</td>
                    </tr>
                  ))}
                  {!sessions.length && (
                    <tr>
                      <td colSpan={3}>Geen sessies geregistreerd.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>

            <section className="detail-card wide">
              <h3>Recentste interacties</h3>
              <table className="mini-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Metadata</th>
                    <th>Tijdstip</th>
                  </tr>
                </thead>
                <tbody>
                  {interactions.slice(0, 8).map((interaction) => (
                    <tr key={interaction.id}>
                      <td>{interaction.event_type}</td>
                      <td>{formatMetadata(interaction.metadata)}</td>
                      <td>{formatDate(interaction.timestamp)}</td>
                    </tr>
                  ))}
                  {!interactions.length && (
                    <tr>
                      <td colSpan={3}>Nog geen events gelogd.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>

            <section className="detail-card">
              <h3>Laatste antwoorden</h3>
              <ul className="detail-list">
                {answers.slice(0, 5).map((answer) => (
                  <li key={answer.id}>
                    <strong>{answer.question?.question_text}</strong>
                    <span>{answer.answer?.label || '—'}</span>
                    <span className="muted">{Number(answer.time_spent || 0).toFixed(1)} s</span>
                  </li>
                ))}
                {!answers.length && <li className="muted">Geen antwoorden gevonden.</li>}
              </ul>
            </section>

            <section className="detail-card">
              <h3>Vergelijkingen</h3>
              <ul className="detail-list">
                {comparisons.slice(0, 5).map((comparison) => (
                  <li key={comparison.id}>
                    <strong>{formatDate(comparison.created_at)}</strong>
                    <span>
                      Winnaar:{' '}
                      {comparison.items?.find((item) => item.is_winner)?.perfume?.name || '—'}
                    </span>
                  </li>
                ))}
                {!comparisons.length && (
                  <li className="muted">Nog geen vergelijkingen voor deze gebruiker.</li>
                )}
              </ul>
            </section>
          </div>
        )}
      </div>
    </section>
  );
}
