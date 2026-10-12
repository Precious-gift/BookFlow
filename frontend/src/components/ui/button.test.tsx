import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button Component', () => {
  it('renders with children and accessible role', () => {
    render(<Button>Confirm Appointment</Button>);
    const button = screen.getByRole('button', { name: /confirm appointment/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
  });

  it('applies primary variant semantic classes by default', () => {
    render(<Button variant="primary">Primary Action</Button>);
    const button = screen.getByRole('button', { name: /primary action/i });
    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('rounded-lg');
  });

  it('applies secondary variant semantic classes', () => {
    render(<Button variant="secondary">Secondary Action</Button>);
    const button = screen.getByRole('button', { name: /secondary action/i });
    expect(button).toHaveClass('bg-surface');
    expect(button).toHaveClass('border');
    expect(button).toHaveClass('border-border');
    expect(button).toHaveClass('text-text-primary');
  });

  it('applies destructive variant semantic classes', () => {
    render(<Button variant="destructive">Cancel Booking</Button>);
    const button = screen.getByRole('button', { name: /cancel booking/i });
    expect(button).toHaveClass('text-status-cancelled-text');
    expect(button).toHaveClass('border-status-cancelled-border');
  });

  it('applies ghost variant semantic classes', () => {
    render(<Button variant="ghost">Dismiss</Button>);
    const button = screen.getByRole('button', { name: /dismiss/i });
    expect(button).toHaveClass('bg-transparent');
    expect(button).toHaveClass('text-text-secondary');
  });

  it('enforces touch targets of at least 44px on mobile/tablet', () => {
    render(<Button size="md">Touch Button</Button>);
    const button = screen.getByRole('button', { name: /touch button/i });
    expect(button).toHaveClass('min-h-[44px]');
  });

  it('handles user click events when enabled', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles disabled state with correct accessibility attributes and blocks clicks', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled Button</Button>);
    const button = screen.getByRole('button', { name: /disabled button/i });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveClass('disabled:cursor-not-allowed');

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('handles loading state with spinner, aria-busy, and disabled interaction', () => {
    const handleClick = vi.fn();
    render(<Button loading onClick={handleClick}>Saving Record</Button>);
    const button = screen.getByRole('button', { name: /saving record/i });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');

    // Verifies SVG spinner exists inside button
    const spinner = button.querySelector('svg');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies error state styling', () => {
    render(<Button error>Retry Action</Button>);
    const button = screen.getByRole('button', { name: /retry action/i });
    expect(button).toHaveClass('border-status-cancelled');
    expect(button).toHaveClass('text-status-cancelled-text');
  });
});
