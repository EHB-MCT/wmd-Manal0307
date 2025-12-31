import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionStep from './QuestionStep';
import './Questionnaire.css';
import { startSession, endSession } from '../../api/sessionApi';
import { getQuestions, sendAnswer } from '../../api/questionnaireApi';
import usePageTracking from '../../hooks/usePageTracking';
import { ensureUser } from '../../utils/user';
import useUserProfile from '../../hooks/useUserProfile';

const FALLBACK_QUESTIONS = [
  {
    id: 1,
    order: 1,
    question_text: 'Hoe voelt u zich vandaag?',
    subtitle: 'Uw humeur beïnvloedt uw perceptie',
    question_key: 'mood',
    answers: [
      { id: 11, label: 'Kalm & sereen' },
      { id: 12, label: 'Energiek & dynamisch' },
      { id: 13, label: 'Romantisch & dromerig' },
      { id: 14, label: 'Zelfzeker & krachtig' },
      { id: 15, label: 'Mysterieus & diep' },
    ],
  },
  {
    id: 2,
    order: 2,
    question_text: 'Wat is uw levensstijl?',
    subtitle: 'Uw dagelijkse ritme stuurt uw geurkeuze',
    question_key: 'lifestyle',
    answers: [
      { id: 21, label: 'Actief & sportief' },
      { id: 22, label: 'Raffiné & elegant' },
      { id: 23, label: 'Avondmens & sociaal' },
      { id: 24, label: 'Zakelijk & rustig' },
      { id: 25, label: 'Relax & casual' },
    ],
  },
  {
    id: 3,
    order: 3,
    question_text: 'Welke geurfamilie spreekt u aan?',
    subtitle: 'Uw instinct leidt de keuze',
    question_key: 'scent_family',
    answers: [
      { id: 31, label: 'Fris — Citrus, aquatisch' },
      { id: 32, label: 'Floraal — Roos, jasmijn' },
      { id: 33, label: 'Houtachtig — Sandelhout, ceder' },
      { id: 34, label: 'Oriëntaals — Amber, vanille' },
      { id: 35, label: 'Kruidig — Kaneel, peper' },
    ],
  },
  {
    id: 4,
    order: 4,
    question_text: 'Welke intensiteit verkiest u?',
    subtitle: 'Van subtiel tot uitgesproken',
    question_key: 'intensity',
    answers: [
      { id: 41, label: 'Discreet — dicht op de huid' },
      { id: 42, label: 'Aanwezig — mooi in balans' },
      { id: 43, label: 'Statement — niet te negeren' },
    ],
  },
  {
    id: 5,
    order: 5,
    question_text: 'Welk budget voorziet u?',
    subtitle: 'Wij stemmen onze suggesties af op uw investering',
    question_key: 'budget',
    answers: [
      { id: 51, label: 'Tot €150' },
      { id: 52, label: '€150 - €250' },
      { id: 53, label: 'Meer dan €250' },
    ],
  },
];

export default function Questionnaire() {
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  usePageTracking('questionnaire');
  const { profile, latestAction, refreshProfile } = useUserProfile();

  const currentQuestion = useMemo(() => questions[step], [questions, step]);

  useEffect(() => {
    async function setup() {
      try {
        const newUser = await ensureUser();
        setUser(newUser);

        const session = await startSession(newUser.uid);
        setSessionId(session.id);

        try {
          const remoteQuestions = await getQuestions();
          setQuestions(remoteQuestions?.length ? remoteQuestions : FALLBACK_QUESTIONS);
        } catch (error) {
          setQuestions(FALLBACK_QUESTIONS);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    setup();
  }, []);

  async function handleNext(answerPayload) {
    if (!user) return;

    try {
      await sendAnswer({
        uid: user.uid,
        ...answerPayload,
      });
      await refreshProfile();
    } catch (error) {
      console.error(error);
    }

    if (step < questions.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      if (sessionId) {
        await endSession(sessionId, { completed: true });
      }
      navigate('/resultaten');
    }
  }

  function handlePrev() {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  }

  if (loading || !currentQuestion) {
    return <p className="questionnaire-loading">Laden...</p>;
  }

  return (
    <>
      {(profile || latestAction) && (
        <div
          className={`questionnaire-nudge questionnaire-nudge--${profile?.segment || 'default'} ${
            latestAction?.action_type === 'flag' ? 'questionnaire-nudge--alert' : ''
          }`}
        >
          {profile?.segment === 'luxury_high_spender' &&
            'Wij selecteren alvast de meest exclusieve geuren voor u.'}
          {profile?.segment === 'premium_target' && 'Nog één vraag verwijderd van uw premium selectie.'}
          {profile?.segment === 'low_attention' &&
            'Blijf erbij – hoe sneller u kiest, hoe beter we u kunnen matchen.'}
          {!profile && !latestAction && 'Uw antwoorden verfijnen elk advies; neem uw tijd.'}
          {latestAction?.action_type === 'flag' && (
            <span className="questionnaire-nudge__action">
              Admin-opvolging: voltooi elke vraag om uw profiel actief te houden.
            </span>
          )}
          {latestAction?.action_type === 'promote' && (
            <span className="questionnaire-nudge__action">
              U kreeg zonet een exclusieve aanbieding — werk de vragenlijst af voor directe toegang.
            </span>
          )}
        </div>
      )}
      <QuestionStep
        question={currentQuestion}
        step={step + 1}
        total={questions.length}
        onNext={handleNext}
        onPrev={handlePrev}
        isFirst={step === 0}
        isLast={step === questions.length - 1}
        profileSegment={profile?.segment}
      />
    </>
  );
}
