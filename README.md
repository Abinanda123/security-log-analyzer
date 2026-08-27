# Security Log Analyzer

A full-stack security dashboard that parses web access logs, detects common attack patterns, and presents actionable findings through an interactive interface.

## Capabilities

- Parse Apache and Nginx access logs
- Detect SQL injection attempts
- Identify brute-force login activity
- Flag 404-flood behavior
- Display severity, attack patterns, and top attacking IPs
- Generate AI-assisted explanations and remediation guidance
- Visualize findings with interactive charts
- Run automated backend detection tests

## Architecture

```
frontend/  React dashboard, Tailwind CSS, Recharts, API client
backend/   TypeScript, Express API, log analysis, AI remediation
```

## Tech stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, Recharts, Axios  
**Backend:** Node.js, Express, TypeScript, Multer, Supabase, Groq  
**Testing:** Vitest

## Getting started

Requirements: Node.js 18 or later.

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Configure the required Supabase, Groq, and API URL environment variables locally. Never commit secrets; use an ignored `.env` file and document required keys in `.env.example`.

## Scripts

Backend:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the TypeScript development server |
| `npm run build` | Compile the backend |
| `npm test` | Run backend tests |
| `npm start` | Start the compiled server |

Frontend:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run lint` | Check code quality |

## Security note

This project is for analysis and demonstration. Validate log sources, protect uploaded files, restrict CORS in production, and keep AI/API credentials server-side.

## License

ISC
