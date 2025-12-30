import { useEffect, useState } from 'react';
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
}) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());

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
        <div className="question-step__answers">
          {(question.answers || []).map((answer) => (
            <button
              type="button"
              key={answer.id}
              className={`answer-button ${
                selectedAnswer?.id === answer.id ? 'is-selected' : ''
              }`}
              onClick={() => setSelectedAnswer(answer)}
              data-track-id={`answer-${question.id}-${answer.id}`}
              data-track-label={answer.label}
              data-track-hover
            >
              {answer.label}
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
