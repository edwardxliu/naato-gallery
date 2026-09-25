// The archived Next.js pages still request /_next/image. Serve the original
// static image, as the local Python preview does, without a Next.js server.
module.exports = function handler(request, response) {
  const source = new URL(request.url, 'https://gallery.local').searchParams.get('url') || '';
  const target = new URL(source, 'https://gallery.local');
  if (!source.startsWith('/') || source.startsWith('//') ||
      target.origin !== 'https://gallery.local' ||
      !/^\/(images\/|covers\/|_next\/static\/media\/)/.test(target.pathname)) {
    response.statusCode = 400;
    response.end('Invalid image path');
    return;
  }
  response.statusCode = 307;
  response.setHeader('Location', target.pathname + target.search);
  response.setHeader('Cache-Control', 'public, max-age=3600');
  response.end();
};
