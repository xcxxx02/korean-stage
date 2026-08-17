import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('introduces Korean Stage as a Lec 1 beginner course', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /Korean Stage/i })).toBeInTheDocument()
    expect(screen.getByText(/adapted entirely from Lec 1/i)).toBeInTheDocument()
  })
})
