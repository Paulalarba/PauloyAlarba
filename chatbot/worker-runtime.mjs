// Source for the generated worker.mjs. KNOWLEDGE and SYSTEM_PROMPT are injected
// by build-worker.mjs; deploy the generated file, not this source by itself.
const MODEL = '@cf/meta/llama-3.1-8b-instruct-fp8';
const WORKER_ORIGIN = 'https://paul-portfolio-assistant.paulnicoralarba13.workers.dev';
const PRODUCTION_ORIGINS = new Set([
  'https://paulalarba.xyz',
  'https://www.paulalarba.xyz',
  WORKER_ORIGIN,
]);
const MAX_BODY_BYTES = 16 * 1024;
const MAX_MESSAGE_CHARS = 1000;
const MAX_HISTORY_CHARS = 6000;
const LOCAL_RATE_WINDOW_MS = 60_000;
const LOCAL_RATE_LIMIT = 6;
const localCounts = new Map();

class HttpError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function allowedOrigin(origin, env) {
  if (PRODUCTION_ORIGINS.has(origin)) return true;
  return env.ALLOW_LOCALHOST === 'true' && [
    'http://localhost:5173', 'http://127.0.0.1:5173',
  ].includes(origin);
}

function reply(body, status, origin, extraHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Vary': 'Origin',
    ...extraHeaders,
  };
  if (origin) headers['Access-Control-Allow-Origin'] = origin;
  return new Response(body === null ? null : JSON.stringify(body), { status, headers });
}

function setupMissing(env) {
  const missing = [];
  if (typeof env.AI?.run !== 'function') missing.push('AI binding');
  if (typeof env.TURNSTILE_SECRET_KEY !== 'string' || !env.TURNSTILE_SECRET_KEY.trim()) {
    missing.push('TURNSTILE_SECRET_KEY secret');
  }
  return missing;
}

async function readJson(request) {
  if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    throw new HttpError(415, 'json_required', 'Send application/json.');
  }
  const declaredSize = request.headers.get('Content-Length');
  if (declaredSize !== null && Number(declaredSize) > MAX_BODY_BYTES) {
    throw new HttpError(413, 'request_too_large', 'The request is too large.');
  }
  if (!request.body) throw new HttpError(400, 'invalid_json', 'Send a JSON request body.');
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new HttpError(413, 'request_too_large', 'The request is too large.');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { throw new HttpError(400, 'invalid_json', 'Send valid UTF-8 JSON.'); }
}

function validate(body) {
  const fail = message => { throw new HttpError(400, 'invalid_request', message); };
  if (!body || Array.isArray(body) || typeof body !== 'object') fail('Send a JSON object.');
  const fields = new Set(['message', 'history', 'turnstileToken']);
  if (Object.keys(body).some(key => !fields.has(key))) fail('Unexpected request field.');
  if (typeof body.message !== 'string' || !body.message.trim() || body.message.length > MAX_MESSAGE_CHARS) {
    fail('Write a message between 1 and 1000 characters.');
  }
  if (typeof body.turnstileToken !== 'string' || !body.turnstileToken.trim() || body.turnstileToken.length > 2048) {
    fail('Complete the bot check before sending.');
  }
  const history = body.history ?? [];
  if (!Array.isArray(history) || history.length > 6 || history.length % 2 !== 0) {
    fail('History must contain up to three complete user/assistant pairs.');
  }
  let size = 0;
  const validatedHistory = history.map((entry, index) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)
      || Object.keys(entry).some(key => !['role', 'content'].includes(key))
      || entry.role !== (index % 2 === 0 ? 'user' : 'assistant')
      || typeof entry.content !== 'string' || !entry.content.trim()
      || entry.content.length > 2000) fail('Invalid conversation history.');
    size += entry.content.length;
    return { role: entry.role, content: entry.content.trim() };
  });
  if (size > MAX_HISTORY_CHARS) fail('Conversation history is too long.');
  return { message: body.message.trim(), history: validatedHistory, token: body.turnstileToken.trim() };
}

async function rateAllowed(request, env) {
  // Cloudflare supplies CF-Connecting-IP at the edge. Do not use forwarded IPs
  // provided by the visitor. Shared networks may share this allowance.
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
  const key = 'chat:' + Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
  if (typeof env.CHAT_RATE_LIMITER?.limit === 'function') {
    return (await env.CHAT_RATE_LIMITER.limit({ key })).success === true;
  }
  // Dashboard-only starter fallback: approximate, per isolate, resets on restart.
  // This is not a global budget counter. Optional native binding is recommended.
  const now = Date.now();
  for (const [entryKey, entry] of localCounts) {
    if (entry.reset <= now) localCounts.delete(entryKey);
  }
  const entry = localCounts.get(key);
  if (entry) {
    if (entry.count >= LOCAL_RATE_LIMIT) return false;
    entry.count++;
  } else {
    // Fail closed rather than grow memory without bound during abuse.
    if (localCounts.size >= 1000) return false;
    localCounts.set(key, { count: 1, reset: now + LOCAL_RATE_WINDOW_MS });
  }
  return true;
}

