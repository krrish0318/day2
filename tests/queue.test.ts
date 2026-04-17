import { getQueuePredictions } from '../server/src/controllers/queueController';
import { Request, Response } from 'express';

describe('Queue Prediction tests', () => {
  it('returns an array of queues with predictions', async () => {
    const req = {} as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;

    await getQueuePredictions(req, res);

    expect(res.json).toHaveBeenCalled();
    const data = (res.json as jest.Mock).mock.calls[0][0];
    expect(data.queues).toBeDefined();
    expect(Array.isArray(data.queues)).toBe(true);
    expect(data.queues.length).toBeGreaterThan(0);
    
    const firstQueue = data.queues[0];
    expect(firstQueue).toHaveProperty('id');
    expect(firstQueue).toHaveProperty('estimatedWaitTime');
    expect(firstQueue).toHaveProperty('density');
  });
});
