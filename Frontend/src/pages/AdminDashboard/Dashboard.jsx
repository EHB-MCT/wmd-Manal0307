import { useEffect, useState } from 'react';
import './Dashboard.css';
import { getOverview, getQuestionStats } from '../../api/adminApi';
import BarChart from '../../components/Charts/BarChart';
import PieChart from '../../components/Charts/PieChart';
import QuestionsAnalytics from './QuestionsAnalytics';
import UsersAnalytics from './UsersAnalytics';
import ComparisonsAnalytics from './ComparisonsAnalytics';
import PageAnalytics from './PageAnalytics';
import usePageTracking from '../../hooks/usePageTracking';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [questionStats, setQuestionStats] = useState([]);
  const [overviewError, setOverviewError] = useState(null);
  const [questionsError, setQuestionsError] = useState(null);
  const [isOverviewLoading, setIsOverviewLoading] = useState(true);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(true);
  usePageTracking('dashboard');

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await getOverview();
        if (!isMounted) return;
        setOverview(data);
        setOverviewError(null);
      } catch (error) {
        if (!isMounted) return;
        setOverview(null);
        setOverviewError('Statistieken konden niet geladen worden.');
      } finally {
        if (isMounted) {
          setIsOverviewLoading(false);
        }
      }

      try {
        const stats = await getQuestionStats();
        if (!isMounted) return;
        setQuestionStats(stats);
        setQuestionsError(null);
      } catch (error) {
        if (!isMounted) return;
        setQuestionStats([]);
        setQuestionsError('Vraagstatistieken konden niet geladen worden.');
      } finally {
        if (isMounted) {
          setIsQuestionsLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const barData = questionStats
    .filter((stat) => stat?.question_text)
    .map((stat) => ({
      label: stat.question_text,
      value: Number(stat.avg_time ?? 0),
    }));

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <button
          type="button"
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overzicht
        </button>
        <button
          type="button"
          className={activeTab === 'questions' ? 'active' : ''}
          onClick={() => setActiveTab('questions')}
        >
          Vragen
        </button>
        <button
          type="button"
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Gebruikers
        </button>
        <button
          type="button"
          className={activeTab === 'comparisons' ? 'active' : ''}
          onClick={() => setActiveTab('comparisons')}
        >
          Vergelijkingen
        </button>
      </aside>

      <main className="content">
        {activeTab === 'overview' && (
          <>
            <h1>Dashboard</h1>
            <p className="section-subtitle">Globale performance van de quizervaring</p>

            {isOverviewLoading && <p>Statistieken worden geladen...</p>}
            {overviewError && !overview && <p className="error-text">{overviewError}</p>}

            {overview && (
              <>
                <div className="dashboard-cards">
                  <div className="card">
                    <span>Quiz voltooid</span>
                    <strong>{overview.total_quizzes}</strong>
                    <p className="trend">Realtime</p>
                  </div>
                  <div className="card">
                    <span>Gemiddelde duur</span>
                    <strong>{Number(overview.avg_quiz_time ?? 0).toFixed(1)} s</strong>
                    <p className="trend success">Gemiddelde per vraag</p>
                  </div>
                  <div className="card">
                    <span>Afhaakpercentage</span>
                    <strong>{Number(overview.abandon_rate ?? 0).toFixed(1)}%</strong>
                    <p className="trend warning">Van alle antwoorden</p>
                  </div>
                  <div className="card">
                    <span>Vergelijkingen</span>
                    <strong>{overview.total_comparisons}</strong>
                    <p className="trend">Totaal gemaakt</p>
                  </div>
                </div>

                <div className="dashboard-panels">
                  <div className="panel">
                    <h3>Gemiddelde tijd per vraag</h3>
                    {isQuestionsLoading ? (
                      <p>Vraagstatistieken laden...</p>
                    ) : barData.length ? (
                      <BarChart data={barData} />
                    ) : (
                      <p>Nog geen antwoorden geregistreerd.</p>
                    )}
                  </div>
                  <div className="panel">
                    <h3>Verdeling van stemmingen</h3>
                    {overview.mood_distribution?.length ? (
                      <PieChart data={overview.mood_distribution} />
                    ) : (
                      <p>Nog geen mood-data beschikbaar.</p>
                    )}
                  </div>
                </div>

                <PageAnalytics stats={overview.page_stats} />
              </>
            )}
          </>
        )}

        {activeTab === 'questions' && (
          <QuestionsAnalytics stats={questionStats} loading={isQuestionsLoading} error={questionsError} />
        )}
        {activeTab === 'users' && <UsersAnalytics />}
        {activeTab === 'comparisons' && <ComparisonsAnalytics />}
      </main>
    </div>
  );
}
