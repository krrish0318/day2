import { Router } from 'express';
import { handleAssistantQuery } from '../controllers/assistantController';
import { getQueuePredictions } from '../controllers/queueController';
import { authenticateRequest } from '../middlewares/authMiddleware';

const router = Router();

// We might want to authenticate all API routes
// router.use(authenticateRequest);

// Chat Assistant Route
router.post('/assistant', handleAssistantQuery);

// Queue Predictions Route
router.get('/queues', getQueuePredictions);

export default router;
