import { describe, test, expect } from 'vitest';
import { parseVideoId } from '../parseVideoId.js';

describe('parseVideoId', () => {
  test('returns ID when input is already an ID', () => {
    expect(parseVideoId('ABCDEFG1234')).toBe('ABCDEFG1234');
  });

  test('parses standard watch URL', () => {
    const url = 'https://www.youtube.com/watch?v=ABCDEFG1234';
    expect(parseVideoId(url)).toBe('ABCDEFG1234');
  });

  test('parses shortened URL', () => {
    const url = 'https://youtu.be/ABCDEFG1234';
    expect(parseVideoId(url)).toBe('ABCDEFG1234');
  });

  test('parses embed URL', () => {
    const url = 'https://www.youtube.com/embed/ABCDEFG1234';
    expect(parseVideoId(url)).toBe('ABCDEFG1234');
  });

  test('returns null for invalid input', () => {
    expect(parseVideoId('https://example.com')).toBeNull();
  });
});
