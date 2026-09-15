import { expect, it } from 'vitest';
import { extractReleaseNotes } from '../release-notes.mjs';

it('extracts only the requested version with its subsections', () => {
  const changelog =
    '# Changelog\n\n## 2.0.0 (2026-10-01)\n\n### Features\n\n- New API\n\n## 1.0.0 (2026-09-15)\n\n- Original API\n';
  expect(extractReleaseNotes(changelog, '2.0.0')).toBe(
    '## 2.0.0 (2026-10-01)\n\n### Features\n\n- New API\n',
  );
  expect(extractReleaseNotes(changelog, '1.0.0')).toBe(
    '## 1.0.0 (2026-09-15)\n\n- Original API\n',
  );
});

it('supports linked headings, prereleases, and Windows line endings', () => {
  const changelog =
    '# [1.0.0-rc.1](https://example.com/compare) (2026-09-15)\r\n\r\n- Preview\r\n';
  expect(extractReleaseNotes(changelog, '1.0.0-rc.1')).toBe(
    changelog.replaceAll('\r', ''),
  );
});

it('rejects missing and empty version entries instead of publishing other notes', () => {
  expect(() => extractReleaseNotes('## 1.0.0\n\n- First\n', '1.0.1')).toThrow(
    'No changelog entry',
  );
  expect(() =>
    extractReleaseNotes('## 1.0.0\n\n## 0.2.1\n\n- Old\n', '1.0.0'),
  ).toThrow('Empty changelog entry');
});
