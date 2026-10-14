import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import StudentJourney from './StudentJourney.jsx';
import { clearLocalLearnerProfile, getLocalLearnerProfile } from '../offline/offlinePocket.js';

vi.mock('../api/learnerJourney.js', () => ({
  createLearnerProfile: vi.fn(),
  deleteLearnerProfile: vi.fn().mockResolvedValue(true),
  fetchCareerRecommendations: vi.fn(),
  fetchLearningPathway: vi.fn().mockRejectedValue(new Error('not connected in this UI test')),
}));

beforeEach(async () => {
  await clearLocalLearnerProfile();
  localStorage.clear();
  const api = await import('../api/learnerJourney.js');
  api.createLearnerProfile.mockReset().mockResolvedValue({ learnerId: 'learner-00000000-0000-0000-0000-000000000000' });
  api.deleteLearnerProfile.mockReset().mockResolvedValue(true);
  api.fetchCareerRecommendations.mockReset().mockResolvedValue({ items: [{ pathwayId: 'skilled-technical', relativeFit: 82, explanation: 'A supported demo match.' }] });
  api.fetchLearningPathway.mockReset().mockRejectedValue(new Error('not connected in this UI test'));
});

describe('StudentJourney vertical flow', () => {
  it('shows Telugu education-stage options and preserves Telugu when saving a local draft', async () => {
    render(<StudentJourney language="te" />);
    fireEvent.click(screen.getByRole('button', { name: /నా అభ్యాస మార్గాన్ని ప్రారంభించండి/i }));
    expect(screen.getByText(/మీరు ప్రస్తుతం ఏ విద్యా దశలో ఉన్నారు/i)).toBeInTheDocument();
    const stageSelect = screen.getByRole('combobox', { name: /మీరు ప్రస్తుతం ఏ విద్యా దశలో ఉన్నారు/i });
    expect(within(stageSelect).getByRole('option', { name: '9–10 తరగతులు' })).toBeInTheDocument();
    expect(within(stageSelect).getByRole('option', { name: /డిప్లొమా \/ ITI \/ వృత్తి విద్య/i })).toBeInTheDocument();
    await waitFor(async () => expect((await getLocalLearnerProfile())?.profile?.preferredLanguage).toBe('te'));
  });
  it('moves from profile choices through recommendations into an actionable plan', async () => {
    const onExploreOpportunities = vi.fn();
    render(<StudentJourney language="en" onExploreOpportunities={onExploreOpportunities} />);

    fireEvent.click(screen.getByRole('button', { name: /Start my pathway/i }));
    expect(screen.getByText(/Where are you in your learning journey/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^Continue/i }));

    fireEvent.click(screen.getByRole('button', { name: /Making, fixing or building/i }));
    fireEvent.click(screen.getByRole('button', { name: /Computers and technology/i }));
    fireEvent.click(screen.getByRole('button', { name: /Learning by doing/i }));
    fireEvent.click(screen.getByRole('button', { name: /Solving problems/i }));
    fireEvent.click(screen.getByRole('button', { name: /Learn a practical skill/i }));
    fireEvent.click(screen.getByRole('button', { name: /Prepare for work/i }));
    fireEvent.click(screen.getByRole('button', { name: /Explore my pathways/i }));

    expect(await screen.findByText(/Several paths can fit the same person/i)).toBeInTheDocument();
    expect(screen.getByText(/Build, repair & work with technology/i)).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: /Explore this path/i })[0]);
    expect(await screen.findByText(/Turn curiosity into a next step/i)).toBeInTheDocument();
    expect(screen.getByText(/A short learning plan/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Find related opportunities/i }));
    expect(onExploreOpportunities).toHaveBeenCalledWith(expect.objectContaining({ pathwayId: 'skilled-technical' }));
  });

  it('saves a draft locally while the learner is editing, without requiring API access', async () => {
    const api = await import('../api/learnerJourney.js');
    render(<StudentJourney language="en" />);
    fireEvent.click(screen.getByRole('button', { name: /Start my pathway/i }));
    fireEvent.click(screen.getByRole('button', { name: /^Continue/i }));
    fireEvent.click(screen.getByRole('button', { name: /Making, fixing or building/i }));
    await waitFor(async () => {
      const saved = await getLocalLearnerProfile();
      expect(saved?.profile?.interests).toContain('handsOn');
    });
    expect(api.createLearnerProfile).not.toHaveBeenCalled();
  });

  it('requires demo-service opt-in to be confirmed again after reopening a saved draft', async () => {
    const firstVisit = render(<StudentJourney language="en" />);
    fireEvent.click(screen.getByRole('button', { name: /Start my pathway/i }));
    fireEvent.click(screen.getByRole('button', { name: /^Continue/i }));
    const consentToggle = screen.getByRole('checkbox', { name: /Optional: allow the demo service/i });
    fireEvent.click(consentToggle);
    await waitFor(async () => {
      const saved = await getLocalLearnerProfile();
      expect(saved?.profile?.allowDemoProcessing).toBe(false);
    });
    firstVisit.unmount();

    render(<StudentJourney language="en" />);
    await screen.findByRole('button', { name: /Resume saved path/i });
    fireEvent.click(screen.getByRole('button', { name: /Start my pathway/i }));
    fireEvent.click(screen.getByRole('button', { name: /^Continue/i }));
    expect(screen.getByRole('checkbox', { name: /Optional: allow the demo service/i })).not.toBeChecked();
  });

  it('keeps a retry control when local data clears but remote temporary-profile deletion fails', async () => {
    const api = await import('../api/learnerJourney.js');
    api.deleteLearnerProfile.mockResolvedValue(false);
    render(<StudentJourney language="en" />);
    fireEvent.click(screen.getByRole('button', { name: /Start my pathway/i }));
    fireEvent.click(screen.getByRole('checkbox', { name: /Optional: allow the demo service/i }));
    fireEvent.click(screen.getByRole('button', { name: /^Continue/i }));
    fireEvent.click(screen.getByRole('button', { name: /Making, fixing or building/i }));
    fireEvent.click(screen.getByRole('button', { name: /Learn a practical skill/i }));
    fireEvent.click(screen.getByRole('button', { name: /Explore my pathways/i }));
    expect(await screen.findByText(/Several paths can fit the same person/i)).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: /Explore this path/i })[0]);
    expect(await screen.findByText(/Turn curiosity into a next step/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Clear my local profile/i }));
    expect(await screen.findByText(/could not be deleted immediately/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Retry clearing saved data/i })).toBeInTheDocument();
  });

  it('keeps recommendations local unless demo-service processing is explicitly enabled', async () => {
    const api = await import('../api/learnerJourney.js');
    render(<StudentJourney language="en" />);
    fireEvent.click(screen.getByRole('button', { name: /Start my pathway/i }));
    fireEvent.click(screen.getByRole('button', { name: /^Continue/i }));
    fireEvent.click(screen.getByRole('button', { name: /Making, fixing or building/i }));
    fireEvent.click(screen.getByRole('button', { name: /Learn a practical skill/i }));
    fireEvent.click(screen.getByRole('button', { name: /Explore my pathways/i }));
    await waitFor(() => expect(screen.getByText(/Several paths can fit the same person/i)).toBeInTheDocument());
    expect(api.createLearnerProfile).not.toHaveBeenCalled();
  });
});
