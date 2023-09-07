import Config from './configuration';

describe('Configuration', () => {
  beforeEach(async () => {});

  describe('env', () => {
    it('should return dev env', () => {
      process.env.NODE_ENV = 'dev';
      const config = Config();
      expect(config.env).toBe(config.Env.Dev);
    });
    it('should return prod env', () => {
      process.env.NODE_ENV = 'prod';
      const config = Config();
      expect(config.env).toBe(config.Env.Prod);
    });
    it('should return test env', () => {
      process.env.NODE_ENV = 'test';
      const config = Config();
      expect(config.env).toBe(config.Env.Test);
    });
    it('should return dev env with invalid NODE_ENV', () => {
      process.env.NODE_ENV = 'notValidEnv';
      const config = Config();
      expect(config.env).toBe(config.Env.Dev);
    });
  });
});
