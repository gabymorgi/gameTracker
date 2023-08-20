import React, { useEffect } from 'react'
// import SteamAPI from 'steamapi'
import { App } from 'antd'
import { FormGameI } from '@/ts/index'
import { useNavigate } from 'react-router-dom'

interface ChangelogFormStepI {
  games: FormGameI[]
}

export const ChangelogFormStep: React.FC<ChangelogFormStepI> = (props) => {
  
  useEffect(() => {
    console.log(props.games)
  }, [props.games])


  return (
    <>
        
    </>
  )
}

export default ChangelogFormStep
