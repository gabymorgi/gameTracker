import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import GameTimeline from './routes/Games/GameTimeline'
import ProtectedRoute from './routes/ProtectedRoute'
import Settings from './routes/Games/Settings/Settings'
import PendingReviews from './routes/Games/PendingReviews'
import { Header } from './components/Header'
import { FloatButton, Layout } from 'antd'
import BookList from './routes/Books/Books'
import IsaacMods from './routes/Isaac/Mods'
import ByGame from './routes/Games/List/ByGame'
import OSTs from './routes/Games/OSTs'

const MainLayout: React.FC = () => {
  return (
    <>
      <Header />
      <Layout.Content className="p-middle">
        <Routes>
          <Route path="/" element={<Navigate to="/games" />} />
          <Route path="/games" element={<Outlet />}>
            <Route index element={<GameTimeline />} />
            <Route
              path="list"
              element={
                <ProtectedRoute>
                  <ByGame />
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
              path="reviews"
              element={
                <ProtectedRoute>
                  <PendingReviews />
                </ProtectedRoute>
              }
            />
            <Route path="osts" element={<OSTs />} />
          </Route>
          <Route path="/books" element={<Outlet />}>
            <Route index element={<BookList />} />
          </Route>
          <Route
            path="/isaac"
            element={
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route index element={<IsaacMods />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout.Content>
      <FloatButton.BackTop type="primary" />
    </>
  )
}

export default MainLayout
