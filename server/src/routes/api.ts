import { Router } from 'express';
import { handleAssistantQuery } from '../controllers/assistantController';
import { getQueuePredictions } from '../controllers/queueController';
import { handleCalendarSync } from '../controllers/calendarController';
import { getOptimizedRoute } from '../controllers/routeController';
import { authenticateRequest } from '../middlewares/authMiddleware';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';

const router = Router();

// Standard Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(apiLimiter);

// We might want to authenticate all API routes
// router.use(authenticateRequest);

// Chat Assistant Route
router.post('/assistant', [
  body('query').isString().trim().escape().notEmpty()
], handleAssistantQuery);

// Queue Predictions Route
router.get('/queues', getQueuePredictions);

// Google Calendar Sync Route
router.post('/calendar', [
  body('summary').isString().trim().escape(),
  body('location').isString().trim().escape(),
  body('startTime').isString(),
  body('endTime').isString(),
], handleCalendarSync);

// Route Optimization & Crowd Avoidance Route
router.get('/routes', [
  body('origin').optional().isString().trim().escape(),
  body('destination').optional().isString().trim().escape()
], getOptimizedRoute);

export default router;
