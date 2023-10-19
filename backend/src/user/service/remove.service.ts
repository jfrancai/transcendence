import { Injectable } from '@nestjs/common';
import { IUsers } from 'src/database/service/interface/users';
import { UsersService } from 'src/database/service/users.service';

@Injectable()
export class RemoveService {
  constructor(private readonly usersService: UsersService) {}

  async removeSensitiveData(user: Partial<IUsers>) {
    const result = await this.usersService.getUser(user);

    if (result) {
      const {
        password,
        twoAuthOn,
        twoAuthSecret,
        apiToken,
        maxAge,
        ...stripedData
      } = result;
      return stripedData;
    }
    return null;
  }
}
