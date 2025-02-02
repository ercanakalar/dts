import { EmailExistsGuard } from './email-exists.guard';

describe('EmailExistsGuard', () => {
  it('should be defined', () => {
    expect(new EmailExistsGuard()).toBeDefined();
  });
});
