import { Request, Response } from 'express';
// We'll use mock responses if API keys are missing to ensure testing works without secrets
import { GoogleGenerativeAI } from '@google/generative-ai';
import { validationResult } from 'express-validator';

const API_KEY = process.env.GEMINI_API_KEY || 'mock_key';
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Handles Artificial Intelligence contextual queries using Google Generative AI (Gemini).
 * Evaluates context around queues and maps to supply physical navigation.
 * 
 * @param {Request} req Express Request
 * @param {Response} res Express Response
 * @returns {Promise<void>} JSON structure encapsulating the text reply
 */
export const handleAssistantQuery = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: 'Query is missing or invalid', details: errors.array() });
      return;
    }

    const { query, context } = req.body;

    // In a pure environment without an API key, fallback to mock responses
    if (API_KEY === 'mock_key') {
      const mockResponse = getMockResponse(query);
      res.json({ reply: mockResponse });
      return;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
      You are a SmartVenue AI assistant for a large-scale sporting venue.
      Context: ${JSON.stringify(context || {})}
      User Query: ${query}
      
      Provide a concise, helpful response directing the user to shortest routes, 
      optimal times, or relevant facilities.
      Return clean text, no markdown styling if possible.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error('Assistant Error:', error);
    res.status(500).json({ error: 'Failed to process assistant query' });
  }
};

function getMockResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('washroom') || q.includes('toilet') || q.includes('restroom')) {
    return 'The nearest washroom is at Gate 4, approximately 2 minutes away. It currently has a low wait time.';
  }
  if (q.includes('food') || q.includes('eat') || q.includes('hungry')) {
    return 'Food stalls are located at Sector B. The "Burger Sprint" stall has the shortest queue right now (approx 5 mins).';
  }
  if (q.includes('entry') || q.includes('gate')) {
    return 'Entry Gate 2 is the least crowded at the moment. I recommend heading there for quicker access.';
  }
  return 'How can I assist you with your venue experience today? I can help with navigation, food, and queues.';
}
