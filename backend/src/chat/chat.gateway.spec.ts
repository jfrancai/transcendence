import { INestApplication } from '@nestjs/common';
import ChatGateway from './chat.gateway';
import {
  createNestApp,
  expectConnect,
  expectConnectFailure,
  expectEvent,
  expectEventSpecific,
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
    let logSpy: jest.SpyInstance;

    beforeEach(async () => {
      app = await createNestApp(ChatGateway);
      gateway = app.get<ChatGateway>(ChatGateway);
      logSpy = jest.spyOn(gateway.getLogger(), 'log');
      app.listen(3000);
      jest.clearAllMocks();
    });

    afterEach(async () => {
      await app.close();
    });

    it('already connected client receive new connected client information', async () => {
      const client0 = getClientSocket({ username: 'toto' });
      const client1 = getClientSocket({ username: 'tata' });

      client0.on('user connected', (data) => {
        expect(data).toHaveProperty('userID');
        expect(data).toHaveProperty('username');
        expect(data.username).toBe('tata');
      });

      await expectConnect(client0);
      await expectConnect(client1);
      await expectEvent(client0, 'user connected');

      client0.disconnect();
      client1.disconnect();
    });

    it('is possible to send private message to another client', async () => {
      const client0 = getClientSocket({ username: 'toto' });
      const client1 = getClientSocket({ username: 'tata' });

      client1.on('private message', (data) => {
        expect(data).toHaveProperty('content');
        expect(data).toHaveProperty('from');
        expect(data.from).toBe(client0.id);
        expect(data.content).toBe('some private infos: 42');
      });

      await expectConnect(client0);
      await expectConnect(client1);

      client0.emit('private message', {
        content: 'some private infos: 42',
        to: client1.id
      });

      await expectEvent(client1, 'private message');

      client0.disconnect();
      client1.disconnect();
    });

    it('other connected clients does not receive private message', async () => {
      const client0 = getClientSocket({ username: 'toto' });
      const client1 = getClientSocket({ username: 'tata' });
      const client2 = getClientSocket({ username: 'tata' });

      client2.on('private message', () => {
        fail('it should not reach here');
      });

      await expectConnect(client0);
      await expectConnect(client1);
      await expectConnect(client2);

      client0.emit('private message', {
        content: 'some private infos: 42',
        to: client1.id
      });

      await expectEvent(client1, 'private message');

      client0.disconnect();
      client1.disconnect();
      client2.disconnect();
    });
  });
});
