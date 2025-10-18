import { describe, it, expect, vi } from 'vitest';
import { AuctionView } from './AuctionView';
import { render, screen, fireEvent } from '@testing-library/react';

const auction = {
  id: 'auction1',
  totalRent: 1000,
  rooms: {
    r1: { id: 'r1', name: 'Room 1', price: 500, assignedUserId: null, status: 'bidding' as const, conflictingUserIds: { u1: true as const } },
  },
  users: {
    u1: { id: 'u1', name: 'Alice', assignedRoomId: null },
  },
};

describe('AuctionView bid validation', () => {
  it('prevents bidding above totalRent', () => {
    // Mock placeBid so it doesn't actually run
    vi.spyOn(require('../utilities/auction-client'), 'placeBid').mockImplementation(() => Promise.resolve());
    window.alert = vi.fn();
    render(<AuctionView auction={auction} currentUserId='u1' />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '1500' } });
    fireEvent.click(screen.getByText(/Submit Bid/i));
    expect(window.alert).toHaveBeenCalledWith('Your bid cannot exceed the total rent of $1000.00');
  });
});
