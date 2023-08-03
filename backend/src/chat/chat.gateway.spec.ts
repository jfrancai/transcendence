import { INestApplication } from '@nestjs/common';
import { Socket } from 'socket.io-client';
import ChatGateway from './chat.gateway';
import {
  createNestApp,
  expectConnect,
  expectConnectFailure,
  getClientSocket
} from './chat.helper';

describe('ChatGateway', () => {
  describe('App initilization', () => {
    let gateway: ChatGateway;
    let app: INestApplication;
    let logSpy: jest.SpyInstance;

    beforeAll(async () => {
      app = await createNestApp(ChatGateway);
      gateway = app.get<ChatGateway>(ChatGateway);
      logSpy = jest.spyOn(gateway.getLogger(), 'log');

      app.listen(3000);
    });

    afterAll(async () => {
      await app.close();
    });

    it('should initialize the app', () => {
      expect(gateway).toBeDefined();
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith('Initialized');
    });
  });

  describe('Single client connection', () => {
    let gateway: ChatGateway;
    let app: INestApplication;
    let logSpy: jest.SpyInstance;

    beforeEach(async () => {
      app = await createNestApp(ChatGateway);
      gateway = app.get<ChatGateway>(ChatGateway);
      logSpy = jest.spyOn(gateway.getLogger(), 'log');
      app.listen(3000);
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(async () => {
      await app.close();
    });

    it('should connect', async () => {
      const socket = getClientSocket({
        username: 'toto'
      });
      await expectConnect(socket);
      socket.disconnect();

      // Spy calls expectations
      const { calls } = logSpy.mock;
      expect(logSpy).toHaveBeenCalledTimes(2);

      expect(calls[0].length).toBe(1);
      expect(calls[0][0]).toMatch('Client id:');

      expect(calls[1].length).toBe(1);
      expect(calls[1][0]).toMatch('Nb clients:');
    });

    it('cannot connect without username', async () => {
      const socket = getClientSocket({});
      await expectConnectFailure(socket);
    });

    it('sends all connected users (only the current user here)', async () => {
      const socket = getClientSocket({ username: 'toto' });
      socket.on('users', (data) => {
        expect(data.length).toBe(1);
        expect(data[0]).toHaveProperty('userID');
        expect(data[0]).toHaveProperty('username');
      });
      await expectConnect(socket);
      socket.disconnect();
    });

    it('does not receive info about its own connection', async () => {
      const socket = getClientSocket({ username: 'toto' });
      socket.on('user connected', () => {
        fail('it should not reach here');
      });
      await expectConnect(socket);
      socket.disconnect();
    });
  });

  describe('At least one client connected', () => {
    let gateway: ChatGateway;
    let app: INestApplication;
    let client0: Socket;
    let logSpy: jest.SpyInstance;

    beforeEach(async () => {
      app = await createNestApp(ChatGateway);
      gateway = app.get<ChatGateway>(ChatGateway);
      logSpy = jest.spyOn(gateway.getLogger(), 'log');
      app.listen(3000);
      client0 = getClientSocket({ username: 'toto' });
    });

    afterEach(async () => {
      await app.close();
      jest.clearAllMocks();
    });

    it('should initialize the app', () => {
      expect(gateway).toBeDefined();
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith('Initialized');
    });

    it('already connected client receive new connected client information', async () => {
      const client1 = getClientSocket({ username: 'tata' });

      client0.on('user connected', (data) => {
        expect(data.length).toBe(1);
        expect(data[0]).toHaveProperty('userID');
        expect(data[0]).toHaveProperty('username');
        expect(data[0].username).toBe('tata');
      });

      await expectConnect(client0);
      await expectConnect(client1);

      client0.disconnect();
      client1.disconnect();
    });
  });
});
