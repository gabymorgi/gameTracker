import React from 'react'
// import SteamAPI from 'steamapi'
import { App, Layout } from 'antd'
import { EndPoint, FormGameI } from '@/ts/index'
import { useNavigate } from 'react-router-dom'
import { Options, query } from '@/hooks/useFetch'
import GameFormStep from './GameFormStep'
import ChangelogFormStep from './ChangelogFormStep'

export const RecentlyPlayed: React.FC = () => {
  const [step, setStep] = React.useState(0)
  const navigate = useNavigate()
  const { notification } = App.useApp();

  const handleSubmit = async (games: FormGameI[]) => {
    
    console.log(games)
    setStep(1)
    // await query(EndPoint.GAMES, Options.POST, {}, games)

    // navigate('/')
  }


  return (
    <>
      {step === 0 && (
        <GameFormStep onSubmit={handleSubmit} />
      )}
      {step === 1 && (
        <ChangelogFormStep games={[]} />
      )}
    </>
  )
}

export default RecentlyPlayed
