import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import ResourceHub from './ResourceHub.jsx';

beforeEach(() => {
  localStorage.clear();
});

describe('UdaanSetu resource hub', () => {
  it('presents a curated directory in Telugu while clearly linking to the original source', () => {
    render(<ResourceHub language="te" />);
    expect(screen.getByRole('heading', { name: /ఉపయోగకరమైన విద్యా లింకులు/i })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'విద్యా వనరులను వెతకండి' })).toBeInTheDocument();
    const card = screen.getByRole('heading', { name: 'W3Schools' }).closest('article');
    expect(within(card).getByRole('link', { name: /అసలు వెబ్‌సైట్ తెరవండి/i })).toHaveAttribute('href', 'https://www.w3schools.com/');
    expect(within(card).getByRole('link', { name: /అసలు వెబ్‌సైట్ తెరవండి/i })).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('filters coding resources without embedding third-party tutorials', () => {
    render(<ResourceHub language="en" initialCategory="coding" />);
    expect(screen.getByRole('heading', { name: 'W3Schools' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'GeeksforGeeks' })).toBeInTheDocument();
    fireEvent.change(screen.getByRole('searchbox', { name: /Search learning resources/i }), { target: { value: 'Python' } });
    expect(screen.getByRole('heading', { name: 'Python Tutorial' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'GeeksforGeeks Practice' })).not.toBeInTheDocument();
  });

  it('saves only bookmark IDs locally and correctly shows the saved-only view', () => {
    render(<ResourceHub language="en" />);
    fireEvent.click(within(screen.getByRole('heading', { name: 'W3Schools' }).closest('article')).getByRole('button', { name: /Save link: W3Schools/i }));
    expect(JSON.parse(localStorage.getItem('udaan.resourceBookmarks.v1'))).toEqual(['w3schools']);
    fireEvent.click(screen.getByRole('button', { name: /Show saved only/i }));
    expect(screen.getByRole('heading', { name: 'W3Schools' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'GeeksforGeeks' })).not.toBeInTheDocument();
  });
});
