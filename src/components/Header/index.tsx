import { Menu } from 'antd'
import React, { useContext } from 'react'
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
  background-color: #001529;

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
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={[
            {
              key: 'games',
              label: authContext.isAuthenticated ? (
                'Games'
              ) : (
                <Link to="/games">Games</Link>
              ),
              children: authContext.isAuthenticated
                ? [
                    {
                      key: '/games',
                      label: <Link to="/games">List</Link>,
                    },
                    {
                      key: '/games/recent',
                      label: <Link to="/games/recent">Recently Played</Link>,
                    },
                    {
                      key: '/games/changeLogs',
                      label: <Link to="/games/changeLogs">Changelogs</Link>,
                    },
                    {
                      key: '/games/settings',
                      label: <Link to="/games/settings">Settings</Link>,
                    },
                  ]
                : [],
            },
            {
              key: 'books',
              label: authContext.isAuthenticated ? (
                'Books'
              ) : (
                <Link to="/books/train">Books</Link>
              ),
              children: authContext.isAuthenticated
                ? [
                    {
                      key: '/books/train',
                      label: <Link to="/books/train">Train</Link>,
                    },
                    {
                      key: '/books/create',
                      label: <Link to="/books/create">Create</Link>,
                    },
                    {
                      key: '/books/complete',
                      label: <Link to="/books/complete">Complete</Link>,
                    },
                    {
                      key: '/books/statistics',
                      label: <Link to="/books/statistics">Statistics</Link>,
                    },
                  ]
                : [],
            },
          ]}
        />
      </div>
      <Authentication />
    </StyledHeader>
  )
}
