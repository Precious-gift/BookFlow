import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InputField } from './input-field';

describe('InputField Component', () => {
  it('renders input with label and links id via htmlFor', () => {
    render(<InputField label="Customer Name" placeholder="Enter name" />);
    const input = screen.getByLabelText(/customer name/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Enter name');
  });

  it('renders required indicator and sets aria-required', () => {
    render(<InputField label="Phone Number" required />);
    const input = screen.getByLabelText(/phone number/i);
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders optional indicator badge', () => {
    render(<InputField label="Email Address" optional />);
    expect(screen.getByText('(optional)')).toBeInTheDocument();
  });

  it('renders helper text linked via aria-describedby', () => {
    render(<InputField label="Code" helperText="Enter 4-digit code" />);
    const helper = screen.getByText('Enter 4-digit code');
    const input = screen.getByLabelText(/code/i);
    expect(input).toHaveAttribute('aria-describedby', helper.id);
  });

  it('renders error state with aria-invalid and error message', () => {
    render(<InputField label="Email" error="Invalid email address" />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
  });

  it('renders disabled state and disables input interactions', () => {
    render(<InputField label="Tenant ID" disabled defaultValue="TENANT-123" />);
    const input = screen.getByLabelText(/tenant id/i);
    expect(input).toBeDisabled();
    expect(input).toHaveClass('cursor-not-allowed');
  });

  it('renders loading state with spinner and disables input', () => {
    render(<InputField label="Search" loading defaultValue="Query" />);
    const input = screen.getByLabelText(/search/i);
    expect(input).toBeDisabled();
    expect(screen.getByLabelText(/loading input content/i)).toBeInTheDocument();
  });

  it('handles onChange typing events', () => {
    const handleChange = vi.fn();
    render(<InputField label="Notes" onChange={handleChange} />);
    const input = screen.getByLabelText(/notes/i);
    fireEvent.change(input, { target: { value: 'Customer preference' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
