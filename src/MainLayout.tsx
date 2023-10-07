import React from 'react'

import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import GameList from './routes/GameList'
import Changelogs from './routes/Changelogs'
import ProtectedRoute from './routes/ProtectedRoute'
import RecentlyPlayed from './routes/RecentlyPlayed'

import Settings from './routes/Settings'
import { Header } from './routes/Header'
import Memos from './routes/Books/Memos'

const MainLayout: React.FC = () => {
  return (
    <>
      <Header />
      <div className='p-16'>
        <Routes>
          <Route path='/' element={<Navigate to='/games' />} />
          <Route path='/games' element={<Outlet />}>
            <Route index element={<GameList />} />
            <Route
              path='changelogs'
              element={
                <ProtectedRoute>
                  <Changelogs />
                </ProtectedRoute>
              }
            />
            <Route
              path='settings'
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path='recent'
              element={
                <ProtectedRoute>
                  <RecentlyPlayed />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path='/books' element={<Memos />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </div>
    </>
  )
}

export default MainLayout
