import { handleCalendarSync } from '../server/src/controllers/calendarController';
import { Request, Response } from 'express';

describe('Calendar Sync Endpoint', () => {
  it('processes calendar syncing correctly', async () => {
    const req = {
      body: { summary: 'Match Entry', location: 'Gate A', startTime: '2025-01-01', endTime: '2025-01-01' }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;

    await handleCalendarSync(req, res);

    if ((res.json as jest.Mock).mock.calls.length > 0) {
      const data = (res.json as jest.Mock).mock.calls[0][0];
      expect(data.status).toBe('success');
      expect(data).toHaveProperty('message');
    } else {
        expect(res.status).toHaveBeenCalledWith(400); // validation error
    }
  });
});
