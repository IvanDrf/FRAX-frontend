import axios from 'axios'
import { ApiError } from '../api/generated'

export function statusOf(error: unknown): number | undefined {
  if (error instanceof ApiError) return error.status
  if (axios.isAxiosError(error)) return error.response?.status
}

export function isUnavailable(error: unknown): boolean {
  const status = statusOf(error)
  return (status === undefined && axios.isAxiosError(error)) || (status !== undefined && status >= 500)
}

export function errorMessage(error: unknown): string {
  if (statusOf(error) === 401) return 'Сессия истекла или неверны данные входа. Войдите снова.'
  const body: unknown = error instanceof ApiError ? error.body : axios.isAxiosError(error) ? error.response?.data : undefined
  if (body && typeof body === 'object' && 'detail' in body && typeof body.detail === 'string') return body.detail
  return 'Не удалось выполнить запрос. Проверьте доступность сервиса и повторите попытку.'
}
