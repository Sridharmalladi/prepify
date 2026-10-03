<div align="center">

# Prepify

**Practice an interview with a voice-enabled AI interviewer.**

</div>

Give Prepify a role, company, résumé, and job description. Its avatar asks questions, follows up on your answers, and returns feedback when the interview ends. Past sessions help you track your progress.

## Run locally

Requires Node.js and configured Supabase, LiveKit, and Tavus credentials. Copy the example environment file and fill in the values from your service accounts.

```bash
npm install
cp .env.example .env
npm run dev
```

Vite prints the local URL. Keep the values in `.env` private; do not commit API keys or secrets.
