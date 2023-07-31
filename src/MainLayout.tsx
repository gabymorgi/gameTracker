import React from 'react'

import { Routes, Route, Navigate } from 'react-router-dom'
import GameList from './routes/GameList'
import Changelogs from './routes/Changelogs'
import ProtectedRoute from './routes/ProtectedRoute'
import RecentlyPlayed from './routes/RecentlyPlayed'

import Settings from './routes/Settings'
import { Header } from './routes/Header'

const MainLayout: React.FC = () => {
  return (
    <>
      <Header />
      <div className='p-16'>
        <Routes>
          <Route path='/' element={<GameList />} />
          {/* <Route
            path='/changelogs'
            element={
              <ProtectedRoute>
                <Changelogs />
              </ProtectedRoute>
            }
          /> */}
          {/* <Route
            path='/settings'
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path='/recent'
            element={
              <ProtectedRoute>
                <RecentlyPlayed />
              </ProtectedRoute>
            }
          />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </div>
    </>
  )
}

export default MainLayout
