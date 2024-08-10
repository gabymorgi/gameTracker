import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import GameList from './routes/Games/GameList'
import Changelogs from './routes/Games/Changelogs'
import ProtectedRoute from './routes/ProtectedRoute'
import RecentlyPlayed from './routes/Games/RecentlyPlayed/RecentlyPlayed'

import Settings from './routes/Games/Settings'
import { Header } from './components/Header'
import Training from './routes/Memos/Train/Train'
import CreateMemo from './routes/Memos/Create/Create'
import Statistics from './routes/Memos/Statistics/Statistics'
import { FloatButton, Layout } from 'antd'
import BookList from './routes/Books/Books'

const MainLayout: React.FC = () => {
  return (
    <>
      <Header />
      <Layout.Content className="p-middle">
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
            <Route index element={<BookList />} />
          </Route>
          <Route
            path="/memos"
            element={
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route index element={<>👀</>} />
            <Route path="train" element={<Training />} />
            <Route path="create" element={<CreateMemo />} />
            <Route path="statistics" element={<Statistics />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout.Content>
      <FloatButton.BackTop type="primary" />
    </>
  )
}

export default MainLayout
