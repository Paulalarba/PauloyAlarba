import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { createIntroTimeline } from '../src/components/intro/introTimeline.js';
import { getIntroPlacement, shouldPlayIntro } from '../src/components/intro/introModel.js';

function clock() {
  let time = 0, nextId = 0;
  const pending = new Map();
  return {
    now: () => time,
    schedule(callback, delay) { const id = ++nextId; pending.set(id, { at: time + delay, callback }); return id; },
    cancel(id) { pending.delete(id); },
    advance(to) {
      if (to < time) throw new Error('Time cannot move backward');
      while (true) {
        const next = [...pending].filter(([, value]) => value.at <= to).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        const [id, event] = next;
        pending.delete(id); time = event.at; event.callback();
      }
      time = to;
    },
    get pending() { return pending.size; },
  };
}
function run() {
  const timer = clock(), events = [];
  const timeline = createIntroTimeline({
    schedule: timer.schedule, cancel: timer.cancel, now: timer.now,
    onNode: node => events.push(['node', node, timer.now()]),
    onReveal: () => events.push(['reveal', timer.now()]),
    onFinish: () => events.push(['finish', timer.now()]),
  });
  return { timer, timeline, events };
}

test('each homepage load plays; direct pages, motion preference, and short windows skip', () => {
  const first = { page: 'home', reducedMotion: false, sessionSeen: false, viewportHeight: 720 };
  assert.equal(shouldPlayIntro(first), true);
  assert.equal(shouldPlayIntro({ ...first, sessionSeen: true }), true);
  assert.equal(shouldPlayIntro({ ...first, reducedMotion: true }), false);
  assert.equal(shouldPlayIntro({ ...first, page: 'projects' }), false);
  assert.equal(shouldPlayIntro({ ...first, page: 'contact' }), false);
  assert.equal(shouldPlayIntro({ ...first, viewportHeight: 375 }), false);
});

test('cached opening imagery completes the workflow before revealing and releasing the page', () => {
  const { timer, timeline, events } = run();
  timeline.assetsSettled();
  timer.advance(1949);
  assert.deepEqual(events.filter(event => event[0] === 'node').map(event => event[1]), [1, 2, 3]);
  assert.equal(events.some(event => event[0] === 'reveal'), false);
  timer.advance(2200);
  assert.deepEqual(events.slice(-2), [['node', 4, 1950], ['reveal', 2200]]);
  timer.advance(3069);
  assert.equal(events.some(event => event[0] === 'finish'), false);
  timer.advance(3070);
  assert.deepEqual(events.at(-1), ['finish', 3070]);
  assert.equal(timer.pending, 0);
});

test('late images begin the exit as soon as they settle after the minimum sequence', () => {
  const { timer, timeline, events } = run();
  timer.advance(2600);
  assert.equal(events.some(event => event[0] === 'reveal'), false);
  timeline.assetsSettled();
  assert.deepEqual(events.at(-1), ['reveal', 2600]);
  timer.advance(3470);
  assert.deepEqual(events.at(-1), ['finish', 3470]);
});

test('images that never settle cannot leave the loader blocking the portfolio', () => {
  const { timer, timeline, events } = run();
  timer.advance(3400);
  assert.deepEqual(events.at(-1), ['reveal', 3400]);
  timer.advance(10000);
  assert.deepEqual(events.at(-1), ['finish', 4270]);
  timeline.assetsSettled();
  assert.equal(events.filter(event => event[0] === 'reveal').length, 1);
  assert.equal(events.filter(event => event[0] === 'finish').length, 1);
  assert.equal(timer.pending, 0);
});

test('time spent in a background tab does not consume the visible intro', () => {
  const { timer, timeline, events } = run();
  timeline.assetsSettled();
  timer.advance(800);
  timeline.pause();
  timer.advance(10800);
  assert.deepEqual(events, [['node', 1, 650]]);
  timeline.resume();
  timer.advance(12200);
  assert.deepEqual(events.at(-1), ['reveal', 12200]);
  timer.advance(13070);
  assert.deepEqual(events.at(-1), ['finish', 13070]);
});

test('assets settling and reveal animation remain paused until visible', () => {
  const { timer, timeline, events } = run();
  timer.advance(1000);
  timeline.pause();
  timeline.assetsSettled();
  timer.advance(6000);
  assert.equal(events.some(event => event[0] === 'reveal'), false);
  timeline.resume();
  timer.advance(7200);
  assert.deepEqual(events.at(-1), ['reveal', 7200]);
  timer.advance(7250);
  timeline.pause();
  timer.advance(20000);
  assert.equal(events.some(event => event[0] === 'finish'), false);
  timeline.resume();
  timer.advance(20820);
  assert.deepEqual(events.at(-1), ['finish', 20820]);
});

