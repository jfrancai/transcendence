import ITwoAuth from './two-auth';

export default interface IUsers {
  email: string;
  username: string;
  password: string;
  twoAuth: ITwoAuth;
}
