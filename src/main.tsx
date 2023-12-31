import ReactDOM from 'react-dom/client'
import './styles/globals.css'
import './styles/atoms.css'
import MainLayout from './MainLayout'
import AuthProvider from './contexts/AuthContext'
import GlobalStyles from './GlobalStyles'
import { App, ConfigProvider, theme } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import { GLobalProvider } from './contexts/GlobalContext'
import { ChatProvider } from './contexts/ChatContext'

const { darkAlgorithm } = theme

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider
    theme={{
      algorithm: [darkAlgorithm],
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
            <GLobalProvider>
              <ChatProvider>
                <MainLayout />
              </ChatProvider>
            </GLobalProvider>
          </AuthProvider>
        </QueryParamProvider>
      </BrowserRouter>
    </App>
  </ConfigProvider>,
)
