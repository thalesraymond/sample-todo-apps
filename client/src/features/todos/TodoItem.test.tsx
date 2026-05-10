import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TodoItem } from './TodoItem';

describe('TodoItem', () => {
  const mockTodo = {
    id: '1',
    title: 'Test Todo',
    completed: false,
    userId: 'user1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('renders the todo title', () => {
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('reflects the completed state correctly when false', () => {
    const { container } = render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    // The div shouldn't have the todo-completed class
    expect(container.firstChild).not.toHaveClass('todo-completed');
  });

  it('reflects the completed state correctly when true', () => {
    const completedTodo = { ...mockTodo, completed: true };
    const { container } = render(<TodoItem todo={completedTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();

    // The div should have the todo-completed class
    expect(container.firstChild).toHaveClass('todo-completed');
  });

  it('calls onToggle with correct arguments when checkbox is clicked', async () => {
    const onToggleMock = vi.fn();
    render(<TodoItem todo={mockTodo} onToggle={onToggleMock} onDelete={vi.fn()} />);

    const user = userEvent.setup();
    const checkbox = screen.getByRole('checkbox');

    await user.click(checkbox);

    expect(onToggleMock).toHaveBeenCalledTimes(1);
    expect(onToggleMock).toHaveBeenCalledWith('1', true);
  });

  it('calls onDelete with correct arguments when delete button is clicked', async () => {
    const onDeleteMock = vi.fn();
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={onDeleteMock} />);

    const user = userEvent.setup();
    const deleteBtn = screen.getByLabelText('Delete todo');

    await user.click(deleteBtn);

    expect(onDeleteMock).toHaveBeenCalledTimes(1);
    expect(onDeleteMock).toHaveBeenCalledWith('1');
  });
});
