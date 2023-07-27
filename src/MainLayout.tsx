import React, { useEffect } from 'react'

import { Routes, Route, Navigate } from 'react-router-dom'
import GameList from './routes/GameList'
import Changelogs from './routes/Changelogs'
import ProtectedRoute from './routes/ProtectedRoute'
import RecentlyPlayed from './routes/RecentlyPlayed'

import Settings from './routes/Settings'
import { Header } from './routes/Header'

const MainLayout: React.FC = () => {
  async function getTags() {
    console.log('getTags')
    // if dev 8888 else /
    const url = import.meta.env.DEV ? 'http://localhost:8888/.netlify/functions/tags' : '/.netlify/functions/tags'
    const response = await fetch(url);
    console.log(response)
    const data = await response.json();
    console.log(data)
    return data;
  }
  useEffect(() => {
    getTags()
  }, []);
  return (
    <>
      <Header />
      <div className='p-16'>
        <Routes>
          <Route path='/' element={<GameList />} />
          <Route
            path='/changelogs'
            element={
              <ProtectedRoute>
                <Changelogs />
              </ProtectedRoute>
            }
          />
          <Route
            path='/settings'
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
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
