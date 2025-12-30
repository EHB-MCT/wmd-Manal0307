import './QuestionCard.css';

export default function QuestionCard({ title, subtitle, children, progress }) {
  return (
    <section className="question-card">
      <div className="question-card__progress">{progress}</div>
      <h2 className="question-card__title">{title}</h2>
      {subtitle && <p className="question-card__subtitle">{subtitle}</p>}
      <div className="question-card__content">{children}</div>
    </section>
  );
}
