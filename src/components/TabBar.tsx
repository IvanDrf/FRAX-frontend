import { Link, useLocation } from 'react-router-dom'

export const TabBar = () => {
  const location = useLocation()
  const isReels = location.pathname.startsWith('/reels')
  const isCatalog = location.pathname === '/'
  const isAuth = location.pathname.startsWith('/auth')

  return (
    <nav className="tab-panel">
      <Link className={`tab-button${isReels ? ' active' : ''}`} to="/reels">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none" />
        </svg>
        Лента
      </Link>

      <span className="tab-button disabled">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8M8 12h8" />
        </svg>
        Добавление
      </span>

      <Link className={`tab-button${isCatalog ? ' active' : ''}`} to="/">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
        Каталог
      </Link>

      <Link className={`tab-button${isAuth ? ' active' : ''}`} to="/auth">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        </svg>
        Вход
      </Link>
    </nav>
  )
}