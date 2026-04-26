import { render, screen, fireEvent } from '@testing-library/react'
import EditorToolbar from './EditorToolbar'

const defaultProps = {
  language: 'html',
  theme: 'vs',
  isDark: false,
  isShared: false,
  isSharing: false,
  copied: false,
  onLanguageChange: jest.fn(),
  onThemeChange: jest.fn(),
  onShare: jest.fn(),
  onCopyLink: jest.fn(),
}

describe('EditorToolbar', () => {
  beforeEach(() => jest.clearAllMocks())

  describe('selects', () => {
    it('renders two selects (language and theme)', () => {
      render(<EditorToolbar {...defaultProps} />)
      expect(screen.getAllByRole('combobox')).toHaveLength(2)
    })

    it('reflects the current language value', () => {
      render(<EditorToolbar {...defaultProps} language="javascript" />)
      expect(screen.getAllByRole('combobox')[0]).toHaveValue('javascript')
    })

    it('reflects the current theme value', () => {
      render(<EditorToolbar {...defaultProps} theme="vs-dark" />)
      expect(screen.getAllByRole('combobox')[1]).toHaveValue('vs-dark')
    })

    it('calls onLanguageChange when language changes', () => {
      render(<EditorToolbar {...defaultProps} />)
      fireEvent.change(screen.getAllByRole('combobox')[0], {
        target: { value: 'javascript' },
      })
      expect(defaultProps.onLanguageChange).toHaveBeenCalledTimes(1)
    })

    it('calls onThemeChange when theme changes', () => {
      render(<EditorToolbar {...defaultProps} />)
      fireEvent.change(screen.getAllByRole('combobox')[1], {
        target: { value: 'vs-dark' },
      })
      expect(defaultProps.onThemeChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('Share button', () => {
    it('is enabled when not shared', () => {
      render(<EditorToolbar {...defaultProps} isShared={false} />)
      expect(screen.getByRole('button', { name: /share/i })).not.toBeDisabled()
    })

    it('is disabled when already shared', () => {
      render(<EditorToolbar {...defaultProps} isShared={true} />)
      expect(screen.getByRole('button', { name: /share/i })).toBeDisabled()
    })

    it('is disabled while sharing is in progress', () => {
      render(<EditorToolbar {...defaultProps} isSharing={true} />)
      expect(screen.getByRole('button', { name: /sharing/i })).toBeDisabled()
    })

    it('shows "Sharing…" while sharing', () => {
      render(<EditorToolbar {...defaultProps} isSharing={true} />)
      expect(screen.getByText('Sharing…')).toBeInTheDocument()
    })

    it('calls onShare when clicked', () => {
      render(<EditorToolbar {...defaultProps} />)
      fireEvent.click(screen.getByRole('button', { name: /share/i }))
      expect(defaultProps.onShare).toHaveBeenCalledTimes(1)
    })
  })

  describe('Copy link', () => {
    it('is hidden when not shared', () => {
      render(<EditorToolbar {...defaultProps} isShared={false} snippetId="abc123" />)
      expect(screen.queryByText('…/abc123')).not.toBeInTheDocument()
    })

    it('is hidden when shared but no snippetId provided', () => {
      render(<EditorToolbar {...defaultProps} isShared={true} />)
      expect(screen.queryByText(/…\//)).not.toBeInTheDocument()
    })

    it('shows the truncated URL when shared with a snippetId', () => {
      render(<EditorToolbar {...defaultProps} isShared={true} snippetId="abc123" />)
      expect(screen.getByText('…/abc123')).toBeInTheDocument()
    })

    it('calls onCopyLink when clicked', () => {
      render(<EditorToolbar {...defaultProps} isShared={true} snippetId="abc123" />)
      fireEvent.click(screen.getByText('…/abc123').closest('button')!)
      expect(defaultProps.onCopyLink).toHaveBeenCalledTimes(1)
    })
  })

  describe('dark theme', () => {
    it('applies toolbar--dark class when isDark is true', () => {
      const { container } = render(<EditorToolbar {...defaultProps} isDark={true} />)
      expect(container.firstChild).toHaveClass('toolbar--dark')
    })

    it('does not apply toolbar--dark class when isDark is false', () => {
      const { container } = render(<EditorToolbar {...defaultProps} isDark={false} />)
      expect(container.firstChild).not.toHaveClass('toolbar--dark')
    })
  })
})
