import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from './App'
import * as api from './api'

vi.mock('./api', () => ({
  fetchHealth: vi.fn(),
}))

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state initially', () => {
    vi.mocked(api.fetchHealth).mockReturnValue(new Promise(() => {}))
    render(<App />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders health status when fetch is successful', async () => {
    const mockHealthResponse = { status: 'ok' }
    vi.mocked(api.fetchHealth).mockResolvedValue(mockHealthResponse)

    render(<App />)

    await waitFor(() => {
      expect(screen.getByTestId('health-response')).toHaveTextContent(
        /ok/
      )
    })
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('renders error message when fetch fails', async () => {
    vi.mocked(api.fetchHealth).mockRejectedValue(new Error('Network Error'))

    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Network Error')
    })
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })
})
