import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '@geist-ui/react'

const NavItem = ({ item, tolink, isActive }) => {
  const { palette } = useTheme()

  return (
    <li className={isActive ? 'active' : ''}>
      <Link to={tolink} style={{ color: palette.violetLighter }}>
        {item}
      </Link>
    </li>
  )
}

export default NavItem
