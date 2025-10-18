import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { AuctionCreator } from './AuctionCreator';

describe('AuctionCreator', () => {
  it('renders input fields and button', () => {
    const onCreate = vi.fn();
    render(<AuctionCreator onCreate={onCreate} />);
    expect(screen.getByLabelText(/Total Rent/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of Rooms/i)).toBeInTheDocument();
    expect(screen.getByText(/Create Auction/i)).toBeInTheDocument();
  });

  it('shows error if room names are missing', () => {
    const onCreate = vi.fn();
    render(<AuctionCreator onCreate={onCreate} />);
    fireEvent.change(screen.getByLabelText(/Number of Rooms/i), { target: { value: '3' } });
    fireEvent.change(screen.getAllByRole('textbox')[2], { target: { value: '' } });
    fireEvent.click(screen.getByText(/Create Auction/i));
    expect(screen.getByText(/Please enter names for all rooms/i)).toBeInTheDocument();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it('shows error if total rent is invalid', () => {
    const onCreate = vi.fn();
    render(<AuctionCreator onCreate={onCreate} />);
    fireEvent.change(screen.getByLabelText(/Total Rent/i), { target: { value: '0' } });
    fireEvent.click(screen.getByText(/Create Auction/i));
    expect(screen.getByText(/Please enter a valid total rent/i)).toBeInTheDocument();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it('calls onCreate with correct data', () => {
    const onCreate = vi.fn();
    render(<AuctionCreator onCreate={onCreate} />);
    fireEvent.change(screen.getByLabelText(/Total Rent/i), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText(/Number of Rooms/i), { target: { value: '2' } });
    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'A' } });
    fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: 'B' } });
    fireEvent.click(screen.getByText(/Create Auction/i));
    expect(onCreate).toHaveBeenCalledWith({ totalRent: 1000, rooms: ['A', 'B'] });
  });
});
