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
      {authContext.isAuthenticated ? (
        <Menu
          mode='horizontal'
          selectedKeys={[location.pathname]}
          items={[
            {
              key: '/',
              label: <Link to='/'>Home</Link>,
            },
            {
              key: '/settings',
              label: <Link to='/settings'>Settings</Link>,
            },
            {
              key: '/changelogs',
              label: <Link to='/changelogs'>Changelogs</Link>,
            },
            {
              key: '/recent',
              label: <Link to='/recent'>Recently Played</Link>,
            },
          ]}
        />
      ) : null}
      <Authentication />
    </StyledHeader>
  )
}
