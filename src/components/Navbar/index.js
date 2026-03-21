import React from 'react'
import { useLocation } from 'react-router-dom'
import NavItem from './NavItem'

const NAV_ITEMS = [
  { label: 'Nasıl Çalışır?', to: '/' },
  { label: 'Hızlı Başlangıç', to: '/quick-start' },
]

const Navbar = () => {
  const location = useLocation()

  return (
    <nav>
      <ul>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.to}
            item={item.label}
            tolink={item.to}
            isActive={location.pathname === item.to}
          />
        ))}
      </ul>
    </nav>
  )
}

export default Navbar
