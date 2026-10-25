import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

test('clean paths, legacy links, project details, and Home controls', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] } });
  const location = { origin: 'http://localhost:5173', pathname: '/', search: '', hash: '', href: 'http://localhost:5173/' };
  let reducedMotion = true;
  globalThis.window = { location, innerHeight: 720, matchMedia: () => ({ matches: reducedMotion }), history: {
    replaceState(_state, _title, url) {
      const next = new URL(url, location.origin);
      Object.assign(location, { pathname: next.pathname, search: next.search, hash: next.hash, href: next.href });
    },
  } };
  globalThis.document = { hidden: false };
  globalThis.localStorage = { getItem: () => null };
  globalThis.sessionStorage = { getItem: () => '1' };
  try {
    const { default: App } = await server.ssrLoadModule('/src/App.jsx');
    const { pageHref, routePage, canonicalizeLegacyRoute, isInternalRoute } = await server.ssrLoadModule('/src/routing.js');
    const render = () => renderToStaticMarkup(React.createElement(App));
    assert.equal(pageHref('home'), '/');
    assert.equal(pageHref('projects'), '/projects');
    assert.equal(pageHref('services'), '/services');
    let home = render();
    assert.match(home, /href="\/projects"/);
    assert.match(home, /href="\/contact"/);
    assert.doesNotMatch(home, /tools-toggle|video-control|Pause tools|Pause Bitcoin/);
    reducedMotion = false;
    const intro = render();
    assert.match(intro, /class="workflow-intro"/);
    assert.doesNotMatch(intro, /Skip intro|intro-skip/);
    reducedMotion = true;
    for (const page of ['projects', 'services', 'expertise', 'about', 'contact']) {
      location.pathname = '/' + page;
      assert.equal(routePage(), page);
      assert.match(render(), new RegExp('href="/' + page + '"[^>]+aria-current="page"'));
    }
    location.pathname = '/services';
    const services = render();
    for (const title of ['Understand. Build. Improve.', 'Websites', 'Web applications', 'Connected workflows', 'Blockchain prototypes', 'AI-assisted tools', 'One request. A clearer next step.']) assert(services.includes(title));
    assert.equal((services.match(/class="service-card"/g) || []).length, 5);
    assert.match(services, /href="\/contact"/);
    location.pathname = '/projects';
    const gallery = render();
    for (const name of ['KamayAral', 'KamayAral AI', 'EduCredit']) assert(gallery.includes(name));
    assert.equal((gallery.match(/class="project-card"/g) || []).length, 7);
    location.search = '?project=kamayaral-ai';
    assert.match(render(), /Six-sign temporal classification baseline/);
    location.pathname = '/projects'; location.search = '?project=sugbogo';
    assert.match(render(), /<dialog/);
    location.pathname = '/'; location.search = ''; location.hash = '#work?project=fittrack';
    assert.equal(routePage(), 'projects');
    assert.match(render(), /<dialog/);
    canonicalizeLegacyRoute();
    assert.equal(location.pathname, '/projects');
    assert.equal(location.search, '?project=fittrack');
    assert.equal(location.hash, '');
    const anchor = { href: 'http://localhost:5173/contact', hasAttribute: () => false, target: '' };
    const click = { button: 0, defaultPrevented: false };
    assert.equal(isInternalRoute(anchor, click), true);
    assert.equal(isInternalRoute(anchor, { ...click, ctrlKey: true }), false);
    assert.equal(isInternalRoute({ ...anchor, href: 'https://elsewhere.test/contact' }, click), false);
  } finally { await server.close(); }
});
