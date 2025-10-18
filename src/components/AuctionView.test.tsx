import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuctionView } from './AuctionView';

const mockAuction = {
  id: 'test-auction',
  totalRent: 1000,
  rooms: {
  'r1': { id: 'r1', name: 'Room 1', price: 500, assignedUserId: null, status: 'available' as const },
  'r2': { id: 'r2', name: 'Room 2', price: 500, assignedUserId: null, status: 'available' as const }
  },
  users: {
    'u1': { id: 'u1', name: 'Alice', assignedRoomId: null },
    'u2': { id: 'u2', name: 'Bob', assignedRoomId: null }
  }
};

describe('AuctionView', () => {
  it('renders auction title and rooms', () => {
    render(<AuctionView auction={mockAuction} currentUserId='u1' />);
    expect(screen.getByText(/Auction: test-auction/i)).toBeInTheDocument();
    expect(screen.getByText(/Room 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Room 2/i)).toBeInTheDocument();
  });

  it('shows waiting phase when not full', () => {
    render(<AuctionView auction={mockAuction} currentUserId='u1' />);
    expect(screen.getByText(/Waiting for participants/i)).toBeInTheDocument();
    expect(screen.getByText(/Who's here:/i)).toBeInTheDocument();
  });

  it('shows select phase when full', () => {
    const auction = {
      ...mockAuction,
      users: {
        ...mockAuction.users,
        'u3': { id: 'u3', name: 'Charlie', assignedRoomId: null }
      },
      totalRent: 1500,
      rooms: {
        'r1': { id: 'r1', name: 'Room 1', price: 500, assignedUserId: null, status: 'available' as const },
        'r2': { id: 'r2', name: 'Room 2', price: 500, assignedUserId: null, status: 'available' as const }
      }
    };
    render(<AuctionView auction={auction} currentUserId='u1' />);
    expect(screen.getByText(/Select your preferred room/i)).toBeInTheDocument();
  });

  it('shows done phase when all assigned', () => {
    const auction = {
      ...mockAuction,
      users: {
        'u1': { id: 'u1', name: 'Alice', assignedRoomId: 'r1' },
        'u2': { id: 'u2', name: 'Bob', assignedRoomId: 'r2' }
      },
      totalRent: 1000,
      rooms: {
        'r1': { id: 'r1', name: 'Room 1', price: 500, assignedUserId: 'u1', status: 'assigned' as const },
        'r2': { id: 'r2', name: 'Room 2', price: 500, assignedUserId: 'u2', status: 'assigned' as const }
      }
    };
    render(<AuctionView auction={auction} currentUserId='u1' />);
    expect(screen.getByText(/Auction Complete/i)).toBeInTheDocument();
    expect(screen.getByText(/Alice: Room 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Bob: Room 2/i)).toBeInTheDocument();
  });

  it('shows bidding phase when room status is bidding', () => {
    const auction = {
      ...mockAuction,
      rooms: {
  'r1': { id: 'r1', name: 'Room 1', price: 500, assignedUserId: null, status: 'bidding' as const, conflictingUserIds: { 'u1': true as const } },
        'r2': { id: 'r2', name: 'Room 2', price: 500, assignedUserId: null, status: 'available' as const }
      },
      users: {
        'u1': { id: 'u1', name: 'Alice', assignedRoomId: null },
        'u2': { id: 'u2', name: 'Bob', assignedRoomId: null }
      },
      totalRent: 1000
    };
    render(<AuctionView auction={auction} currentUserId='u1' />);
    expect(screen.getByText(/Bidding phase/i)).toBeInTheDocument();
    expect(screen.getByText(/Room: Room 1/i)).toBeInTheDocument();
  });

  it('copy url button works', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn() }
    });
    render(<AuctionView auction={mockAuction} currentUserId='u1' />);
    const copyBtn = screen.getByText(/Copy/i);
    fireEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
