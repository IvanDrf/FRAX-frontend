import { useState } from 'react'
import type { SubmitEventHandler } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { authStarted, loggedIn, authFailed } from '../entities/session/sessionSlice'
import { loginRequest, registerRequest } from '../entities/session/authApi'
import { errorMessage } from '../shared/lib/apiError'

type AuthMode = 'login' | 'register'

interface AuthForm {
  username: string
  password: string
  confirmPassword: string
}

const EMPTY_FORM: AuthForm = {
  username: '',
  password: '',
  confirmPassword: '',
}

export const AuthPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const username = useAppSelector(s => s.session.username)
  const [mode, setMode] = useState<AuthMode>('login')
  const [form, setForm] = useState<AuthForm>(EMPTY_FORM)
  const [error, setError] = useState('')

  const isRegister = mode === 'register'

  const switchMode = () => {
    setMode(isRegister ? 'login' : 'register')
    setForm(EMPTY_FORM)
    setError('')
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setError('')

    const username = form.username.trim()
    const password = form.password

    if (!username || !password) {
      setError('Заполните имя пользователя и пароль')
      return
    }

    if (isRegister) {
      if (username.length < 3) {
        setError('Имя пользователя должно содержать минимум 3 символа')
        return
      }
      if (password.length < 6) {
        setError('Пароль должен содержать минимум 6 символов')
        return
      }
      if (password !== form.confirmPassword) {
        setError('Пароли не совпадают')
        return
      }

    }

    dispatch(authStarted())
    try {
      if (isRegister) {
        await registerRequest(username, password)
      }
      await loginRequest(username, password)
      dispatch(loggedIn(username))
      setForm(EMPTY_FORM)
      navigate('/')
    } catch (error) {
      const message = errorMessage(error)
      dispatch(authFailed(message))
      setError(message)
    }
  }

  if (username) return <Navigate to="/" replace />

  return (
    <main className="tabbed-page">
      <header className="page-header">
        <span className="frax-badge">FRAX</span>
        <h1 className="page-title">
          {isRegister ? 'Регистрация' : 'Вход'}
        </h1>
      </header>

      <p className="filter-hint">
        {isRegister
          ? 'Создайте аккаунт по имени пользователя и паролю.'
          : 'Войдите с помощью имени пользователя и пароля.'}
      </p>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label className="field-label" htmlFor="username">
          Имя пользователя
        </label>
        <input
          className="factor-field"
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="Например, vanek123"
          required
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <label className="field-label" htmlFor="password">
          Пароль
        </label>
        <input
          className="factor-field"
          id="password"
          name="password"
          type="password"
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          placeholder="Введите пароль"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {isRegister && (
          <>
            <label className="field-label" htmlFor="confirmPassword">
              Повторите пароль
            </label>
            <input
              className="factor-field"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Повторите пароль"
              required
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          </>
        )}

        {error && (
          <p className="auth-message auth-error" role="alert">
            {error}
          </p>
        )}


        <button className="next-button" type="submit">
          {isRegister ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </form>

      <button type="button" className="auth-toggle" onClick={switchMode}>
        {isRegister
          ? 'Уже есть аккаунт? Войти'
          : 'Нет аккаунта? Зарегистрироваться'}
      </button>
    </main>
  )
}