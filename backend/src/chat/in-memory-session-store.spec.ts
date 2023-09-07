import { randomId } from './chat.helper';
import InMemorySessionStore from './in-memory-session-store';

describe('InMemorySessionStore', () => {
  it('should be defined', () => {
    const session = new InMemorySessionStore();
    expect(session).toBeDefined();
  });

  it('should be empty', () => {
    const session = new InMemorySessionStore();
    expect(session.findSession(0)).toBe(undefined);
    expect(session.findAllSession().length).toBe(0);
  });

  it('stores new sessions', () => {
    const id = randomId();
  });
});
