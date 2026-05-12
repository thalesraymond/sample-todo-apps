import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoForm } from './TodoForm';

describe('TodoForm', () => {
  it('renders correctly', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('allows user to type', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'New Todo');

    expect(input).toHaveValue('New Todo');
  });

  it('submits form with valid title and clears input', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TodoForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'New Todo');

    const submitButton = screen.getByRole('button', { name: 'Add' });
    await user.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith('New Todo');
    expect(input).toHaveValue('');
  });

  it('does not submit form with empty or whitespace-only title', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    const submitButton = screen.getByRole('button', { name: 'Add' });

    // Empty submission is prevented by the disabled button natively,
    // but we can also check if pressing enter submits.
    expect(submitButton).toBeDisabled();

    await user.type(input, '   ');
    expect(submitButton).toBeDisabled();

    // Attempting to submit via form event
    await user.type(input, '{enter}');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('early returns and does not call onSubmit when form is submitted with empty title', () => {
    const onSubmit = vi.fn();
    const { container } = render(<TodoForm onSubmit={onSubmit} />);

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();

    // Simulate form submission directly
    if (form) {
      fireEvent.submit(form);
    }
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('disables input and button when isLoading is true', () => {
    const onSubmit = vi.fn();
    const { container } = render(<TodoForm onSubmit={onSubmit} isLoading={true} />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    const submitButton = container.querySelector('button[type="submit"]');

    expect(input).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('does not clear input if onSubmit throws an error', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue(new Error('Network error'));
    render(<TodoForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'Failing Todo');

    const submitButton = screen.getByRole('button', { name: 'Add' });
    await user.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith('Failing Todo');
    expect(input).toHaveValue('Failing Todo'); // Input should not be cleared
  });

  it('disables inputs while submitting', async () => {
    const user = userEvent.setup();
    let resolveSubmit: () => void;
    const submitPromise = new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });

    const onSubmit = vi.fn().mockReturnValue(submitPromise);
    const { container } = render(<TodoForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'Pending Todo');

    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;

    // Start submission
    await user.click(submitButton);

    // Inputs should be disabled during submission
    expect(input).toBeDisabled();
    expect(submitButton).toBeDisabled();

    // Resolve the promise
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await act(async () => {
      resolveSubmit!();
    });

    // Wait for promise to resolve and state to update
    await vi.waitFor(() => {
      expect(input).not.toBeDisabled();
    });
  });

  it('prevents multiple simultaneous submissions', async () => {
    const user = userEvent.setup();
    let resolveSubmit: () => void;
    const submitPromise = new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });

    const onSubmit = vi.fn().mockReturnValue(submitPromise);
    const { container } = render(<TodoForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'Double Submit Todo');

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();

    // Trigger multiple submits
    if (form) {
      fireEvent.submit(form);
      fireEvent.submit(form);
      fireEvent.submit(form);
    }

    expect(onSubmit).toHaveBeenCalledTimes(1);

    // Resolve the promise
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await act(async () => {
      resolveSubmit!();
    });

    await vi.waitFor(() => {
      expect(input).not.toBeDisabled();
    });
  });
});
