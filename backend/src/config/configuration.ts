export enum Env {
  Prod = 1,
  Dev,
  Test
}

function parseNodeEnv(input: string): number | undefined {
  let env: number | undefined;
  if (input === 'dev') {
    env = Env.Dev;
  } else if (input === 'prod') {
    env = Env.Prod;
  } else if (input === 'test') {
    env = Env.Test;
  }
  return env;
}

export default () => ({
  port: parseInt(process.env.PORT!, 10) || '3000',
  env: parseNodeEnv(process.env.NODE_ENV!) || Env.Dev,
  Env
});
