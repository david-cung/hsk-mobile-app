/* eslint-env jest */

import fs from 'fs';
import path from 'path';

import { resources } from '../src/i18n/translations';

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walk(fullPath);
    }
    return /\.(tsx?|jsx?)$/.test(entry.name) ? [fullPath] : [];
  });
}

describe('i18n resources', () => {
  it('keeps Vietnamese and English translation keys in sync', () => {
    const enKeys = Object.keys(resources.en).sort();
    const viKeys = Object.keys(resources.vi).sort();
    expect(viKeys).toEqual(enKeys);
  });

  it('keeps literal UI copy out of app screens and components', () => {
    const srcRoot = path.resolve(__dirname, '..', 'src');
    const checkedRoots = ['screens', 'components', 'navigation'].map(segment =>
      path.join(srcRoot, segment),
    );
    const files = checkedRoots.flatMap(walk);
    const literalPatterns = [
      /<Text[^>]*>\s*[A-Za-zÀ-ỹ][^<{]*<\/Text>/,
      /\b(?:title|message|actionLabel|placeholder|accessibilityLabel)="[^"]*[A-Za-zÀ-ỹ][^"]*"/,
      /Alert\.alert\(\s*['"][^'"]*[A-Za-zÀ-ỹ][^'"]*['"]/,
    ];

    const offenders = files.flatMap(file => {
      const source = fs.readFileSync(file, 'utf8');
      return literalPatterns
        .filter(pattern => pattern.test(source))
        .map(pattern => `${path.relative(srcRoot, file)} matches ${pattern}`);
    });

    expect(offenders).toEqual([]);
  });
});
