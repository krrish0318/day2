import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://maps.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://maps.gstatic.com", "https://maps.googleapis.com"],
      connectSrc: ["'self'", "https://maps.googleapis.com"],
      frameSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(cors());
app.use(express.json());

// Main API Router
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'SmartVenue AI Server is running.' });
});

// Serve frontend static files
const clientPath = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, '../public') 
  : path.join(__dirname, '../../client/dist');

app.use(express.static(clientPath));

// Catch-all route for React Router
app.get('*', (req: Request, res: Response, next: NextFunction) => {
  // Ignore API calls that fell through
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(clientPath, 'index.html'));
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, (): void => {
  console.log(`Server listening on port ${PORT}`);
});
