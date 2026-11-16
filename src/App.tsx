import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { TabBar } from './components/TabBar'
import { CatalogPage } from './pages/CatalogPage'
import { ReelsPage } from './pages/ReelsPage'
import { AddPage } from './pages/AddPage'
import { AuthPage } from './pages/AuthPage'

function App() {
  return (
    <BrowserRouter>
      <div className="phone-frame">
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
    </BrowserRouter>
  )
}

export default App