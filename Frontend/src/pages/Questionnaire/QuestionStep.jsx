import { useEffect, useMemo, useState } from 'react';
import QuestionCard from '../../components/QuestionCard/QuestionCard';
import './Questionnaire.css';

export default function QuestionStep({
  question,
  step,
  total,
  onNext,
  onPrev,
  isFirst,
  isLast,
  profileSegment,
}) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());
  const popularAnswerId = question.popular_answer_id;
  const popularLabel = question.popular_answer_label;
  const popularShare = question.popular_answer_share;
  const answersToRender = useMemo(() => {
    const list = question.answers || [];
    if (question.question_key === 'budget') {
      if (profileSegment === 'luxury_high_spender' || profileSegment === 'premium_target') {
        return [...list].sort((a, b) => b.label.localeCompare(a.label));
      }
      if (profileSegment === 'low_attention') {
        return [...list].sort((a, b) => a.label.localeCompare(b.label));
      }
    }
    return list;
  }, [question, profileSegment]);

  useEffect(() => {
    setSelectedAnswer(null);
    setStartTime(Date.now());
  }, [question]);

  function handleSubmit() {
    if (!selectedAnswer) return;
    const timeSpent = (Date.now() - startTime) / 1000;

    onNext({
      question_id: question.id,
      answer_id: selectedAnswer.id,
      time_spent: timeSpent,
      question_key: question.question_key,
      answer_label: selectedAnswer.label,
    });
  }

  return (
    <div className="question-step">
      <div className="question-step__back">
        {!isFirst && (
          <button type="button" onClick={onPrev} className="link-button">
            ← Terug
          </button>
        )}
      </div>

      <QuestionCard
        title={question.question_text}
        subtitle={question.subtitle}
        progress={`${step} / ${total}`}
      >
        {popularAnswerId && popularLabel && popularShare > 0 && (
          <div className="question-step__insight">
            <span className="insight-label">Collectieve voorkeur</span>
            <p>
              <strong>{popularLabel}</strong> wordt momenteel gekozen door{' '}
              <strong>{popularShare}%</strong> van alle deelnemers.
            </p>
          </div>
        )}

        <div className="question-step__answers">
          {answersToRender.map((answer) => (
            <button
              type="button"
              key={answer.id}
              className={`answer-button ${selectedAnswer?.id === answer.id ? 'is-selected' : ''} ${
                popularAnswerId && popularAnswerId === answer.id ? 'is-popular' : ''
              }`}
              onClick={() => setSelectedAnswer(answer)}
              data-track-id={`answer-${question.id}-${answer.id}`}
              data-track-label={answer.label}
              data-track-hover
            >
              <span className="answer-button__label">
                <span>{answer.label}</span>
                {popularAnswerId && popularAnswerId === answer.id && (
                  <span className="answer-popular">Meest gekozen</span>
                )}
              </span>
            </button>
          ))}
        </div>
        <div className="question-step__actions">
          <button
            type="button"
            className="question-btn question-btn--light"
            disabled={isFirst}
            onClick={onPrev}
            data-track-id="quiz-prev"
          >
            ← Vorige
          </button>
          <button
            type="button"
            className="question-btn question-btn--dark"
            disabled={!selectedAnswer}
            onClick={handleSubmit}
            data-track-id={isLast ? 'quiz-finish' : 'quiz-next'}
            data-track-event={isLast ? 'cta_click' : undefined}
          >
            {isLast ? 'Beëindigen →' : 'Volgende →'}
          </button>
        </div>
      </QuestionCard>
    </div>
  );
}
