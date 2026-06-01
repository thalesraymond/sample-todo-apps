import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('renders correctly without label or error', () => {
    const { container } = render(<Input placeholder="Enter text" />);

    const inputElement = screen.getByPlaceholderText('Enter text');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveClass('input-field');
    expect(inputElement).not.toHaveClass('input-error');

    const label = container.querySelector('label');
    expect(label).not.toBeInTheDocument();

    const errorSpan = container.querySelector('.error-text');
    expect(errorSpan).not.toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Input label="Username" id="username-input" />);

    const labelElement = screen.getByLabelText('Username');
    expect(labelElement).toBeInTheDocument();

    const labelNode = screen.getByText('Username');
    expect(labelNode).toHaveClass('input-label');
    expect(labelNode).toHaveAttribute('for', 'username-input');
  });

  it('renders error message and applies error class', () => {
    render(<Input placeholder="Email" error="Invalid email address" />);

    const errorElement = screen.getByText('Invalid email address');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveClass('error-text');

    const inputElement = screen.getByPlaceholderText('Email');
    expect(inputElement).toHaveClass('input-error');
  });

  it('forwards additional HTML input attributes', () => {
    const onChangeMock = vi.fn();

    render(
      <Input
        type="password"
        placeholder="Password"
        disabled
        onChange={onChangeMock}
        data-testid="my-input"
        maxLength={10}
      />
    );

    const inputElement = screen.getByTestId('my-input');

    expect(inputElement).toHaveAttribute('type', 'password');
    expect(inputElement).toHaveAttribute('placeholder', 'Password');
    expect(inputElement).toBeDisabled();
    expect(inputElement).toHaveAttribute('maxLength', '10');
  });

  it('handles user input and triggers onChange', async () => {
    const onChangeMock = vi.fn();
    const user = userEvent.setup();

    render(<Input placeholder="Type here" onChange={onChangeMock} />);

    const inputElement = screen.getByPlaceholderText('Type here');
    await user.type(inputElement, 'hello');

    expect(onChangeMock).toHaveBeenCalledTimes(5); // Once for each character
    expect(inputElement).toHaveValue('hello');
  });

  it('applies custom className to the wrapper div', () => {
    const { container } = render(<Input className="my-custom-class" />);

    // The wrapper div should have 'input-group' and 'my-custom-class'
    const wrapperElement = container.firstChild;
    expect(wrapperElement).not.toBeNull();
    expect(wrapperElement).toHaveClass('input-group', 'my-custom-class');
  });
});