test('early exit releases immediately and cancels future work', () => {
  const { timer, timeline, events } = run();
  timer.advance(800);
  timeline.finish();
  timeline.finish();
  timeline.assetsSettled();
  timer.advance(10000);
  assert.deepEqual(events, [['node', 1, 650], ['finish', 800]]);
  assert.equal(timer.pending, 0);
});

test('navigation/unmount cancels the old timeline, including late image callbacks', () => {
  const { timer, timeline, events } = run();
  timer.advance(500);
  timeline.dispose();
  timeline.assetsSettled();
  timeline.finish();
  timer.advance(10000);
  assert.deepEqual(events, []);
  assert.equal(timer.pending, 0);
});

test('a remounted intro runs independently of its disposed predecessor', () => {
  const first = run(), second = run();
  first.timeline.dispose();
  first.timeline.assetsSettled();
  second.timeline.assetsSettled();
  first.timer.advance(10000);
  second.timer.advance(10000);
  assert.deepEqual(first.events, []);
  assert.equal(second.events.filter(event => event[0] === 'finish').length, 1);
});

test('an animation setup error still leaves a scheduled release', () => {
  const timer = clock();
  let releases = 0;
  const timeline = createIntroTimeline({
    schedule: timer.schedule, cancel: timer.cancel, now: timer.now,
    onNode() {}, onReveal() { throw new Error('Animation API failed'); },
    onFinish() { releases++; },
  });
  timeline.assetsSettled();
  timer.advance(2200);
  assert.equal(releases, 1);
  timer.advance(10000);
  assert.equal(releases, 1);
});

test('the oversized headline remains inside mobile, tablet, and desktop viewports', () => {
  const examples = [
    { viewport: { width: 320, height: 568 }, target: { left: 20, top: 110, width: 280, height: 110 } },
    { viewport: { width: 390, height: 844 }, target: { left: 20, top: 110, width: 350, height: 80 } },
    { viewport: { width: 768, height: 1024 }, target: { left: 30, top: 104, width: 510, height: 70 } },
    { viewport: { width: 1280, height: 720 }, target: { left: 322, top: 43, width: 600, height: 80 } },
    { viewport: { width: 1920, height: 1080 }, target: { left: 372, top: 43, width: 960, height: 80 } },
  ];
  for (const { viewport, target } of examples) {
    const placement = getIntroPlacement(target, viewport);
    assert(placement.scale > 0 && Number.isFinite(placement.scale));
    assert(placement.x >= 0);
    assert(placement.x + target.width * placement.scale <= viewport.width);
    assert(placement.y + target.height * placement.scale < placement.flowTop);
    assert(placement.flowTop + 120 < viewport.height);
  }
});

function bootstrap(theme = 'light', storageThrows = false) {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const source = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const timer = clock(), listeners = new Map();
  const root = { hidden: false }, fallback = { hidden: true };
  const document = {
    documentElement: { dataset: {} }, body: { style: { overflow: 'hidden' } },
    getElementById: id => id === 'root' ? root : fallback,
    querySelector: () => ({ setAttribute() {} }),
  };
  const window = {
    setTimeout: timer.schedule, clearTimeout: timer.cancel,
    innerHeight: 720, matchMedia: () => ({ matches: false }),
    addEventListener: (name, callback) => listeners.set(name, callback),
    dispatchEvent() {},
  };
  vm.runInNewContext(source, {

    window, document, location: { pathname: '/', hash: '' }, Event: class Event {},
    localStorage: { getItem() { if (storageThrows) throw new Error('Storage disabled'); return theme; } },
  });
  return { timer, root, fallback, document, mount: () => listeners.get('portfolio:mounted')() };
}

test('dark theme and animated opening frame apply before React starts', () => {
  const fixture = bootstrap('dark');
  assert.equal(fixture.document.documentElement.dataset.theme, 'dark');
  assert.equal(fixture.document.documentElement.dataset.boot, 'workflow');
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.equal((html.match(/class="startup-step"/g) || []).length, 4);
  assert.doesNotMatch(html, /startup-headline|<h1 class="startup-headline"/);
});

test('missing app bundle shows a usable reload fallback and releases scroll', () => {
  const fixture = bootstrap();
  fixture.timer.advance(8000);
  assert.equal(fixture.root.hidden, true);
  assert.equal(fixture.fallback.hidden, false);
  assert.equal(fixture.document.body.style.overflow, '');
});

test('successful mounting prevents the startup fallback; late mounting recovers it', () => {
  const fast = bootstrap();
  fast.mount();
  fast.timer.advance(10000);
  assert.equal(fast.fallback.hidden, true);
  assert.equal(fast.root.hidden, false);
  const late = bootstrap();
  late.timer.advance(8000);
  late.mount();
  assert.equal(late.root.hidden, false);
  assert.equal(late.fallback.hidden, true);
});

test('startup remains usable with storage disabled', () => {
  const fixture = bootstrap('light', true);
  fixture.mount();
  fixture.timer.advance(10000);
  assert.equal(fixture.fallback.hidden, true);
});
