import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logoutRequest } from '../entities/session/authApi'
import { authStarted, authFailed, loggedOut } from '../entities/session/sessionSlice'
import { errorMessage } from '../shared/lib/apiError'

export const TabBar = () => {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { username, error } = useAppSelector(s => s.session)
  const logout = async () => {
    dispatch(authStarted())
    try {
      await logoutRequest()
      dispatch(loggedOut())
      navigate('/')
    } catch (error) {
      dispatch(authFailed(errorMessage(error)))
    }
  }
  const isReels = location.pathname.startsWith('/reels')
  const isCatalog = location.pathname === '/'
  const isAuth = location.pathname.startsWith('/auth')

  return (
    <nav className="tab-panel" aria-label="Основная навигация">
      {username && error && <p className="nav-error auth-error" role="alert">{error}</p>}
      <Link className={`tab-button${isReels ? ' active' : ''}`} to="/reels">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none" />
        </svg>
        Лента
      </Link>

      <Link to={username ? "/add" : "/auth"} className={`tab-button${location.pathname === "/add" ? " active" : ""}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8M8 12h8" />
        </svg>
        Добавление
      </Link>

      <Link className={`tab-button${isCatalog ? ' active' : ''}`} to="/">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
        Каталог
      </Link>

      {username ? <button type="button" className="tab-button" onClick={() => void logout()} title={`Вы вошли как ${username}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 3H3v18h6M14 7l5 5-5 5M7 12h12" /></svg>
        Выход
      </button> : <Link className={`tab-button${isAuth ? ' active' : ''}`} to="/auth">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        </svg>
        Вход
      </Link>}
    </nav>
  )
}