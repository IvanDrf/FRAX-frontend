import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { TabBar } from './components/TabBar'
import { CatalogPage } from './pages/CatalogPage'
import { ReelsPage } from './pages/ReelsPage'
import { AddPage } from './pages/AddPage'
import { AuthPage } from './pages/AuthPage'
import { useBusy } from './app/hooks'

function App() {
  const busy = useBusy()
  return (
    <BrowserRouter>
      <div className="phone-frame">
        <div inert={busy} aria-busy={busy}>
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/reels" element={<ReelsPage />} />
            <Route path="/reels/:id" element={<ReelsPage />} />
            <Route path="/add" element={<AddPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <TabBar />
        </div>
        {busy && <div className="loading-overlay" role="status"><span className="spinner" />Загрузка…</div>}
      </div>
    </BrowserRouter>
  )
}

export default App