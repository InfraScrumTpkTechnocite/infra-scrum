import { NumberToIntegerPipe } from './number-to-integer.pipe';

describe('NumberToIntegerPipe', () => {
  it('create an instance', () => {
    const pipe = new NumberToIntegerPipe();
    expect(pipe).toBeTruthy();
  });
});
