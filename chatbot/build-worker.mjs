import { readFile, writeFile } from 'node:fs/promises';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const knowledge = JSON.parse(await read('paul-knowledge.json'));
// Keep editorial provenance in the maintained JSON, outside the inference context.
const runtimeKnowledge = JSON.parse(JSON.stringify(knowledge, (key, value) =>
  key === 'metadata' || key === 'sourceIds' ? undefined : value));
runtimeKnowledge.lastReviewed = knowledge.metadata.lastReviewed;
const prompt = await read('system-prompt.md');
const runtime = await read('worker-runtime.mjs');
const output = '// GENERATED: node chatbot/build-worker.mjs\n'
  + '// Paste this entire file into the Cloudflare Worker editor. No external imports.\n'
  + 'const KNOWLEDGE = ' + JSON.stringify(runtimeKnowledge) + ';\n'
  + 'const SYSTEM_PROMPT = ' + JSON.stringify(prompt) + ';\n\n'
  + runtime;
await writeFile(new URL('worker.mjs', import.meta.url), output);
await writeFile(new URL('worker.js', import.meta.url), output);
console.log('Built chatbot/worker.js and worker.mjs with ' + knowledge.projects.length + ' projects.');
