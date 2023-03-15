import { matchStringPattern } from '../../src/utils/matchers';

describe('matchStringPattern function', () => {
  function tester(pattern: string | string[], value: string, expected: boolean): void {
    const result = matchStringPattern(pattern, value);

    expect(result).toBe(expected);
  }

  it('returns true with exact matches', () => {
    tester('auth:GetUser', 'auth:GetUser', true);
  });

  it('returns true with matches using wildcards at the end', () => {
    tester('auth:*', 'auth:Pattern', true);
  });

  it('returns true with matches using wildcards at the beginning', () => {
    tester('*:GetActivity', 'auth:GetActivity', true);
  });

  it('returns true with matches using wildcards at the middle', () => {
    tester('auth:*Activity', 'auth:GetActivity', true);
  });

  it('returns true with matches using multiples wildcards', () => {
    tester('*:Get*', 'auth:GetActivity', true);
  });

  it('returns true with matches using multiples patterns and no wildcards', () => {
    tester([ 'auth:GetActivity', 'blog:ListArticles' ], 'auth:GetActivity', true);
  });

  it('returns true with matches using multiples patterns and wildcards', () => {
    tester([ 'auth:*', 'blog:ListArticles' ], 'auth:GetActivity', true);
  });

  it('returns false with matches using wildcard and no value', () => {
    tester('*', '', false);
  });
});
