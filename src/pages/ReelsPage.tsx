import { useNavigate, useParams } from 'react-router-dom'
import { RISK_FACTORS } from '../modules/mock'

const DEFAULT_VIDEO = '/default.mp4'

export const ReelsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const currentId = id ? Number(id) : RISK_FACTORS[0]?.id
  const factor =
    RISK_FACTORS.find((f) => f.id === currentId) ?? RISK_FACTORS[0]

  if (!factor) {
    return (
      <main className="tabbed-page">
        <p className="empty-hint">Нет факторов риска.</p>
      </main>
    )
  }

  const currentIndex = RISK_FACTORS.findIndex((f) => f.id === factor.id)
  const nextFactor =
    RISK_FACTORS[(currentIndex + 1) % RISK_FACTORS.length]

  return (
    <section className="feed-screen">
      <video
        className="feed-video"
        autoPlay
        muted
        loop
        playsInline
        src={factor.video_url || DEFAULT_VIDEO}
      />
      <div className="bottom-gradient" />

      <div className="top-left-badge">
        <span className="frax-badge">FRAX</span>
      </div>

      <div className="action-row">
        <div className="interest-mark">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
          </svg>
          <span className="likes-count">{factor.likes_count}</span>
        </div>

        <dl className="action-fields">
          <div>
            <dt>Вес</dt>
            <dd>{factor.weight}</dd>
          </div>
          <div>
            <dt>Распр.</dt>
            <dd>{factor.prevalence}%</dd>
          </div>
        </dl>

        <button
          type="button"
          className="next-mark"
          onClick={() => navigate(`/reels/${nextFactor.id}`)}
          aria-label="Следующий фактор"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      <div className="data-layer">
        <h1 className="factor-title">{factor.name}</h1>

        <div className="factor-description">
          <input
            type="checkbox"
            id={`desc-toggle-${factor.id}`}
            className="desc-toggle"
          />
          <p className="description-text">{factor.description}</p>
          <label
            htmlFor={`desc-toggle-${factor.id}`}
            className="desc-label"
          />
        </div>
      </div>
    </section>
  )
}