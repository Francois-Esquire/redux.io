import { JSDOM } from 'jsdom';

export default function createDom(port = 3000) {
  const protocol = 'http:';
  const host = 'localhost';
  const url = `${protocol}//${host}:${port}`;

  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    referrer: url,
    url,
  });

  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = {
    userAgent: 'node.js',
  };
  global.location = {
    protocol,
    host,
    port,
    origin: url,
  };

  return dom;
}
