import { ArrowRight, BookOpenText, ChatCircleText, CheckCircle, Headphones, PuzzlePiece, SpeakerHigh } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { publicAssetPath } from '../deployment'

const featuredWords = [
  { korean: '한국어', english: 'Korean', icon: Headphones },
  { korean: '태국', english: 'Thailand', icon: SpeakerHigh },
  { korean: '학생', english: 'Student', icon: BookOpenText },
] as const

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
  const [featuredWordIndex, setFeaturedWordIndex] = useState(0)
  const featuredWord = featuredWords[featuredWordIndex]
  const FeaturedIcon = featuredWord.icon

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const interval = window.setInterval(() => {
      setFeaturedWordIndex((current) => (current + 1) % featuredWords.length)
    }, 4000)
    return () => window.clearInterval(interval)
  }, [])

  const supportingWords = featuredWords.filter((_, index) => index !== featuredWordIndex)

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

        <section aria-label="Animated vocabulary preview" className="home-hero__visual">
          <img
            alt=""
            aria-hidden="true"
            className="home-hero__stage"
            data-testid="home-hanok-stage"
            src={publicAssetPath('/assets/culture/home-hanok-stage.png')}
          />
          <div className="home-vocabulary-showcase">
            <div className="home-vocabulary-showcase__supporting" aria-hidden="true">
              {supportingWords.map((word) => (
                <div className="home-vocabulary-mini-card" key={word.korean}>
                  <strong lang="ko">{word.korean}</strong>
                  <span lang="en">{word.english}</span>
                </div>
              ))}
            </div>
            <article aria-live="polite" className="home-vocabulary-card" key={featuredWord.korean}>
              <FeaturedIcon aria-hidden="true" className="home-vocabulary-card__icon" size={28} weight="duotone" />
              <h2 lang="ko">{featuredWord.korean}</h2>
              <p lang="en">{featuredWord.english}</p>
              <span aria-hidden="true" className="home-vocabulary-waveform">
                {Array.from({ length: 15 }, (_, index) => <i key={index} />)}
              </span>
            </article>
            <div aria-label="Choose featured vocabulary" className="home-vocabulary-dots" role="group">
              {featuredWords.map((word, index) => (
                <button
                  aria-label={`Show ${word.korean} vocabulary card`}
                  aria-pressed={index === featuredWordIndex}
                  key={word.korean}
                  onClick={() => setFeaturedWordIndex(index)}
                  type="button"
                />
              ))}
            </div>
          </div>
          <div className="home-hero__caption">
            <strong>Learn Korean, one word at a time.</strong>
            <span>Clear meanings, real voices, and beginner-friendly examples.</span>
          </div>
        </section>
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
