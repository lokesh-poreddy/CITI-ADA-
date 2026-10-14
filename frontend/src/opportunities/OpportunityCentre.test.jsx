import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import OpportunityCentre from './OpportunityCentre.jsx';
import { askGroundedAssistant } from '../api/opportunities.js';

vi.mock('../api/opportunities.js', () => ({
  fetchOpportunities: vi.fn().mockRejectedValue(new Error('API unavailable in offline test')),
  fetchOpportunityActions: vi.fn().mockRejectedValue(new Error('API unavailable in offline test')),
  requestEligibilityCheck: vi.fn(),
  syncOpportunityActions: vi.fn(),
  askGroundedAssistant: vi.fn(),
}));

describe('OpportunityCentre', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.replaceState({}, '', '/');
    window.localStorage.clear();
  });

  it('renders an honest source-linked fallback when APIs are unavailable', async () => {
    render(<OpportunityCentre language="en" />);
    expect(screen.getByRole('heading', { name: /find an opportunity that moves you forward/i })).toBeTruthy();
    await waitFor(() => expect(screen.getByText(/showing starter source references/i)).toBeTruthy());
    expect(screen.getByText('SWAYAM — course search')).toBeTruthy();
    expect(screen.getAllByText(/a source link is not proof/i).length).toBeGreaterThan(0);
  });

  it('opens the detail view and presents a review warning for unconfigured eligibility', async () => {
    render(<OpportunityCentre language="en" />);
    await waitFor(() => expect(screen.getByText('SWAYAM — course search')).toBeTruthy());
    fireEvent.click(screen.getAllByRole('button', { name: /view details/i })[0]);
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText(/eligibility not encoded/i)).toBeTruthy();
  });

  it('offers one-tap question paths for likely learner needs', async () => {
    render(<OpportunityCentre language="en" />);
    await waitFor(() => expect(screen.getByText('SWAYAM — course search')).toBeTruthy());
    const prompt = document.querySelector('.op-assistant-prompts button');
    expect(prompt).toBeTruthy();
    fireEvent.click(prompt);
    await waitFor(() => expect(askGroundedAssistant).toHaveBeenCalledWith(
      'How can I find scholarships for college?', 'en', expect.any(Array),
    ));
  });

  it('shows the source curation workbench only in explicit local review mode', async () => {
    window.history.replaceState({}, '', '/?review=1');
    render(<OpportunityCentre language="ta" />);
    await waitFor(() => expect(screen.getByText(/தொடக்க மூல குறிப்புகள்/i)).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: /source review workspace/i }));
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText(/local reviewer token/i)).toBeTruthy();
  });
});
