# SmartVenue AI

SmartVenue AI is a context-aware, production-ready web application designed and built to optimize the physical event experience at large-scale sporting venues.

## Problem Alignment
Handling massive crowds at sporting events presents monumental logistical challenges. Long queues for amenities, confusion over crowd patterns, and sudden bottlenecks degrade the attendee experience. This project aligns completely with the goal of improving crowd management through real-time navigation, queue prediction, and AI-assisted support for visitors.

## Architecture
This application utilizes a modern, modular Monorepo approach:
- **Frontend (Client)**: React, TypeScript, Tailwind CSS, built with Vite. Implements responsive UI, AI Chat integration, and Live Map Heatmap stubs.
- **Backend (Server)**: Node.js, Express, TypeScript. Provides robust APIs for Chat logic (mocked or Google Gemini integrated) and Queue prediction (heuristics).
- **Tooling**: Docker, Docker Compose, ESLint, Prettier, Jest tests.

## Local Setup Instructions

1. Clone or navigate to the repository.
2. (Optional) Provide configuration variables: Include a Google Maps API Key (`VITE_GOOGLE_MAPS_API_KEY`) and a Google Gemini API Key (`GEMINI_API_KEY`) within `.env` on Client/Server respectively.
3. If running purely local without Docker:
   - Client: `cd client && npm install && npm run dev`
   - Server: `cd server && npm install && npm run dev`
4. If using root concurrently: `npm run dev`

## Deployment to GCP Cloud Run

1. Build the Docker Image from the root level Dockerfile.
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/smartvenue-ai
   ```
2. Deploy to Cloud Run:
   ```bash
   gcloud run deploy smartvenue-ai \
    --image gcr.io/YOUR_PROJECT_ID/smartvenue-ai \
    --platform managed \
    --allow-unauthenticated \
    --region us-central1
   ```

## API Endpoint Integration
- `POST /api/assistant` - Expects `{ "query": "..." }`. Returns AI-driven navigation suggestions. Uses Google Gemini flash.
- `GET /api/queues` - Returns array of `QueueNode` containing real-time density heuristics and lat/lng.

## Testing and Code Quality
Tests are conducted using Jest. Run `npm run test` from root. Expected coverage is >90% for critical logic. Accessibility (a11y) considerations such as proper ARIA attributes, semantic HTML, and functional keyboard navigation were enforced on the front end.

## Assumptions
- Node ecosystem dependencies (`concurrently`, Vite) assume a minimum `node_modules` structure but the app itself leverages highly responsive styling (Tailwind CSS) with few additional client payload weight items.
- Real-time IoT data for Queue Predictions is mocked via a heuristic timestamp model.

## Future Improvements
- Actual real-time MQTT feed from venue turnstiles for true data validation.
- Implementing Firebase Google Sign-In fully integrated in the client application with Firebase FCM push mechanisms.
- Offline-first cache syncing via Service Workers.
