import { Menu } from 'antd'
import React, { useContext } from 'react'
import styled from 'styled-components'
import Authentication from './Authentication'
import { Link, useLocation } from 'react-router-dom'
import { AuthContext } from '@/contexts/AuthContext'

const StyledHeader = styled.header`
  display: flex;
  padding: 0px 32px;
  justify-content: space-between;
  align-items: center;
  line-height: 1.5;
  background-color: #001529;

  .ant-menu {
    background: transparent;
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
              label: <Link to="/games">Games</Link>,
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
                      key: '/games/changelogs',
                      label: <Link to="/games/changelogs">Changelogs</Link>,
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
              label: <Link to="/books">Books</Link>,
              children: authContext.isAuthenticated
                ? [
                    {
                      key: '/books/memos',
                      label: <Link to="/books/memos">Memos</Link>,
                    },
                    {
                      key: '/books/training',
                      label: <Link to="/books/training">Training</Link>,
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
