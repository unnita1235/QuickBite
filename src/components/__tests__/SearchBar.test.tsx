import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input', () => {
    render(<SearchBar onSearch={mockOnSearch} isSearching={false} />);
    expect(screen.getByLabelText('Search restaurants and cuisine')).toBeInTheDocument();
  });

  it('displays placeholder text', () => {
    render(<SearchBar onSearch={mockOnSearch} isSearching={false} />);
    expect(screen.getByPlaceholderText(/Search for restaurants or cuisine/)).toBeInTheDocument();
  });


  it('shows loading indicator when searching', () => {
    render(<SearchBar onSearch={mockOnSearch} isSearching={true} />);
    // The loader is an SVG with animate-spin class, check by class or querySelector
    const loader = document.querySelector('.animate-spin');
    expect(loader).toBeInTheDocument();
  });

  it('does not show loading indicator when not searching', () => {
    render(<SearchBar onSearch={mockOnSearch} isSearching={false} />);
    const loaders = document.querySelectorAll('.animate-spin');
    expect(loaders.length).toBe(0);
  });

  it('has accessible search input', () => {
    render(<SearchBar onSearch={mockOnSearch} isSearching={false} />);
    const input = screen.getByLabelText('Search restaurants and cuisine');
    expect(input).toHaveAttribute('aria-label', 'Search restaurants and cuisine');
    expect(input).toHaveAttribute('aria-describedby', 'search-description');
  });
});
