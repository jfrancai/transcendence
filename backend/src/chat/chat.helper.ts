import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Socket, io } from 'socket.io-client';
import { AuthService } from '../auth/auth.service';

export async function createNestApp(module: any): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule(module)
    .useMocker((token) => {
      if (token === AuthService) {
        return {
          findUserWithToken: jest.fn().mockResolvedValue({
            email: 'jfrancai@student.42.fr',
            password:
              '$2b$10$mLFMwDen3HPw1KOGilopqO6Bc6HCniCg/Ar0X4xjzTL/UlObtr8U6',
            id: '06eb820e-3ce2-4483-8801-f33cc01880c1',
            username: 'jfrancai'
          })
        };
      }
      return {};
    })
    .compile();

  return testingModule.createNestApplication();
}

export function getClientSocket(auth: { [key: string]: any }): Socket {
  const socket = io('http://localhost:3000', {
    autoConnect: false,
    transports: ['websocket', 'polling']
  });
  socket.auth = auth;
  return socket;
}

export async function expectEvent(
  socket: Socket,
  event: string
): Promise<void> {
  return new Promise<void>((resolve) => {
    socket.on(event, () => {
      resolve();
    });
  });
}
