import { describe, test, expect } from 'vitest';
import { getFairQueue } from '../fairPlay.js';

describe('getFairQueue', () => {
  test('new singer prioritized in phase 1', () => {
    const queue = [
      { id: '1', singer: 'A' },
      { id: '2', singer: 'A' },
      { id: '3', singer: 'B' },
    ];
    const stats = { A: { songsSung: 0 }, B: { songsSung: 0 } };
    const ordered = getFairQueue(queue, stats, false);
    expect(ordered.map(s => s.id)).toEqual(['1', '3', '2']);
  });

  test('phase 2 prioritizes fewest songs sung', () => {
    const queue = [
      { id: '1', singer: 'A' },
      { id: '2', singer: 'B' },
      { id: '3', singer: 'A' },
    ];
    const stats = { A: { songsSung: 1 }, B: { songsSung: 0 } };
    const ordered = getFairQueue(queue, stats, true);
    expect(ordered.map(s => s.id)).toEqual(['2', '1', '3']);
  });
});

