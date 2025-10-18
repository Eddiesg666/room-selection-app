import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

vi.mock('./components/AuctionCreator', () => ({ AuctionCreator: ({ onCreate }: any) => <button onClick={() => onCreate({ totalRent: 1000, rooms: ['A', 'B'] })}>Mock Create Auction</button> }));
vi.mock('./components/AuctionView', () => ({ AuctionView: ({ auction, currentUserId }: any) => <div>Mock AuctionView {auction?.id} {currentUserId}</div> }));
vi.mock('./utilities/auction-client', () => ({
  saveAuction: vi.fn(async () => 'auction123'),
  subscribeToAuction: vi.fn((id, cb) => { cb({ id, totalRent: 1000, rooms: {}, users: {} }); return () => {}; }),
  addUserToAuction: vi.fn(async () => 'user123')
}));

describe('App', () => {
  it('renders HomePage and allows auction creation', async () => {
    render(<MemoryRouter initialEntries={["/"]}><App /></MemoryRouter>);
    expect(screen.getByText(/Homeslice/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Mock Create Auction/i));
    // After creation, should navigate to AuctionRoomPage
    expect(await screen.findByText(/Mock AuctionView auction123 user123/i)).toBeInTheDocument();
  });

  it('renders AuctionRoomPage join UI if not joined', async () => {
    render(<MemoryRouter initialEntries={["/auction/auction456"]}><App /></MemoryRouter>);
    expect(screen.getByText(/Join Auction/i)).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText(/Your Name/i), { target: { value: 'TestUser' } });
    fireEvent.click(screen.getByText(/Join/i));
    expect(await screen.findByText(/Mock AuctionView auction456 user123/i)).toBeInTheDocument();
  });

  it('shows Auction Full if max participants', async () => {
    vi.mock('./utilities/auction-client', () => ({
      saveAuction: vi.fn(async () => 'auction123'),
      subscribeToAuction: vi.fn((id, cb) => {
        cb({ id, totalRent: 1000, rooms: { r1: { id: 'r1', name: 'Room 1', price: 500, assignedUserId: null, status: 'available' as const }, r2: { id: 'r2', name: 'Room 2', price: 500, assignedUserId: null, status: 'available' as const } }, users: { u1: { id: 'u1', name: 'Alice', assignedRoomId: null }, u2: { id: 'u2', name: 'Bob', assignedRoomId: null } } });
        return () => {};
      }),
      addUserToAuction: vi.fn(async () => 'user123')
    }));
    render(<MemoryRouter initialEntries={["/auction/auction789"]}><App /></MemoryRouter>);
    expect(await screen.findByText(/Auction Full/i)).toBeInTheDocument();
  });
});
