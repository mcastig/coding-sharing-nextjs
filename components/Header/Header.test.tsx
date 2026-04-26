import { render, screen } from '@testing-library/react'
import Header from './Header'

describe('Header', () => {
  it('renders the NoteCode logo', () => {
    render(<Header />)
    expect(screen.getByAltText('NoteCode')).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(<Header />)
    expect(screen.getByText('Create & Share')).toBeInTheDocument()
  })

  it('renders the main heading', () => {
    render(<Header />)
    expect(
      screen.getByRole('heading', { name: /your code easily/i })
    ).toBeInTheDocument()
  })
})
