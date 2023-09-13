export interface SessionStore<IdType = any, SessionType = any> {
  findSession(id: IdType): any;
  saveSession(id: IdType, session: SessionType): any;
  findAllSession(): any;
}
export interface Session {
  username: string;
  connected: boolean;
  messages: string[];
}
