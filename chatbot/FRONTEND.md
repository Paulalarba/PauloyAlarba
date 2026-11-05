# Portfolio chat integration

The shared app mounts `src/components/ChatAssistant.jsx` on every route. The widget loads Turnstile only when opened, uses action `portfolio-chat`, and sends a fresh token with each POST. No API secret belongs in Vite or Vercel browser configuration. Conversation messages remain in React memory (up to 20 turns), clear on reload, and are sent to Cloudflare when requesting an answer. Only the latest three complete turns within backend limits are sent as context.

## Publish on Vercel

1. Add optional public overrides in Vercel → project → Settings → Environment Variables:
   - `VITE_CHAT_API_URL=https://paul-portfolio-assistant.paulnicoralarba13.workers.dev/chat`
   - `VITE_TURNSTILE_SITE_KEY=0x4AAAAAAF0rCDo7vRn_3OAv`
   These values already have defaults in the app, so no environment change is required for this portfolio.
2. Deploy the updated source using the existing Git/Vercel workflow. No domain or routing changes are required.
3. Confirm Turnstile allows `paulalarba.xyz` and `www.paulalarba.xyz`. The backend must allow these exact origins and validate the same hostnames and action.
4. On the deployed portfolio open **Ask about Paul**, wait for verification, then send “What is EduCredit?”. Check the answer and send another question to verify token renewal.
5. Check mobile layout, Escape/close, Clear chat, Contact/Projects/Résumé links, and unavailable/rate-limited replies.

## Backend response headers

To read a rate-limit response's Retry-After header cross-origin, the Worker needs `Access-Control-Expose-Headers: Retry-After` as well as the allowed-origin header. The UI falls back to 60 seconds when this header is absent or unreadable.

## Local testing

`npm run build` and `node --test tests/*.test.mjs` validate the build and helper behavior. A successful local UI build does not prove live AI inference. Production Turnstile/CORS settings generally reject localhost and Vercel preview domains unless separately configured. Do not weaken production bot checks to test locally.

Requests are not retried automatically, since retries can consume allowance. On failure the draft stays available to retry after fresh verification. Closing the panel aborts a pending browser request, but does not guarantee server inference was cancelled.
