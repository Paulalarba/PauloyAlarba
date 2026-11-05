# Deploy the portfolio assistant Worker

Existing Worker: `https://paul-portfolio-assistant.paulnicoralarba13.workers.dev`

## 1. Replace Hello World

Open `chatbot/worker.js` in your editor, select all, and copy it. In Cloudflare, open `paul-portfolio-assistant` > Edit code and select the entry file `worker.js`. Select its entire contents, replace them with the contents of the local `chatbot/worker.js`, and Deploy. Keep the existing `AI` Workers AI binding.

Deploy the generated **worker.js**, not `worker-runtime.mjs`. The generated `worker.js` and `worker.mjs` are identical self-contained bundles; the `.mjs` version is retained for local tests and the CLI configuration. Both include the knowledge and assistant instructions and have no imports or package dependencies. Do not upload the chatbot directory as a Pages website.

Merely adding `worker.mjs` alongside Hello World does not change which handler runs. In the inspected Quick Edit project, importing `./worker.mjs` from `worker.js` failed with `No such module`. Pasting the complete generated bundle directly into `worker.js` deployed successfully. Dashboard `wrangler.jsonc` is just an uploaded file; it does not automatically change the deployed entry point or provision bindings.

Verified on 2026-11-05: the corrected backend was deployed and the production `/health` endpoint returned `setup_required` with only `TURNSTILE_SECRET_KEY secret` missing. AI inference has not yet been exercised. The portfolio chat widget is not implemented yet.

Visit `/health` on the Worker URL. Before the remaining setup, expect:

```json
{
  "ok": true,
  "status": "setup_required",
  "missing": ["TURNSTILE_SECRET_KEY secret"]
}
```

The actual response contains additional diagnostic fields. A health response checks configuration, not model inference or answer quality. Merely opening `/chat` in the address bar does not send a chat request.

## 2. Add bot protection

In the Cloudflare dashboard, open Turnstile and add a widget named `Paul Portfolio Chat`. Choose Managed mode. Register these hostnames (without https:// or paths):

- `paulalarba.xyz`
- `www.paulalarba.xyz`
- `paul-portfolio-assistant.paulnicoralarba13.workers.dev` if testing from a page hosted on the Worker
- `localhost` and `127.0.0.1` only if explicitly testing locally

Turnstile supplies a public site key and a secret key. The future React chat widget uses the public site key. In the Worker, go to Settings > Variables and Secrets > Add, select Secret, name it `TURNSTILE_SECRET_KEY`, paste the secret value, and save/deploy the configuration. Do not place the secret in React, a `VITE_` variable, source files, chat, or screenshots.

The React widget must specify the Turnstile action `portfolio-chat`. Each `/chat` request needs a fresh token; reset the widget after sending, even on errors. The Worker verifies success, action, and the calling site's exact hostname. Keep production secrets separate from test keys.

Once the AI binding and secret exist, `/health` returns `status: configured`. This still does not prove the Turnstile secret is valid or AI inference works; a real end-to-end request is needed.

## 3. Understand the request format

The frontend sends `POST /chat` with `Content-Type: application/json`:

```json
{
  "message": "What is EduCredit?",
  "history": [],
  "turnstileToken": "FRESH_TOKEN_FROM_THE_TURNSTILE_WIDGET"
}
```

Only exact allowed browser origins are accepted. Origin checks are not authentication; bot verification remains mandatory. Localhost is disabled by default: set `ALLOW_LOCALHOST` to the text value `true` on a development Worker to enable ports 5173 on localhost and 127.0.0.1. Do not enable arbitrary Vercel preview origins automatically.

History can contain up to three complete user/assistant pairs (six messages), alternating user then assistant, with no system/developer messages. Each history entry has only `role` and `content`. Client-controlled history is untrusted context, not verified evidence about Paul. Current messages are capped at 1,000 characters, history at 6,000 total characters, and the whole request body at 16 KiB. The model output budget is 250 tokens.

Success returns `answer` and `contactUrl`. Errors return `error`, `message`, and usually `contactUrl`. A 429 includes `Retry-After: 60`. A provider error, quota exhaustion, or timeout produces a generic 503 contact fallback; the frontend should reset the bot check and offer retry/contact options. A timeout does not cancel provider computation and may still consume the free allowance. There are no automatic inference retries.

## 4. Rate limits and optional CLI setup

The dashboard-only file includes a bounded, best-effort limit of six requests per minute per hashed IP **within each Worker isolate**. It resets when the isolate restarts and is not a global limit. IP limits may affect visitors sharing a school, office, or mobile network. Turnstile reduces automation; neither measure guarantees the daily free allowance will last all day.

For the stronger native Cloudflare rate limiting binding, deploy with the supplied Wrangler configuration. It preserves the existing AI binding and declares `CHAT_RATE_LIMITER` at six requests per 60 seconds. Its counters are approximate and local to each Cloudflare location, not an exact global daily budget. Namespace `1001` must be unused by unrelated rate limits in your account; choose a different positive integer if needed.

Run from the portfolio project root when ready:

```powershell
node chatbot/build-worker.mjs
node --test chatbot/worker.test.mjs
npx wrangler login
npx wrangler deploy --config chatbot/wrangler.jsonc
```

Wrangler is not installed as a project dependency; `npx` downloads it if needed. Choose the existing Cloudflare account and verify the existing Worker name before deploying. The configuration intentionally enables workers.dev to preserve the existing endpoint. The secret is managed separately in the dashboard or through `wrangler secret put`, never in the configuration file. No CLI login or remote deployment has been performed by this task.

## 5. Connect the portfolio after backend setup

The existing Vercel portfolio has not been modified. The next implementation adds a React chat widget, the public Turnstile site key, and this public API URL:

```env
VITE_CHAT_API_URL=https://paul-portfolio-assistant.paulnicoralarba13.workers.dev/chat
VITE_TURNSTILE_SITE_KEY=YOUR_PUBLIC_SITE_KEY
```

Only the API URL and public site key belong in the React environment. Render replies as text or sanitized Markdown, never raw HTML. Label the assistant, show a short notice that messages are processed by Cloudflare AI, keep chat history in the current browser session initially, and retain Contact/FAQ access on failure. The Worker itself does not store transcripts or log prompts, tokens, IPs, or replies; Cloudflare platform request logging and provider processing are separate.

Before launch, test real questions about EduCredit, KamayAral, pricing, availability, unknown contributions, and prototype status. Local automated tests use mocked AI and bot verification only. They do not prove that the live model is available to your account, that it follows all grounding instructions, or that a deployed secret is valid.

## References

- [Workers AI model and message API](https://developers.cloudflare.com/workers-ai/models/llama-3.1-8b-instruct-fp8/)
- [Turnstile server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Workers rate limiting binding and accuracy](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)

After editing the knowledge JSON, prompt, or runtime source, run `node chatbot/build-worker.mjs` and redeploy the generated file. Do not edit the generated file alone: regeneration replaces it.
