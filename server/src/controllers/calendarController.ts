import { Request, Response } from 'express';
import { syncEventToCalendar } from '../services/calendarService';
import { validationResult } from 'express-validator';

/**
 * Triggers Google Calendar synchronization for upcoming match fixtures or ticketing entries.
 * Evaluates sanitization inputs through express-validator middleware.
 * 
 * @param {Request} req Express incoming request mapped with body items
 * @param {Response} res Express output object
 * @returns {Promise<void>} Synchronization status
 */
export const handleCalendarSync = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { summary, location, startTime, endTime } = req.body;
    const response = await syncEventToCalendar({ summary, location, startTime, endTime });
    res.json(response);
  } catch (error) {
    console.error('Controller Error:', error);
    res.status(500).json({ error: 'Calendar Integration Failed' });
  }
};
