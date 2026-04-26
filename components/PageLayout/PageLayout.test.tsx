import { render, screen } from '@testing-library/react'
import PageLayout from './PageLayout'

describe('PageLayout', () => {
  it('renders children', () => {
    render(<PageLayout><p>Test content</p></PageLayout>)
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders the Header', () => {
    render(<PageLayout><div /></PageLayout>)
    expect(screen.getByAltText('NoteCode')).toBeInTheDocument()
  })

  it('renders the hero background image', () => {
    const { container } = render(<PageLayout><div /></PageLayout>)
    expect(
      container.querySelector('img[src*="Hero-Background"]')
    ).toBeInTheDocument()
  })
})
