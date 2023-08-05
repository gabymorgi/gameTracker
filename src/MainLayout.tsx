import React from 'react'

import { Routes, Route, Navigate } from 'react-router-dom'
import GameList from './routes/GameList'
import Changelogs from './routes/Changelogs'
import ProtectedRoute from './routes/ProtectedRoute'
import RecentlyPlayed from './routes/RecentlyPlayed'

import Settings from './routes/Settings'
import { Header } from './routes/Header'
import { main } from './utils/tagClustering'

const MainLayout: React.FC = () => {
  function doit() {
    main()
  }
  return (
    <>
      {/* <button onClick={doit}>doit</button> */}
      <Header />
      <div className='p-16'>
        <Routes>
          <Route path='/' element={<Navigate to='/games' />} />
          <Route path='/games' element={<GameList />} />
          {/* <Route
            path='/games/changelogs'
            element={
              <ProtectedRoute>
                <Changelogs />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path='/games/settings'
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path='/games/recent'
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
