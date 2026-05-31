import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn', 'btn-primary', 'btn-md');
    expect(button).not.toBeDisabled();
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="secondary">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-secondary');

    rerender(<Button variant="danger">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-danger');

    rerender(<Button variant="ghost">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-ghost');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-sm');

    rerender(<Button size="lg">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-lg');
  });

  it('merges custom className with default classes', () => {
    render(<Button className="custom-class">Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn', 'btn-primary', 'btn-md', 'custom-class');
  });

  it('forwards standard button props', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button type="submit" onClick={handleClick} data-testid="test-btn">Submit</Button>);

    const button = screen.getByTestId('test-btn');
    expect(button).toHaveAttribute('type', 'submit');

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('respects the disabled prop', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button', { name: 'Disabled Button' });
    expect(button).toBeDisabled();
  });

  describe('when isLoading is true', () => {
    it('shows a spinner instead of children', () => {
      render(<Button isLoading>Loading Button</Button>);

      const spinner = screen.getByTestId('spinner');
      expect(spinner).toBeInTheDocument();
      expect(screen.queryByText('Loading Button')).not.toBeInTheDocument();
    });

    it('disables the button', () => {
      render(<Button isLoading>Loading Button</Button>);

      // Since children aren't rendered, we can't search by name using the children text.
      // We search by role since it's the only button.
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('passes the correct size to the spinner', () => {
      const { rerender } = render(<Button isLoading size="sm">Button</Button>);
      const spinnerSm = screen.getByTestId('spinner');
      expect(spinnerSm).not.toHaveClass('loader-lg');

      rerender(<Button isLoading size="lg">Button</Button>);
      const spinnerLg = screen.getByTestId('spinner');
      expect(spinnerLg).toHaveClass('loader-lg');
    });
  });
});
