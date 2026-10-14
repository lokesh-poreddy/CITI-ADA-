import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PartnerWorkspace from './PartnerWorkspace.jsx';
import { ecosystemApi } from '../api/ecosystem.js';

vi.mock('../api/ecosystem.js', async () => {
  const actual = await vi.importActual('../api/ecosystem.js');
  return { ...actual, ecosystemApi: {
    ...actual.ecosystemApi,
    listCohorts: vi.fn(), listReferrals: vi.fn(), listMyModules: vi.fn(), listPublishedModules: vi.fn(),
    listMentors: vi.fn(), listMentorRequests: vi.fn(), listPartnerListings: vi.fn(), listMyListings: vi.fn(),
    listIntegrations: vi.fn(), listReminders: vi.fn(), getSustainabilityOverview: vi.fn(), getNotificationPreferences: vi.fn(),
  } };
});

beforeEach(() => {
  localStorage.clear();
  ecosystemApi.listCohorts.mockResolvedValue([]); ecosystemApi.listReferrals.mockResolvedValue([]);
  ecosystemApi.listMyModules.mockResolvedValue([]); ecosystemApi.listPublishedModules.mockResolvedValue([]);
  ecosystemApi.listMentors.mockResolvedValue([]); ecosystemApi.listMentorRequests.mockResolvedValue([]);
  ecosystemApi.listPartnerListings.mockResolvedValue([]); ecosystemApi.listMyListings.mockResolvedValue([]);
  ecosystemApi.listIntegrations.mockResolvedValue([]); ecosystemApi.listReminders.mockResolvedValue([]);
  ecosystemApi.getSustainabilityOverview.mockResolvedValue({ productPolicy: 'Core discovery free', models: [], validationQuestions: [], paymentStatus: 'No checkout' });
  ecosystemApi.getNotificationPreferences.mockResolvedValue({ inAppEnabled: true, emailEnabled: false, smsEnabled: false, consentToExternalDelivery: false });
});

describe('PartnerWorkspace', () => {
  it('renders ecosystem navigation and loads facilitator workspace', async () => {
    render(<PartnerWorkspace language="en" />);
    expect(screen.getByRole('heading', { name: /People, programmes and pathways/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Learning modules/i })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/No cohorts yet/i)).toBeInTheDocument());
  });
  it('switches to learning module authoring', async () => {
    render(<PartnerWorkspace language="en" />);
    fireEvent.click(screen.getByRole('tab', { name: /Learning modules/i }));
    expect(screen.getByRole('heading', { name: /Publish practical learning/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Module title/i)).toBeInTheDocument();
  });
  it('explains that partner connections are facilitator mediated', async () => {
    ecosystemApi.listMentors.mockResolvedValue([{ id: 'mentor-test', displayName: 'Demo mentor', expertise: 'Design', bio: 'Demo bio', region: 'Tamil Nadu', languages: ['en'], organization: 'Demo partner', verified: true, demoProfile: true }]);
    render(<PartnerWorkspace language="en" />);
    fireEvent.click(screen.getByRole('tab', { name: /Mentor connections/i }));
    await waitFor(() => expect(screen.getByText(/Demo mentor/i)).toBeInTheDocument());
    expect(screen.getByText(/does not expose personal contact information/i)).toBeInTheDocument();
  });
});
