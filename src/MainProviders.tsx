import MainLayout from './MainLayout'
import AuthProvider from './contexts/AuthContext'
import GlobalStyles from './GlobalStyles'
import { App, ConfigProvider, Grid, theme } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import { GlobalProvider } from './contexts/GlobalContext'

const { darkAlgorithm, compactAlgorithm } = theme

function MainProviders() {
  const breakPoints = Grid.useBreakpoint()
  return (
    <ConfigProvider
      theme={{
        algorithm: breakPoints.lg
          ? [darkAlgorithm]
          : [darkAlgorithm, compactAlgorithm],
        token: {
          colorPrimary: '#00b96b',
          colorLink: '#6CFF80',
          colorLinkHover: '#4DFF61',
          colorLinkActive: '#2AFF3D',
        },
      }}
    >
      <App>
        <GlobalStyles />
        <BrowserRouter>
          <QueryParamProvider adapter={ReactRouter6Adapter}>
            <AuthProvider>
              <GlobalProvider>
                <MainLayout />
              </GlobalProvider>
            </AuthProvider>
          </QueryParamProvider>
        </BrowserRouter>
      </App>
    </ConfigProvider>
  )
}

export default MainProviders
