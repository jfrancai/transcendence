import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { UsersService } from './users.service';
import IUsers from './interface/users';

/*
 * use npm run test:db for testing
 */
describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService]
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should return a promise of a created user', async () => {
      const obj: IUsers = {
        email: 'toto@toto.com',
        username: 'toto',
        password: 'toto123'
      };
      const result = await service.createUser(obj);
      expect(result).toEqual({
        id: 1,
        email: 'toto@toto.com',
        username: 'toto',
        password: 'toto123'
      });
    });

    it('should return null when trying to create a user with same username', async () => {
      const obj: IUsers = {
        email: 'roberto@roberto.com',
        username: 'toto',
        password: 'toto123'
      };
      const result = await service.createUser(obj);
      expect(result).toBe(null);
    });

    it('should return null when trying to create a user with same email', async () => {
      const obj: IUsers = {
        email: 'toto@toto.com',
        username: 'albert',
        password: 'toto123'
      };
      const result = await service.createUser(obj);
      expect(result).toBe(null);
    });
  });

  describe('updateUserById', () => {
    it('should return a promise of a updated user', async () => {
      const objUpdated = {
        email: 'albert@albert.com'
      };
      const result = await service.updateUserById(1, objUpdated);

      expect(result).toEqual({
        id: 1,
        email: 'albert@albert.com',
        username: 'toto',
        password: 'toto123'
      });
    });
    it("should return a null because id doesn't exist", async () => {
      const objUpdated = {
        email: 'albert@albert.com'
      };
      const result = await service.updateUserById(2, objUpdated);

      expect(result).toBe(null);
    });
    it('dont know what will happend here', async () => {
      const objUpdated = {
        email: 'albert@albert.com'
      };
      const result = await service.updateUserById(1, objUpdated);

      expect(result).toEqual({
        id: 1,
        email: 'albert@albert.com',
        username: 'toto',
        password: 'toto123'
      });
    });
  });

  describe('updateUser', () => {
    it('should return a promise of a updated user', async () => {
      const updatedObj = {
        email: 'toto@toto.com'
      };
      const result = await service.updateUser(
        { email: 'albert@albert.com', username: 'toto' },
        updatedObj
      );
      expect(result).toEqual({
        id: 1,
        email: 'toto@toto.com',
        username: 'toto',
        password: 'toto123'
      });
    });
    it('should return a promise of updated user', async () => {
      const updatedObj = {
        email: 'albert@albert.com'
      };

      const result = await service.updateUser({ username: 'toto' }, updatedObj);
      expect(result).toEqual({
        id: 1,
        email: 'albert@albert.com',
        username: 'toto',
        password: 'toto123'
      });
    });
    it('should return a promise of updated user', async () => {
      const updatedObj = {
        email: 'toto@toto.com'
      };

      const result = await service.updateUser(
        { email: 'albert@albert.com' },
        updatedObj
      );
      expect(result).toEqual({
        id: 1,
        email: 'toto@toto.com',
        username: 'toto',
        password: 'toto123'
      });
    });
    it('should return null no information', async () => {
      const updatedObj = {
        email: 'toto@toto.com'
      };

      const result = await service.updateUser({}, updatedObj);
      expect(result).toBe(null);
    });
    it("should handle throw and return null because email or username doesn't exist", async () => {
      const updatedObj = {
        email: 'toto@toto.com'
      };

      const result = await service.updateUser(
        { email: 'robert@gmail.com' },
        updatedObj
      );
      expect(result).toBe(null);
    });
  });

  describe('getUserById', () => {
    it('should return a promise of a find user', async () => {
      const result = await service.getUserById(1);

      expect(result).toEqual({
        id: 1,
        email: 'toto@toto.com',
        username: 'toto',
        password: 'toto123'
      });
    });
  });

  describe('getUser', () => {
    it.concurrent(
      'should return a promise of a find user obj only have email',
      async () => {
        const result = await service.getUser({ email: 'toto@toto.com' });

        expect(result).toEqual({
          id: 1,
          email: 'toto@toto.com',
          username: 'toto',
          password: 'toto123'
        });
      }
    );
    it.concurrent(
      'should return a promise of find user obj only have username',
      async () => {
        const result = await service.getUser({ username: 'toto' });

        expect(result).toEqual({
          id: 1,
          email: 'toto@toto.com',
          username: 'toto',
          password: 'toto123'
        });
      }
    );
    it.concurrent(
      'should return null find user obj have no property',
      async () => {
        const result = await service.getUser({});

        expect(result).toBe(null);
      }
    );
    it.concurrent('should handle throw and return null', async () => {
      const result = await service.getUser({ username: 'robert' });

      expect(result).toBe(null);
    });
  });

  describe('deleteUserById', () => {
    it('should return a promise of a deleted user', async () => {
      const result = await service.deleteUserById(1);
      expect(result).toEqual({
        id: 1,
        email: 'toto@toto.com',
        username: 'toto',
        password: 'toto123'
      });
    });
    it('should handle throw and return null', async () => {
      const result = await service.deleteUserById(2);
      expect(result).toBe(null);
    });
  });

  describe('deleteUser', () => {
    it('should return a promise of a deleted user', async () => {
      await service.createUser({
        username: 'toto',
        email: 'robert@robert.com',
        password: '12398'
      });

      const result = await service.deleteUser({ username: 'toto' });
      expect(result).toEqual({
        id: 4,
        username: 'toto',
        email: 'robert@robert.com',
        password: '12398'
      });
    });

    it('should return a promise of a delted user', async () => {
      await service.createUser({
        username: 'toto',
        email: 'robert@robert.com',
        password: '12398'
      });

      const result = await service.deleteUser({ email: 'robert@robert.com' });
      expect(result).toEqual({
        id: 5,
        username: 'toto',
        email: 'robert@robert.com',
        password: '12398'
      });
    });
    it('should return null', async () => {
      const result = await service.deleteUser({});
      expect(result).toBe(null);
    });
    it('should handle throw and return null', async () => {
      const result = await service.deleteUser({
        username: 'roberto',
        email: 'riri@riri.com'
      });
      expect(result).toBe(null);
    });
    it('should handle throw and return null', async () => {
      const result = await service.deleteUser({ username: 'roberto' });
      expect(result).toBe(null);
    });
    it('should handle throw and return null', async () => {
      await service.createUser({
        username: 'toto',
        email: 'robert@robert.com',
        password: '12398'
      });
      const result = await service.deleteUser({ email: 'riri@riri.com' });
      expect(result).toBe(null);

      const res = await service.deleteUser({ email: 'robert@robert.com' });
      expect(res).toEqual({
        id: 6,
        username: 'toto',
        email: 'robert@robert.com',
        password: '12398'
      });
    });
  });
});
