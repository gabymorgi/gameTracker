import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import GameList from './routes/GameList'
import Changelogs from './routes/Changelogs'
import ProtectedRoute from './routes/ProtectedRoute'
import RecentlyPlayed from './routes/RecentlyPlayed'

import Settings from './routes/Settings'
import { Header } from './routes/Header'
import Training from './routes/Books/Training/Training'
import CreateMemo from './routes/Books/Memos/Create'
import CompleteMemo from './routes/Books/Memos/Complete'

const MainLayout: React.FC = () => {
  return (
    <>
      <Header />
      <div className="p-16">
        <Routes>
          <Route path="/" element={<Navigate to="/games" />} />
          <Route path="/games" element={<Outlet />}>
            <Route index element={<GameList />} />
            <Route
              path="changeLogs"
              element={
                <ProtectedRoute>
                  <Changelogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="recent"
              element={
                <ProtectedRoute>
                  <RecentlyPlayed />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/books" element={<Outlet />}>
            <Route index element={<div>Nada</div>} />
            <Route path="train" element={<Training />} />
            <Route path="create" element={<CreateMemo />} />
            <Route path="complete" element={<CompleteMemo />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  )
}

export default MainLayout
