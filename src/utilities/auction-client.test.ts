import { describe, it, expect, vi } from 'vitest';
import * as auctionClient from './auction-client';

vi.mock('./firebaseConfig', () => ({ db: {} }));

// Mock Firebase methods
const setMock = vi.fn();
const pushMock = vi.fn(() => ({ key: 'mockKey' }));
const refMock = vi.fn();
const onValueMock = vi.fn();
const offMock = vi.fn();

vi.mock('firebase/database', () => ({
  ref: refMock,
  push: pushMock,
  set: setMock,
  onValue: onValueMock,
  off: offMock,
}));

describe('auction-client', () => {
  it('saveAuction creates auction and returns id', async () => {
    setMock.mockResolvedValueOnce(undefined);
    const id = await auctionClient.saveAuction({ totalRent: 1000, rooms: ['A', 'B'] });
    expect(id).toBe('mockKey');
    expect(setMock).toHaveBeenCalled();
  });

  it('addUserToAuction adds user and returns id', async () => {
    setMock.mockResolvedValueOnce(undefined);
    const id = await auctionClient.addUserToAuction('auctionId', 'TestUser');
    expect(id).toBe('mockKey');
    expect(setMock).toHaveBeenCalled();
  });

  it('placeBid sets bid value', async () => {
    setMock.mockResolvedValueOnce(undefined);
    await auctionClient.placeBid('auctionId', 'roomId', 'userId', 500);
    expect(setMock).toHaveBeenCalled();
  });

  it('submitSelection sets selection value', async () => {
    setMock.mockResolvedValueOnce(undefined);
    await auctionClient.submitSelection('auctionId', 'userId', 'roomId');
    expect(setMock).toHaveBeenCalled();
  });

  it('subscribeToAuction sets up listener and returns unsubscribe', () => {
    const cb = vi.fn();
  onValueMock.mockImplementation((_, handler) => handler({ exists: () => true, val: () => ({ id: 'auctionId' }) }));
    const unsubscribe = auctionClient.subscribeToAuction('auctionId', cb);
    expect(onValueMock).toHaveBeenCalled();
    unsubscribe();
    expect(offMock).toHaveBeenCalled();
  });
});
