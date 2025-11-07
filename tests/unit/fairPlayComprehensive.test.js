import { describe, test, expect } from 'vitest';
import { getFairQueue } from '../../fairPlay.js';

describe('getFairQueue comprehensive tests', () => {
  test('should handle an empty queue', () => {
    const queue = [];
    const stats = {};
    const ordered = getFairQueue(queue, stats, false);
    expect(ordered).toEqual([]);
  });

  test('should handle a queue with a single singer', () => {
    const queue = [
      { id: '1', singer: 'A' },
      { id: '2', singer: 'A' },
    ];
    const stats = { A: { songsSung: 0 } };
    const ordered = getFairQueue(queue, stats, false);
    expect(ordered.map(s => s.id)).toEqual(['1', '2']);
  });

  test('should handle a queue where one singer has multiple songs', () => {
    const queue = [
      { id: '1', singer: 'A' },
      { id: '2', singer: 'B' },
      { id: '3', singer: 'A' },
    ];
    const stats = { A: { songsSung: 0 }, B: { songsSung: 0 } };
    const ordered = getFairQueue(queue, stats, false);
    expect(ordered.map(s => s.id)).toEqual(['1', '2', '3']);
  });

  test('should handle singers with varying numbers of songs sung', () => {
    const queue = [
      { id: '1', singer: 'A' },
      { id: '2', singer: 'B' },
      { id: '3', singer: 'C' },
    ];
    const stats = { A: { songsSung: 2 }, B: { songsSung: 1 }, C: { songsSung: 0 } };
    const ordered = getFairQueue(queue, stats, true);
    expect(ordered.map(s => s.id)).toEqual(['3', '2', '1']);
  });

  test('should handle a mix of singers who have and have not sung', () => {
    const queue = [
      { id: '1', singer: 'A' },
      { id: '2', singer: 'B' },
      { id: '3', singer: 'C' },
    ];
    const stats = { A: { songsSung: 1 }, B: { songsSung: 0 } };
    const ordered = getFairQueue(queue, stats, true);
    expect(ordered.map(s => s.id)).toEqual(['2', '3', '1']);
  });

  test('should handle an empty singerStats object', () => {
    const queue = [
      { id: '1', singer: 'A' },
      { id: '2', singer: 'B' },
    ];
    const stats = {};
    const ordered = getFairQueue(queue, stats, false);
    expect(ordered.map(s => s.id)).toEqual(['1', '2']);
  });

  test('should handle malformed singerStats object', () => {
    const queue = [
      { id: '1', singer: 'A' },
      { id: '2', singer: 'B' },
    ];
    const stats = { A: "malformed" };
    const ordered = getFairQueue(queue, stats, false);
    expect(ordered.map(s => s.id)).toEqual(['1', '2']);
  });

  test('phase 2 should correctly prioritize singers with fewer songs', () => {
    const queue = [
        { id: '1', singer: 'A' },
        { id: '2', singer: 'B' },
        { id: '3', singer: 'A' },
        { id: '4', singer: 'C' },
    ];
    const stats = { A: { songsSung: 2 }, B: { songsSung: 0 }, C: { songsSung: 1 } };
    const ordered = getFairQueue(queue, stats, true);
    expect(ordered.map(s => s.id)).toEqual(['2', '4', '1', '3']);
  });
});
