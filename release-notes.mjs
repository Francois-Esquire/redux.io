import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

export function extractReleaseNotes(changelog, version) {
  const lines = changelog.split(/\r?\n/);
  const start = lines.findIndex(line => {
    const heading = line.match(/^#{1,2}\s+\[?([^\]\s(]+)/);
    return heading?.[1] === version;
  });
  if (start < 0) throw new Error('No changelog entry for ' + version);
  const next = lines.findIndex(
    (line, index) => index > start && /^#{1,2}\s/.test(line),
  );
  const section = lines.slice(start, next < 0 ? undefined : next);
  if (!section.slice(1).join('\n').trim())
    throw new Error('Empty changelog entry for ' + version);
  return section.join('\n').trim() + '\n';
}

if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
) {
  const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
  const destination = process.argv[2];
  if (!destination) throw new Error('Pass a destination for the release notes');
  writeFileSync(
    destination,
    extractReleaseNotes(readFileSync('CHANGELOG.md', 'utf8'), version),
  );
}
