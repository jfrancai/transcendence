/**
 * @typedef IUsers
 * @property {string} email of of user store in db
 * @property {string} username of user store in db
 * @property {string} password of user store in db
 */
export default interface IUsers {
  email: string;
  username: string;
  password: string;
}
