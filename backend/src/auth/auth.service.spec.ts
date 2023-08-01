import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import SignUpDto from './dto/signup-dto';
import { AuthService, checkHash } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let testingModule: TestingModule;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        JwtModule.registerAsync({
          global: true,
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: {
              expiresIn: configService.get<string>('JWT_EXPIRESIN')
            }
          }),
          inject: [ConfigService]
        })
      ],
      providers: [AuthService]
    }).compile();

    service = testingModule.get<AuthService>(AuthService);
  });

  afterEach(async () => {
    await testingModule.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should create user in database', async () => {
      const obj: SignUpDto = {
        email: 'test123@test123.com',
        username: 'gorgio',
        password: 'gorgio123'
      };
      const ret = await service.signUp(obj);
      expect(ret !== null).toBe(true);

      // Need to check individualy because of the hash for the password.
      if (ret !== null) {
        expect(obj.email === ret.email).toBe(true);
        expect(obj.username === ret.username).toBe(true);
        await expect(checkHash(obj.password, ret.password)).resolves.toBe(true);
      }
    });
  });
});
