import { SafeStylePipe } from './safe-style.pipe';

describe('SafeUrlPipe', () => {
  it('create an instance', () => {
    const pipe = new SafeStylePipe();
    expect(pipe).toBeTruthy();
  });
});
