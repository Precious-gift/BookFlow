import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PublicMarketingLandingPage from './page';

describe('Public Marketing Landing Page (PUB-01)', () => {
  it('renders the brand logo and core headline hierarchy', () => {
    render(<PublicMarketingLandingPage />);

    // Brand mark
    expect(screen.getAllByText('BookFlow').length).toBeGreaterThanOrEqual(1);

    // Hero headline and copy
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /simple booking and customer management for your business/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/bookflow gives independent service businesses a simple way to manage appointments/i)
    ).toBeInTheDocument();
  });

  it('routes CTA buttons cleanly to /register and /login', () => {
    render(<PublicMarketingLandingPage />);

    // Check all registration entry points
    const registerLinks = screen.getAllByRole('link', { name: /get started/i });
    expect(registerLinks.length).toBeGreaterThanOrEqual(3); // header, hero, banner, footer
    registerLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/register');
    });

    // Check all sign in entry points
    const loginLinks = screen.getAllByRole('link', { name: /sign in/i });
    expect(loginLinks.length).toBeGreaterThanOrEqual(3); // header, hero, banner, footer
    loginLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/login');
    });
  });

  it('enforces ZERO authenticated navigation items on the public page', () => {
    render(<PublicMarketingLandingPage />);

    // Query all clickable link elements
    const allLinks = screen.getAllByRole('link');
    const hrefs = allLinks.map((link) => link.getAttribute('href') || '');

    // None should navigate to authenticated portal routes
    hrefs.forEach((href) => {
      expect(href.startsWith('/portal')).toBe(false);
      expect(href.startsWith('/admin')).toBe(false);
    });

    // Verify there are no authenticated user menu items or dashboard controls in the navigation
    expect(screen.queryByText(/sign out/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/log out/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/my account/i)).not.toBeInTheDocument();
  });

  it('renders all value proposition benefits', () => {
    render(<PublicMarketingLandingPage />);

    expect(screen.getByText('Simple Appointment Booking')).toBeInTheDocument();
    expect(screen.getByText('No Customer Account Required')).toBeInTheDocument();
    expect(screen.getByText('Customer Management')).toBeInTheDocument();
    expect(screen.getAllByText('Availability Control').length).toBe(2);
  });

  it('renders all 4 core features and 3-step "How It Works" guide', () => {
    render(<PublicMarketingLandingPage />);

    // Features
    expect(screen.getByText('Appointment Management')).toBeInTheDocument();
    expect(screen.getByText('Service Management')).toBeInTheDocument();
    expect(screen.getByText('Customer CRM')).toBeInTheDocument();

    // 3 Steps
    expect(screen.getByText('Set Up Your Business')).toBeInTheDocument();
    expect(screen.getByText('Share Your Booking Page')).toBeInTheDocument();
    expect(screen.getByText('Manage Your Appointments')).toBeInTheDocument();
  });

  it('renders frictionless guest information callout with strict 3-field rule', () => {
    render(<PublicMarketingLandingPage />);

    expect(screen.getByText('Frictionless Guest Information')).toBeInTheDocument();
    expect(screen.getByText('Full Name')).toBeInTheDocument();
    expect(screen.getByText('Phone Number')).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByText(/accountless guest booking/i)).toBeInTheDocument();
  });

  it('toggles mobile navigation drawer with accessible ARIA attributes', () => {
    render(<PublicMarketingLandingPage />);

    const toggleButton = screen.getByRole('button', { name: /toggle navigation menu/i });
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

    // Open drawer
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

    const drawer = document.getElementById('mobile-navigation-drawer');
    expect(drawer).toBeInTheDocument();

    // Close drawer
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById('mobile-navigation-drawer')).toBeNull();
  });

  it('closes mobile navigation drawer on Escape key', () => {
    render(<PublicMarketingLandingPage />);

    const toggleButton = screen.getByRole('button', { name: /toggle navigation menu/i });

    // Open drawer
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

    // Press Escape
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById('mobile-navigation-drawer')).toBeNull();
  });

  it('enforces touch targets of at least 44px on primary CTA links', () => {
    render(<PublicMarketingLandingPage />);

    const heroRegister = document.getElementById('hero-cta-register');
    const heroLogin = document.getElementById('hero-cta-login');
    const headerRegister = document.getElementById('header-cta-register');
    const headerLogin = document.getElementById('header-cta-login');

    expect(heroRegister).toHaveClass('min-h-[44px]');
    expect(heroLogin).toHaveClass('min-h-[44px]');
    expect(headerRegister).toHaveClass('min-h-[44px]');
    expect(headerLogin).toHaveClass('min-h-[44px]');
  });

  it('renders Availability Control weekday cards with responsive compact styling on Friday Blocked card', () => {
    render(<PublicMarketingLandingPage />);

    // Verify all 5 weekdays are present
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    weekdays.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });

    // Locate the Friday card Blocked status element
    const blockedStatus = screen.getByText('Blocked');
    expect(blockedStatus).toBeInTheDocument();
    expect(blockedStatus.tagName.toLowerCase()).toBe('span');

    // Confirm text is not hidden, not truncated, and applies responsive font and tracking classes
    expect(blockedStatus).toHaveClass('text-[10px]');
    expect(blockedStatus).toHaveClass('sm:text-[11px]');
    expect(blockedStatus).toHaveClass('tracking-tight');
    expect(blockedStatus).toHaveClass('inline-block');

    // Confirm parent Friday card uses responsive padding (compact on mobile, standard on sm+)
    const fridayCard = blockedStatus.closest('div');
    expect(fridayCard).not.toBeNull();
    expect(fridayCard).toHaveClass('py-2');
    expect(fridayCard).toHaveClass('px-1');
    expect(fridayCard).toHaveClass('sm:p-2');
  });
});
