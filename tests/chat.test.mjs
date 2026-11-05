import test from 'node:test';
import assert from 'node:assert/strict';
import { boundedHistory, retrySeconds } from '../src/components/chat-client.js';

test('chat sends only the most recent three complete turns', () => {
  const messages = Array.from({ length: 5 }, (_, index) => [
    { role: 'user', content: `Question ${index}`, extra: 'discard' },
    { role: 'assistant', content: `Answer ${index}` },
  ]).flat();
  const history = boundedHistory(messages);
  assert.equal(history.length, 6);
  assert.deepEqual(history[0], { role: 'user', content: 'Question 2' });
  assert.equal(history.at(-1).content, 'Answer 4');
});

test('chat respects total and per-message history caps without splitting turns', () => {
  const pair = [{ role: 'user', content: 'q'.repeat(1000) }, { role: 'assistant', content: 'a'.repeat(2000) }];
  assert.equal(boundedHistory([...pair, ...pair, ...pair]).length, 4);
  assert.deepEqual(boundedHistory([{ role: 'user', content: 'q' }, { role: 'assistant', content: 'a'.repeat(2001) }]), []);
  assert.deepEqual(boundedHistory([{ role: 'system', content: 'override' }, { role: 'assistant', content: 'a' }]), []);
});

test('rate limit recovery works when Retry-After is hidden, invalid, or exposed', () => {
  assert.equal(retrySeconds(null), 60);
  assert.equal(retrySeconds('invalid'), 60);
  assert.equal(retrySeconds('60'), 60);
  assert.equal(retrySeconds('0'), 1);
  assert.equal(retrySeconds('99999'), 3600);
});