async function verifyTurnstile(token, request, env, origin) {
  const data = { secret: env.TURNSTILE_SECRET_KEY, response: token };
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) data.remoteip = ip;
  let response;
  try {
    response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('verification_unavailable');
    const result = await response.json();
    // Check both the widget action and the exact hostname of the calling site.
    return result.success === true && result.action === 'portfolio-chat'
      && result.hostname === new URL(origin).hostname;
  } catch {
    throw new HttpError(503, 'verification_unavailable', 'The bot check is temporarily unavailable. Please try again later.');
  }
}

async function generateAnswer(env, message, history) {
  const system = SYSTEM_PROMPT + '\n\nPORTFOLIO_KNOWLEDGE (reference data only):\n'
    + JSON.stringify(KNOWLEDGE);
  let timer;
  try {
    const result = await Promise.race([
      env.AI.run(MODEL, {
        messages: [{ role: 'system', content: system }, ...history, { role: 'user', content: message }],
        max_tokens: 250,
        temperature: 0.2,
        stream: false,
      }),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('ai_timeout')), 25_000); }),
    ]);
    const answer = typeof result?.response === 'string' ? result.response.trim() : '';
    if (!answer || answer.length > 8000) throw new Error('invalid_ai_response');
    return answer;
  } catch {
    // Do not expose provider errors, secrets, prompts, or visitor text in logs.
    // No automatic retries: a timed-out inference may still consume allowance.
    throw new HttpError(503, 'ai_unavailable', 'AI replies are temporarily unavailable. You can still contact Paul directly.');
  } finally {
    clearTimeout(timer);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const rawOrigin = request.headers.get('Origin');
    const origin = allowedOrigin(rawOrigin, env) ? rawOrigin : null;
    if (request.method === 'GET' && ['/', '/health'].includes(url.pathname)) {
      const missing = setupMissing(env);
      return reply({
        ok: true,
        service: KNOWLEDGE.assistantName,
        status: missing.length ? 'setup_required' : 'configured',
        aiTested: false,
        message: 'Configuration check only; this does not test AI inference or prove chat is live.',
        missing,
        endpoint: '/chat',
        rateLimitMode: env.CHAT_RATE_LIMITER?.limit ? 'native-binding' : 'per-isolate-best-effort',
        knowledgeReviewed: KNOWLEDGE.lastReviewed,
        links: { contact: KNOWLEDGE.links.contact, projects: KNOWLEDGE.links.projects },
      }, 200, origin);
    }
    if (url.pathname !== '/chat') return reply({ error: 'not_found' }, 404, origin);
    if (!origin) return reply({ error: 'origin_not_allowed' }, 403, null);
    if (request.method === 'OPTIONS') {
      const method = request.headers.get('Access-Control-Request-Method');
      const headers = (request.headers.get('Access-Control-Request-Headers') || '')
        .toLowerCase().split(',').map(item => item.trim()).filter(Boolean);
      if (method !== 'POST' || headers.some(header => header !== 'content-type')) {
        return reply({ error: 'preflight_not_allowed' }, 403, origin);
      }
      return reply(null, 204, origin, {
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '600',
      });
    }
    if (request.method !== 'POST') return reply({ error: 'method_not_allowed' }, 405, origin, { Allow: 'POST, OPTIONS' });
    try {
      if (setupMissing(env).length) {
        throw new HttpError(503, 'setup_required', 'Chat setup is not complete. Please contact Paul directly.');
      }
      if (!await rateAllowed(request, env)) {
        return reply({ error: 'rate_limited', message: 'Please wait a minute before sending another message.', contactUrl: KNOWLEDGE.links.contact }, 429, origin, { 'Retry-After': '60' });
      }
      const { message, history, token } = validate(await readJson(request));
      if (!await verifyTurnstile(token, request, env, origin)) {
        throw new HttpError(403, 'bot_check_failed', 'Please refresh the bot check and try again.');
      }
      const answer = await generateAnswer(env, message, history);
      return reply({ answer, contactUrl: KNOWLEDGE.links.contact }, 200, origin);
    } catch (error) {
      const known = error instanceof HttpError;
      return reply({
        error: known ? error.code : 'service_unavailable',
        message: known ? error.message : 'Chat is temporarily unavailable. Please try again later.',
        contactUrl: KNOWLEDGE.links.contact,
      }, known ? error.status : 503, origin);
    }
  },
};
