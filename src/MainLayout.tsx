import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import GameList from './routes/Games/GameList'
import Changelogs from './routes/Games/Changelogs'
import ProtectedRoute from './routes/ProtectedRoute'
import RecentlyPlayed from './routes/Games/RecentlyPlayed/RecentlyPlayed'

import Settings from './routes/Games/Settings'
import { Header } from './components/Header'
import Training from './routes/Books/Train/Train'
import CreateMemo from './routes/Books/Create/Create'
import CompleteMemo from './routes/Books/Complete/Complete'
import Statistics from './routes/Books/Statistics/Statistics'
import { ChatProvider } from './contexts/ChatContext'
import { FloatButton, Layout } from 'antd'

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
            <Route index element={<>👀</>} />
            <Route path="train" element={<Training />} />
            <Route path="create" element={<CreateMemo />} />
            <Route
              path="complete"
              element={
                <ChatProvider>
                  <CompleteMemo />
                </ChatProvider>
              }
            />
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
