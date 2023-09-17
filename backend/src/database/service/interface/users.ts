import { UUID } from 'src/utils/types';

export interface IUsers {
  id: UUID;
  email: string;
  username: string;
  password: string;
  apiToken: string;
}
