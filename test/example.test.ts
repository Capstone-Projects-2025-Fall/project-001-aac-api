import { add } from '../src/index';

describe('add function', () => {
  it('adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
});
