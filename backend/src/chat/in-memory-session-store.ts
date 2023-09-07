import SessionStore from './session-store.interface';

export default class InMemorySessionStore<IdType = any, SessionType = any>
  implements SessionStore
{
  private readonly sessions: Map<IdType, SessionType>;

  constructor() {
    this.sessions = new Map();
  }

  findSession(id: IdType): any {
    return this.sessions.get(id);
  }

  saveSession(id: IdType, session: SessionType): any {
    this.sessions.set(id, session);
  }

  findAllSession(): any {
    return [...this.sessions.values()];
  }
}
