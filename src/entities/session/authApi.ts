import axios from 'axios'

// Auth deliberately uses handwritten Axios, with plain Redux actions in the UI.
const auth = axios.create({ baseURL: '/api/users', withCredentials: true, timeout: 10000 })
export const loginRequest = (username: string, password: string) => auth.post('/login', { username, password })
export const registerRequest = (username: string, password: string) => auth.post('/register', { username, password })
export const logoutRequest = () => auth.post('/logout')
