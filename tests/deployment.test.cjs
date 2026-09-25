const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('deployment contains the real homepage, every gallery detail, and assets', async () => {
  await import('../scripts/build.mjs');
  assert.equal(fs.readFileSync('dist/index.html', 'utf8'), fs.readFileSync('mirror/index.html', 'utf8'));
  for (const [source, destination, count] of [['elle', 'life', 47], ['esquire', 'objects', 40]]) {
    for (const suffix of ['', '-intro']) {
      assert.ok(fs.existsSync(`dist/${destination}${suffix}/index.html`));
    }
    for (let i = 1; i <= count; i++) {
      assert.equal(fs.readFileSync(`dist/${destination}/${i}/index.html`, 'utf8'),
        fs.readFileSync(`mirror/${source}/${i}/index.html`, 'utf8'));
    }
  }
  assert.ok(fs.existsSync('dist/offline-nav.js'));
  assert.ok(fs.existsSync('dist/images/life/01.jpg'));
  assert.ok(!fs.existsSync('dist/server.py'));
});

test('image compatibility endpoint redirects encoded local images and rejects external URLs', () => {
  const handler = require('../api/image.js');
  function request(url) {
    const response = { headers: {}, setHeader(k, v) { this.headers[k] = v; }, end() {} };
    handler({ url: '/_next/image?url=' + encodeURIComponent(url) + '&w=640&q=75' }, response);
    return response;
  }
  const valid = request('/images/life/01.jpg');
  assert.equal(valid.statusCode, 307);
  assert.equal(valid.headers.Location, '/images/life/01.jpg');
  for (const invalid of ['https://example.com/a.jpg', '//example.com/a.jpg', '/api/image', '/images/../api/image']) {
    assert.equal(request(invalid).statusCode, 400, invalid);
  }
});
