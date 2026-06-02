import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import SearchBar from '../SearchBar';
import { Category } from '@/shared/enums/category';
import { OrderBy } from '@/shared/enums/orderBy';

describe('SearchBar', () => {
  const mockOnSearchChange = vi.fn();
  const mockOnCategoryChange = vi.fn();
  const mockOnOrderByChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all fields with correct initial values', () => {
    render(
      <SearchBar
        currentSearch="shoes"
        currentCategory={Category.Apparel}
        currentOrderBy={OrderBy.PriceAsc}
        onSearchChange={mockOnSearchChange}
        onCategoryChange={mockOnCategoryChange}
        onOrderByChange={mockOnOrderByChange}
      />
    );

    // Assert search input value
    const searchInput = screen.getByPlaceholderText('Enter Product Name') as HTMLInputElement;
    expect(searchInput).toBeInTheDocument();
    expect(searchInput.value).toBe('shoes');

    // Assert Category select displays current option label
    expect(screen.getByText('Apparels')).toBeInTheDocument();

    // Assert Order By select displays current option label
    expect(screen.getByText('Price: Low to High')).toBeInTheDocument();
  });

  it('calls onSearchChange when search is triggered (Enter pressed or button clicked)', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar
        currentSearch=""
        currentCategory={Category.Empty}
        currentOrderBy={OrderBy.DateDsc}
        onSearchChange={mockOnSearchChange}
        onCategoryChange={mockOnCategoryChange}
        onOrderByChange={mockOnOrderByChange}
      />
    );

    const searchInput = screen.getByPlaceholderText('Enter Product Name');
    await user.type(searchInput, 'jacket');
    // Ant Design Input.Search triggers onSearch on Enter key
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter', charCode: 13 });

    await waitFor(() => {
      expect(mockOnSearchChange).toHaveBeenCalled();
      expect(mockOnSearchChange.mock.calls[0][0]).toBe('jacket');
    });
  });

  it('calls onCategoryChange when a category is selected', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar
        currentSearch=""
        currentCategory={Category.Empty}
        currentOrderBy={OrderBy.DateDsc}
        onSearchChange={mockOnSearchChange}
        onCategoryChange={mockOnCategoryChange}
        onOrderByChange={mockOnOrderByChange}
      />
    );

    // Open Category dropdown
    const categorySelect = screen.getByText('All Products');
    await user.click(categorySelect);

    // Look for options in the portal dropdown list
    const option = await screen.findByText('Accessories');
    await user.click(option);

    await waitFor(() => {
      expect(mockOnCategoryChange).toHaveBeenCalled();
      expect(mockOnCategoryChange.mock.calls[0][0]).toBe(Category.Accessory);
    });
  });

  it('calls onOrderByChange when order by is changed', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar
        currentSearch=""
        currentCategory={Category.Empty}
        currentOrderBy={OrderBy.DateDsc}
        onSearchChange={mockOnSearchChange}
        onCategoryChange={mockOnCategoryChange}
        onOrderByChange={mockOnOrderByChange}
      />
    );

    // Open Order By dropdown
    const orderSelect = screen.getByText('Newest Arrivals');
    await user.click(orderSelect);

    const option = await screen.findByText('Price: High to Low');
    await user.click(option);

    await waitFor(() => {
      expect(mockOnOrderByChange).toHaveBeenCalled();
      expect(mockOnOrderByChange.mock.calls[0][0]).toBe(OrderBy.PriceDesc);
    });
  });

  it('hides category select if categorySelect is false', () => {
    render(
      <SearchBar
        currentSearch=""
        currentCategory={Category.Empty}
        currentOrderBy={OrderBy.DateDsc}
        onSearchChange={mockOnSearchChange}
        onCategoryChange={mockOnCategoryChange}
        onOrderByChange={mockOnOrderByChange}
        categorySelect={false}
      />
    );

    expect(screen.queryByText('All Products')).not.toBeInTheDocument();
  });

  it('hides order select if orderSelect is false', () => {
    render(
      <SearchBar
        currentSearch=""
        currentCategory={Category.Empty}
        currentOrderBy={OrderBy.DateDsc}
        onSearchChange={mockOnSearchChange}
        onCategoryChange={mockOnCategoryChange}
        onOrderByChange={mockOnOrderByChange}
        orderSelect={false}
      />
    );

    expect(screen.queryByText('Newest Arrivals')).not.toBeInTheDocument();
  });
});
