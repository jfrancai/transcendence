enum Env {
  DEV = 1,
  PROD,
  MAX_ENV
}

function checkNodeEnv(toCheck: string | undefined): number {
  let ret = 0;
  if (toCheck && toCheck === 'development') {
    ret = Env.DEV;
  } else if (toCheck && toCheck === 'production') {
    ret = Env.PROD;
  }
  return ret;
}

export { Env, checkNodeEnv };
