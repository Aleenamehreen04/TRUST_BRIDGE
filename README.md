# TrustBridge

**Don't trust the message. Verify the request.**
A decision-support tool that helps people respond safely to suspicious requests.

## Problem
AI-generated voices, messages and impersonation make it harder to know whether a request really came from the person it claims to be from. Scams often combine urgency, money or credentials, an unusual channel, and pressure not to double-check.

## Solution
TrustBridge does not try to prove who is real. It analyzes the **context** of a request, explains the warning signs, gives a safe independent verification plan, and lets the user practice choosing the safest response.

> You don't need to know whether the person is real. You need to know how to safely verify the request.

## Core flow
Suspicious Request → Risk Analysis → Verification Plan → Decision Challenge → Feedback

## Architecture
React (client) → Express (server) → Google Gemini → JSON → server validation → React

- The browser never talks to Gemini directly.
- The server validates the AI's JSON before sending it on.
- The decision challenge is fixed and graded locally, not by the AI.

## Tech stack
React + Vite (JavaScript, CSS) · Node.js + Express · Google Gemini API (OpenAI-compatible endpoint)

## Setup
1. `npm run setup` installs server and client dependencies.
2. Copy `.env.example` to `.env` and fill in your values.
3. `npm run dev` starts the server (port 3001) and the client (port 5173).
4. Open http://localhost:5173

`npm test` runs the validation tests (no API key needed).

## Environment variables
| Variable | Purpose |
|---|---|
| `LLM_API_KEY` | Gemini API key from Google AI Studio |
| `LLM_BASE_URL` | `https://generativelanguage.googleapis.com/v1beta/openai` |
| `LLM_MODEL` | e.g. `gemini-flash-lite-latest` |
| `PORT` | Server port (default 3001) |

## Security
- The API key lives only on the server in `.env` (git-ignored); it is never sent to the browser.
- Input is length-limited and checked; requests are rate-limited.
- The pasted message is treated as untrusted data in the AI prompt.
- AI output is schema-validated; malformed output is retried once, then a safe error is shown.
- Errors shown to users are generic, and user messages are not logged.

## Limitations
- Not a deepfake detector, identity checker or fraud guarantee.
- AI analysis can be imperfect; always verify important requests through a channel you already trust.
- The decision challenge uses one fixed scenario.
- Free-tier AI limits may cause occasional "try again" errors.

## Future ideas (not built)
Browser extension, email integration, organization-specific verification workflows.