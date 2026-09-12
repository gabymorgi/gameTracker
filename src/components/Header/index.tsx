import { Menu } from 'antd'
import { useContext } from 'react'
import styled from 'styled-components'
import Authentication from './Authentication'
import { Link, useLocation } from 'react-router-dom'
import { AuthContext } from '@/contexts/AuthContext'

const StyledHeader = styled.header`
  display: flex;
  padding-right: 16px;
  justify-content: space-between;
  align-items: center;
  line-height: 1.5;
  background-color: ${() =>
    window.location.hostname === 'localhost' ? '#5b1f24' : '#001529'};

  .ant-menu {
    background: transparent;
    border-bottom: none;
  }
`

export const Header: React.FC = () => {
  const location = useLocation()
  const authContext = useContext(AuthContext)

  return (
    <StyledHeader>
      <div className="flex-grow">
        {authContext.isAuthenticated ? (
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={[
              {
                key: 'games',
                label: 'Games',
                children: [
                  {
                    key: '/games',
                    label: <Link to="/games">Timeline</Link>,
                  },
                  {
                    key: '/games/list',
                    label: <Link to="/games/list">List</Link>,
                  },
                  {
                    key: '/games/settings',
                    label: <Link to="/games/settings">Settings</Link>,
                  },
                  {
                    key: '/games/reviews',
                    label: <Link to="/games/reviews">Pending Reviews</Link>,
                  },
                  {
                    key: '/games/osts',
                    label: <Link to="/games/osts">OSTs</Link>,
                  },
                ],
              },
              {
                key: 'books',
                label: <Link to="/books">Books</Link>,
              },
              {
                key: 'isaac',
                label: <Link to="/isaac">Isaac Mods</Link>,
              },
            ]}
          />
        ) : (
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={[
              {
                key: 'games',
                label: <Link to="/games">Games</Link>,
              },
              {
                key: 'books',
                label: <Link to="/books">Books</Link>,
              },
            ]}
          />
        )}
      </div>
      <Authentication />
    </StyledHeader>
  )
}
