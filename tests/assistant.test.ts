import { handleAssistantQuery } from '../server/src/controllers/assistantController';
import { Request, Response } from 'express';

describe('Assistant Logic tests', () => {
  it('returns an error if no query is provided', async () => {
    const req = { body: {} } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    await handleAssistantQuery(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Query is required' });
  });

  it('provides a mock response when API key is missing (for Washrooms)', async () => {
    const req = { body: { query: 'Where is the washroom?' } } as Request;
    const res = {
      json: jest.fn()
    } as unknown as Response;

    await handleAssistantQuery(req, res);

    expect(res.json).toHaveBeenCalled();
    const callArgs = (res.json as jest.Mock).mock.calls[0][0];
    expect(callArgs.reply).toContain('washroom');
  });
});
