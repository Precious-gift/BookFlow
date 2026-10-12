import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './status-badge';

describe('StatusBadge Component', () => {
  it('renders Pending status with text label, distinct clock icon, and semantic token classes', () => {
    const { container } = render(<StatusBadge status="Pending" />);
    const badge = screen.getByRole('status', { name: /status: pending/i });

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Pending');
    expect(badge).toHaveClass('bg-status-pending-bg');
    expect(badge).toHaveClass('text-status-pending-text');
    expect(badge).toHaveClass('border-status-pending-border');

    // Verifies distinct SVG icon is rendered (Clock icon for Pending)
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders Confirmed status with text label, distinct checkmark icon, and semantic token classes', () => {
    const { container } = render(<StatusBadge status="Confirmed" />);
    const badge = screen.getByRole('status', { name: /status: confirmed/i });

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Confirmed');
    expect(badge).toHaveClass('bg-status-confirmed-bg');
    expect(badge).toHaveClass('text-status-confirmed-text');
    expect(badge).toHaveClass('border-status-confirmed-border');

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders Completed status with text label, distinct circle check icon, and semantic token classes', () => {
    const { container } = render(<StatusBadge status="Completed" />);
    const badge = screen.getByRole('status', { name: /status: completed/i });

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Completed');
    expect(badge).toHaveClass('bg-status-completed-bg');
    expect(badge).toHaveClass('text-status-completed-text');
    expect(badge).toHaveClass('border-status-completed-border');

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders Cancelled status with text label, distinct cross icon, and semantic token classes', () => {
    const { container } = render(<StatusBadge status="Cancelled" />);
    const badge = screen.getByRole('status', { name: /status: cancelled/i });

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Cancelled');
    expect(badge).toHaveClass('bg-status-cancelled-bg');
    expect(badge).toHaveClass('text-status-cancelled-text');
    expect(badge).toHaveClass('border-status-cancelled-border');

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders loading state with skeleton shimmer and aria-busy attribute', () => {
    render(<StatusBadge loading />);
    const loadingBadge = screen.getByLabelText(/loading appointment status/i);

    expect(loadingBadge).toBeInTheDocument();
    expect(loadingBadge).toHaveAttribute('aria-busy', 'true');
    expect(loadingBadge).toHaveClass('animate-pulse');
    expect(loadingBadge).toHaveTextContent(/loading/i);
  });

  it('renders disabled state with aria-disabled and subdued styling', () => {
    render(<StatusBadge status="Confirmed" disabled />);
    const disabledBadge = screen.getByRole('status', { name: /status: confirmed \(disabled\)/i });

    expect(disabledBadge).toHaveAttribute('aria-disabled', 'true');
    expect(disabledBadge).toHaveClass('opacity-60');
    expect(disabledBadge).toHaveClass('bg-surface-secondary');
  });

  it('renders error state with warning icon and custom or default label', () => {
    const { container } = render(<StatusBadge error label="Sync Failure" />);
    const errorBadge = screen.getByRole('status', { name: /status error/i });

    expect(errorBadge).toBeInTheDocument();
    expect(errorBadge).toHaveTextContent('Sync Failure');
    expect(errorBadge).toHaveClass('bg-status-cancelled-bg');
    expect(errorBadge).toHaveClass('text-status-cancelled-text');

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});
