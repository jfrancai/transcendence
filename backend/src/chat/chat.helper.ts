import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randomBytes } from 'crypto';
import { Socket, io } from 'socket.io-client';

export async function createNestApp(
  ...gateways: any
): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    providers: gateways
  }).compile();

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

export async function expectConnect(socket: Socket): Promise<void> {
  const promise = new Promise<void>((resolve) => {
    socket.on('connect', () => {
      resolve();
    });
    socket.on('connect_error', () => {
      resolve();
      fail('it should not reach here');
    });
    socket.connect();
  });
  return promise;
}

export async function expectConnectFailure(socket: Socket): Promise<void> {
  const promise = new Promise<void>((resolve) => {
    socket.on('connect', () => {
      resolve();
      fail('it should not reach here');
    });
    socket.on('connect_error', () => {
      resolve();
    });
    socket.connect();
  });
  return promise;
}

export async function expectEvent(
  socket: Socket,
  event: string
): Promise<void> {
  const promise = new Promise<void>((resolve) => {
    socket.on(event, () => {
      resolve();
    });
  });
  return promise;
}

export function randomId(): string {
  return randomBytes(8).toString('hex');
}
