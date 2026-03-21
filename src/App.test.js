import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the navbar with navigation links', () => {
    render(<App />)
    const navLinks = screen.getAllByRole('link')
    const navTexts = navLinks.map((link) => link.textContent)
    expect(navTexts).toContain('Nasıl Çalışır?')
    expect(navTexts).toContain('Hızlı Başlangıç')
  })

  it('renders the HowItWorks page content by default', () => {
    render(<App />)
    expect(
      screen.getByText(/postman çıktısı dosyanızı yüklerseniz/)
    ).toBeInTheDocument()
  })
})
