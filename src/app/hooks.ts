import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useBusy = () => useAppSelector(s => s.session.status === 'loading' || Object.keys(s.requests.pending).length > 0)
