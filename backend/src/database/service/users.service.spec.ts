import { Test, TestingModule } from '@nestjs/testing';
import PrismaService from './prisma.service';
import UsersService from './users.service';
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
        name: 'toto',
        password: 'toto123'
      };
      const result = await service.createUser(obj);
      expect(result).toEqual({
        id: 1,
        email: 'toto@toto.com',
        name: 'toto',
        password: 'toto123'
      });
    });
    it('should return null when trying to create a user with same name', async () => {
      const obj: IUsers = {
        email: 'roberto@roberto.com',
        name: 'toto',
        password: 'toto123'
      };
      const result = await service.createUser(obj);
      expect(result).toBe(null);
    });
  });

  describe('updateUser', () => {
    it('should return a promise of a updated user', async () => {
      const objUpdated = {
        email: 'albert@albert.com'
      };
      const result = await service.updateUser(1, objUpdated);

      expect(result).toEqual({
        id: 1,
        email: 'albert@albert.com',
        name: 'toto',
        password: 'toto123'
      });
    });
  });

  describe('getUserById', () => {
    it('should return a promise of a find user', async () => {
      const result = await service.getUserById(1);

      expect(result).toEqual({
        id: 1,
        email: 'albert@albert.com',
        name: 'toto',
        password: 'toto123'
      });
    });
  });

  describe('getUser', () => {
    it.concurrent(
      'should return a promise of a find user obj only have email',
      async () => {
        const result = await service.getUser(undefined, 'albert@albert.com');

        expect(result).toEqual({
          id: 1,
          email: 'albert@albert.com',
          name: 'toto',
          password: 'toto123'
        });
      }
    );
    it.concurrent(
      'should return a promise of find user obj only have name',
      async () => {
        const result = await service.getUser('toto');

        expect(result).toEqual({
          id: 1,
          email: 'albert@albert.com',
          name: 'toto',
          password: 'toto123'
        });
      }
    );
    it.concurrent(
      'should return null find user obj have no property',
      async () => {
        const result = await service.getUser();

        expect(result).toBe(null);
      }
    );
  });

  describe('deleteUser', () => {
    it('should return a promise of a deleted user', async () => {
      const result = await service.deleteUser(1);
      expect(result).toEqual({
        id: 1,
        email: 'albert@albert.com',
        name: 'toto',
        password: 'toto123'
      });
    });
  });
});
