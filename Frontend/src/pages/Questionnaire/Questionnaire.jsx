import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionStep from './QuestionStep';
import './Questionnaire.css';
import { startSession, endSession } from '../../api/sessionApi';
import { getQuestions, sendAnswer } from '../../api/questionnaireApi';
import usePageTracking from '../../hooks/usePageTracking';
import { ensureUser } from '../../utils/user';

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
    subtitle: 'Laat uw dagelijkse energie spreken',
    question_key: 'lifestyle',
    answers: [
      { id: 21, label: 'Minimalistisch' },
      { id: 22, label: 'Creatief' },
      { id: 23, label: 'Avontuurlijk' },
      { id: 24, label: 'Luxueus' },
    ],
  },
  {
    id: 3,
    order: 3,
    question_text: 'Welke geurfamilie spreekt u aan?',
    subtitle: 'Uw instinct leidt de keuze',
    question_key: 'scent_family',
    answers: [
      { id: 31, label: 'Bloemig' },
      { id: 32, label: 'Houtachtig' },
      { id: 33, label: 'Oriëntaals' },
      { id: 34, label: 'Citrus & fris' },
    ],
  },
  {
    id: 4,
    order: 4,
    question_text: 'Welke intensiteit verkiest u?',
    subtitle: 'Van subtiel tot hypnotiserend',
    question_key: 'intensity',
    answers: [
      { id: 41, label: 'Discreet' },
      { id: 42, label: 'Aanwezig' },
      { id: 43, label: 'Betoverend' },
    ],
  },
  {
    id: 5,
    order: 5,
    question_text: 'Welk budget voorziet u?',
    subtitle: 'Uw investering in een signatuur',
    question_key: 'budget',
    answers: [
      { id: 51, label: 'Tot €50' },
      { id: 52, label: '€50 - €100' },
      { id: 53, label: '€100 - €200' },
      { id: 54, label: 'Meer dan €200' },
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
    <QuestionStep
      question={currentQuestion}
      step={step + 1}
      total={questions.length}
      onNext={handleNext}
      onPrev={handlePrev}
      isFirst={step === 0}
      isLast={step === questions.length - 1}
    />
  );
}
