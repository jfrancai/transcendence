export default interface SessionStore<IdType = any, SessionType = any> {
  findSession(id: IdType): any;
  saveSession(id: IdType, session: SessionType): any;
  findAllSession(): any;
}
