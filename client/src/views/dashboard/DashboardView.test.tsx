import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DashboardView } from './DashboardView';
import { todoService } from '../../services/todo.service';

// Mock the todoService
vi.mock('../../services/todo.service', () => ({
  todoService: {
    getTodos: vi.fn(),
    createTodo: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn(),
  },
}));

describe('DashboardView', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation for getTodos
    vi.mocked(todoService.getTodos).mockResolvedValue([
      { id: '1', title: 'Test Todo 1', completed: false, createdAt: '2023-01-01' },
      { id: '2', title: 'Test Todo 2', completed: true, createdAt: '2023-01-02' }
    ]);
  });

  it('renders correctly and fetches initial todos', async () => {
    render(<DashboardView />);

    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();

    await waitFor(() => {
      expect(todoService.getTodos).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
  });

  it('handles error when adding a new todo fails', async () => {
    // Setup the mock to reject when createTodo is called
    const errorMessage = 'Network error while adding todo';
    vi.mocked(todoService.createTodo).mockRejectedValue(new Error(errorMessage));

    render(<DashboardView />);

    // Wait for initial load to finish
    await waitFor(() => {
      expect(todoService.getTodos).toHaveBeenCalledTimes(1);
    });

    const input = screen.getByPlaceholderText('What needs to be done?');
    const addButton = screen.getByRole('button', { name: 'Add' });

    const user = userEvent.setup();
    await user.type(input, 'New failing task');

    try {
      await user.click(addButton);
    } catch {
      // ignore
    }

    // Verify the error message is displayed
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    expect(screen.getByText(errorMessage)).toHaveClass('error-alert');
  });

  it('displays fallback error message when adding a new todo fails without error message', async () => {
    // Setup the mock to reject without an error message
    vi.mocked(todoService.createTodo).mockRejectedValue({});

    render(<DashboardView />);

    // Wait for initial load to finish
    await waitFor(() => {
      expect(todoService.getTodos).toHaveBeenCalledTimes(1);
    });

    const input = screen.getByPlaceholderText('What needs to be done?');
    const addButton = screen.getByRole('button', { name: 'Add' });

    const user = userEvent.setup();
    await user.type(input, 'New failing task');

    try {
      await user.click(addButton);
    } catch {
      // ignore
    }

    // Verify the fallback error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to add todo')).toBeInTheDocument();
    });
  });
});
