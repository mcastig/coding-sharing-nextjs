import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CodeEditor from './CodeEditor'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

jest.mock('@monaco-editor/react', () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
  }: {
    value?: string
    onChange?: (v: string | undefined) => void
  }) => (
    <textarea
      data-testid="monaco-editor"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      readOnly={!onChange}
    />
  ),
}))

global.fetch = jest.fn()

Object.assign(navigator, {
  clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
})

describe('CodeEditor', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders the Monaco editor', async () => {
    render(<CodeEditor initialCode="<h1>Hello</h1>" />)
    await waitFor(() =>
      expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
    )
  })

  it('renders the toolbar with a Share button', () => {
    render(<CodeEditor initialCode="" />)
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument()
  })

  it('Share button is enabled on a fresh editor', () => {
    render(<CodeEditor initialCode="" />)
    expect(screen.getByRole('button', { name: /share/i })).not.toBeDisabled()
  })

  it('Share button is disabled when snippet is already shared', () => {
    render(<CodeEditor initialCode="" snippetId="abc123" />)
    expect(screen.getByRole('button', { name: /share/i })).toBeDisabled()
  })

  it('shows the copy link URL when snippet is already shared', () => {
    render(<CodeEditor initialCode="" snippetId="abc123" />)
    expect(screen.getByText('…/abc123')).toBeInTheDocument()
  })

  it('re-enables Share after editing the code', () => {
    render(<CodeEditor initialCode="" snippetId="abc123" />)
    fireEvent.change(screen.getByTestId('monaco-editor'), {
      target: { value: 'new code' },
    })
    expect(screen.getByRole('button', { name: /share/i })).not.toBeDisabled()
  })

  it('re-enables Share after changing language', () => {
    render(<CodeEditor initialCode="" snippetId="abc123" />)
    fireEvent.change(screen.getAllByRole('combobox')[0], {
      target: { value: 'javascript' },
    })
    expect(screen.getByRole('button', { name: /share/i })).not.toBeDisabled()
  })

  it('does NOT re-enable Share after changing theme', () => {
    render(<CodeEditor initialCode="" snippetId="abc123" />)
    fireEvent.change(screen.getAllByRole('combobox')[1], {
      target: { value: 'vs-dark' },
    })
    expect(screen.getByRole('button', { name: /share/i })).toBeDisabled()
  })

  it('POSTs to /api/snippets and navigates on Share', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ id: 'new-id' }),
    })

    render(<CodeEditor initialCode="<h1>Test</h1>" />)
    fireEvent.click(screen.getByRole('button', { name: /share/i }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/snippets',
        expect.objectContaining({ method: 'POST' })
      )
      expect(mockPush).toHaveBeenCalledWith('/new-id', { scroll: false })
    })
  })

  it('does not navigate when the API returns no id', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({}),
    })

    render(<CodeEditor initialCode="" />)
    fireEvent.click(screen.getByRole('button', { name: /share/i }))

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('copies the current URL to clipboard when Copy Link is clicked', async () => {
    render(<CodeEditor initialCode="" snippetId="abc123" />)
    fireEvent.click(screen.getByText('…/abc123').closest('button')!)
    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        window.location.href
      )
    )
  })
})
