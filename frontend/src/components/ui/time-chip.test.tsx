import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimeChip } from './time-chip';

describe('TimeChip Component', () => {
  it('renders available slot with time, period, and role button', () => {
    render(<TimeChip time="10:00" period="AM" />);
    const chip = screen.getByRole('button');
    expect(chip).toHaveTextContent('10:00');
    expect(chip).toHaveTextContent('AM');
    expect(chip).toHaveAttribute('aria-pressed', 'false');
    expect(chip).toHaveClass('min-h-[44px]');
  });

  it('renders selected slot with aria-pressed and primary classes', () => {
    render(<TimeChip time="11:30" period="AM" selected />);
    const chip = screen.getByRole('button');
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    expect(chip).toHaveClass('bg-primary');
    expect(chip).toHaveClass('text-white');
  });

  it('renders disabled slot with line-through and blocks clicks', () => {
    const handleClick = vi.fn();
    render(<TimeChip time="01:00" period="PM" disabled onClick={handleClick} />);
    const chip = screen.getByRole('button');
    expect(chip).toBeDisabled();
    expect(chip).toHaveAttribute('aria-disabled', 'true');
    expect(chip).toHaveClass('line-through');
    fireEvent.click(chip);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders loading slot with aria-busy and disables clicks', () => {
    const handleClick = vi.fn();
    render(<TimeChip time="02:00" period="PM" loading onClick={handleClick} />);
    const chip = screen.getByRole('button');
    expect(chip).toBeDisabled();
    expect(chip).toHaveAttribute('aria-busy', 'true');
    expect(chip).toHaveClass('animate-pulse');
    fireEvent.click(chip);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders error slot with error border classes', () => {
    render(<TimeChip time="03:00" period="PM" error />);
    const chip = screen.getByRole('button');
    expect(chip).toHaveClass('bg-status-cancelled-bg');
    expect(chip).toHaveClass('border-status-cancelled-border');
  });

  it('fires onClick callback on selection', () => {
    const handleClick = vi.fn();
    render(<TimeChip time="04:00" period="PM" onClick={handleClick} />);
    const chip = screen.getByRole('button');
    fireEvent.click(chip);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
