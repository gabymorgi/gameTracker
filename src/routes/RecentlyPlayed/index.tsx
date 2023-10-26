import React from 'react'
import { Steps } from 'antd'
import GameFormStep from './GameFormStep'
import ChangelogFormStep from './ChangelogFormStep'
import DatabaseStep from './DatabaseStep'
import { useNavigate } from 'react-router-dom'

export const RecentlyPlayed: React.FC = () => {
  const navigate = useNavigate()
  const [step, setStep] = React.useState(0)

  const handleFinish = async () => {
    setStep(step + 1)
  }

  return (
    <div className="flex flex-col gap-16">
      <Steps
        current={step}
        items={[
          {
            title: 'Games',
            onClick: () => setStep(0),
          },
          {
            title: 'Changelogs',
            onClick: () => setStep(1),
          },
          {
            title: 'DataBase',
            onClick: () => setStep(2),
          },
        ]}
      />
      {step === 0 && <GameFormStep onFinish={handleFinish} />}
      {step === 1 && <ChangelogFormStep onFinish={handleFinish} />}
      {step === 2 && <DatabaseStep onFinish={() => navigate('/')} />}
    </div>
  )
}

export default RecentlyPlayed
