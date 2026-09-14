import { ArrowRight, BookOpenText, ChatCircleText, CheckCircle, PuzzlePiece } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { publicAssetPath } from '../deployment'

const learningSteps = [
  {
    label: 'Vocabulary',
    description: 'Learn useful Korean words',
    to: '/vocabulary',
    icon: BookOpenText,
    color: 'cobalt',
  },
  {
    label: 'Grammar',
    description: 'Understand simple patterns',
    to: '/grammar',
    icon: PuzzlePiece,
    color: 'jade',
  },
  {
    label: 'Practice',
    description: 'Check what you remember',
    to: '/practice',
    icon: CheckCircle,
    color: 'vermilion',
  },
  {
    label: 'Dialogue',
    description: 'Watch Korean in context',
    to: '/dialogue',
    icon: ChatCircleText,
    color: 'yellow',
  },
] as const

export function HomePage() {
  return (
    <section className="home-page">
      <div className="home-hero">
        <div className="home-hero__copy">
          <p className="home-eyebrow">Beginner Korean · Lec 1</p>
          <p className="home-greeting">
            <span lang="ko">안녕하세요!</span>
            <span>Hello!</span>
          </p>
          <h1>Welcome to Korean Stage</h1>
          <p className="home-introduction">
            Learn beginner Korean through useful vocabulary, clear grammar, friendly quizzes, and real member videos.
          </p>
          <Link className="home-primary-action" to="/vocabulary">
            Explore vocabulary
            <ArrowRight aria-hidden="true" size={20} weight="bold" />
          </Link>
          <p className="home-starting-note">No account needed — choose any unit and begin.</p>
        </div>

        <figure className="home-hero__visual">
          <img
            alt="An illustrated Korean presenter recording a learning video"
            src={publicAssetPath('/assets/culture/video-coming-soon.png')}
          />
          <figcaption>
            <strong>Learn with real voices</strong>
            <span>See and hear every word from our team.</span>
          </figcaption>
        </figure>
      </div>

      <nav aria-label="Learning journey" className="home-learning-path">
        <div className="home-learning-path__heading">
          <p>Your learning journey</p>
          <span>Choose what you want to study.</span>
        </div>
        <ol>
          {learningSteps.map(({ color, description, icon: Icon, label, to }) => (
            <li key={label}>
              <Link className={`home-path-card home-path-card--${color}`} to={to}>
                <Icon aria-hidden="true" size={23} weight="duotone" />
                <span>
                  <strong>{label}</strong>
                  <small>{description}</small>
                </span>
                <ArrowRight aria-hidden="true" className="home-path-card__arrow" size={18} weight="bold" />
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </section>
  )
}
