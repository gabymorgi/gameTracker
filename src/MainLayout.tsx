import React from 'react'

import { Routes, Route, Navigate } from 'react-router-dom'
import GameList from './routes/GameList'
import Changelogs from './routes/Changelogs'
import ProtectedRoute from './routes/ProtectedRoute'
import RecentlyPlayed from './routes/RecentlyPlayed'

import Settings from './routes/Settings'
import { Header } from './routes/Header'
import ChGames from "@/back/ChGames.json"
import { numberToDate } from './utils/format'

const MainLayout: React.FC = () => {

  const parseGames = () => {
    const meanHours: {[key: string]: number} = {}
    const parsedGames = ChGames.map((game) => {
      const newChangeLogs = []
      let sum = 0
      let affectedMonths: number[] = []
      for (const changelog of game.changelogs) {
        sum += changelog.hours
        affectedMonths.push(changelog.createdAt)
        if (sum >= 300) {
          let minMonth = affectedMonths[0]
          let min = meanHours[minMonth]
          if (affectedMonths.length > 1) {
            // debugger
            for (const month of affectedMonths) {
              if (meanHours[month] < min) {
                min = meanHours[month]
                minMonth = month
              }
            }
          }
          newChangeLogs.push({
            ...changelog,
            createdAt: minMonth,
            hours: sum
          })
          meanHours[minMonth] = (meanHours[changelog.createdAt] || 0) + sum
          affectedMonths = []
          sum = 0
        }
      }
      if (sum > 0) {
        let minMonth = affectedMonths[0]
        let min = meanHours[minMonth]
        if (affectedMonths.length > 1) {
          // debugger
          for (const month of affectedMonths) {
            if (meanHours[month] < min) {
              min = meanHours[month]
              minMonth = month
            }
          }
        }
        newChangeLogs.push({
          ...game.changelogs[game.changelogs.length - 1],
          createdAt: minMonth,
          hours: sum
        })
        meanHours[minMonth] = (meanHours[game.changelogs[game.changelogs.length - 1].createdAt] || 0) + sum
      }
      return {
        ...game,
        changelogs: newChangeLogs
      }
    })
    console.log(JSON.stringify(parsedGames))
  }

  return (
    <>
      <button onClick={parseGames}>do it</button>
      <Header />
      <div className='p-16'>
        <Routes>
          <Route path='/' element={<Navigate to='/games' />} />
          <Route path='/games' element={<GameList />} />
          <Route
            path='/games/changelogs'
            element={
              <ProtectedRoute>
                <Changelogs />
              </ProtectedRoute>
            }
          />
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
