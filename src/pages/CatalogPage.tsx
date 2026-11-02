import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { RISK_FACTORS } from '../modules/mock'

const DEFAULT_IMAGE = '/default.png'

export const CatalogPage = () => {
  const [factors, setFactors] = useState(RISK_FACTORS)
  const [weightFilter, setWeightFilter] = useState(0)

  const visibleFactors = factors.filter((f) => f.weight >= weightFilter)

  const handleSlider = (e: ChangeEvent<HTMLInputElement>) => {
    setWeightFilter(Number(e.target.value))
  }

  const handleDelete = (id: number) => {
    setFactors((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <main className="tabbed-page">
      <header className="page-header">
        <span className="frax-badge">FRAX</span>
        <h1 className="page-title">Факторы риска</h1>
      </header>

      <p className="filter-hint">
        Фильтр по весу фактора. Значение 0 — все опубликованные.
      </p>

      <form className="weight-form" onSubmit={(e) => e.preventDefault()}>
        <div className="slider-header">
          <label htmlFor="risk_factor_weight">Вес фактора</label>
          <output className="slider-value" htmlFor="risk_factor_weight">
            {weightFilter.toFixed(1)}
          </output>
        </div>

        <div className="slider-wrapper">
          <input
            type="range"
            id="risk_factor_weight"
            name="risk_factor_weight"
            min="0"
            max="2"
            step="0.1"
            value={weightFilter}
            onChange={handleSlider}
            aria-label="Фильтр по весу фактора"
          />
        </div>

        <div className="slider-marks">
          <span>0</span>
          <span>2</span>
        </div>
      </form>

      <div className="factors-grid">
        {visibleFactors.map((factor) => (
          <div className="factor-card" key={factor.id}>
            <Link className="factor-card-link" to={`/reels/${factor.id}`}>
              <img
                className="card-image"
                src={factor.image_url || DEFAULT_IMAGE}
                alt={factor.name}
              />
              <div className="card-body">
                <h2>{factor.name}</h2>
                <div className="card-footer">
                  <span>
                    Лайки <strong>{factor.likes_count}</strong>
                  </span>
                  <span>
                    Вес <strong>{factor.weight}</strong>
                  </span>
                  <span>
                    Распр. <strong>{factor.prevalence}%</strong>
                  </span>
                </div>
              </div>
            </Link>

            <form
              className="delete-form"
              onSubmit={(e) => {
                e.preventDefault()
                handleDelete(factor.id)
              }}
            >
              <button
                type="submit"
                className="delete-button"
                aria-label="Удалить фактор"
              >
                Удалить
              </button>
            </form>
          </div>
        ))}
      </div>

      {visibleFactors.length === 0 && (
        <p className="empty-hint">Нет опубликованных факторов риска.</p>
      )}
    </main>
  )
}