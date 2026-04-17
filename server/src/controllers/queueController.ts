import { Request, Response } from 'express';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 5 }); // 5 seconds cache

interface QueueNode {
  id: string;
  name: string;
  type: 'food' | 'washroom' | 'entry' | 'merch';
  estimatedWaitTime: number; // in minutes
  density: 'Low' | 'Medium' | 'High';
  coordinates: { lat: number, lng: number };
}

/**
 * Derives and predicts real-time queue times using latency-based heuristics and timestamps.
 * Utilizes generic node-caching mechanism to stabilize overhead load on database structures.
 * 
 * @param {Request} req Initial request
 * @param {Response} res Endpoint response
 * @returns {Promise<void>} List of parsed queues
 */
export const getQueuePredictions = async (req: Request, res: Response): Promise<void> => {
  try {
    const cachedData = cache.get('queues');
    if (cachedData) {
      res.json({ queues: cachedData });
      return;
    }
    // In a real application, this might come from IoT sensors, 
    // camera density models, or a database evaluating historical/live data.
    // For this demonstration, we use heuristic-based mocked predictions.
    
    const baseLat = 37.7749;
    const baseLng = -122.4194;

    const queues: QueueNode[] = [
      { id: 'q1', name: 'Main Entry Gate 1', type: 'entry', estimatedWaitTime: 15, density: 'High', coordinates: { lat: baseLat + 0.001, lng: baseLng + 0.001 } },
      { id: 'q2', name: 'Side Entry Gate 2', type: 'entry', estimatedWaitTime: 3, density: 'Low', coordinates: { lat: baseLat - 0.001, lng: baseLng - 0.001 } },
      { id: 'q3', name: 'Hot Dog Stand B', type: 'food', estimatedWaitTime: 8, density: 'Medium', coordinates: { lat: baseLat + 0.002, lng: baseLng - 0.002 } },
      { id: 'q4', name: 'Washroom Sector A', type: 'washroom', estimatedWaitTime: 2, density: 'Low', coordinates: { lat: baseLat - 0.002, lng: baseLng + 0.002 } },
    ];

    // Optionally apply some time-based heuristic mutation (e.g., higher queues in the evening)
    const hour = new Date().getHours();
    if (hour > 18 && hour < 21) {
      queues.forEach(q => {
        if (q.type === 'food') {
          q.estimatedWaitTime += 5;
          q.density = 'High';
        }
      });
    }

    cache.set('queues', queues);
    res.json({ queues });
  } catch (error) {
    console.error('Queue Prediction Error:', error);
    res.status(500).json({ error: 'Failed to fetch queue predictions' });
  }
};
