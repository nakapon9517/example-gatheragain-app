enum AppEnv {
  PROD = 'production',
  STAG = 'staging',
  DEV = 'dev',
}

module.exports = () => {
  switch (process.env.APP_ENV) {
    case AppEnv.PROD:
      return require('./configs/app.prod.json');
    case AppEnv.STAG:
      return require('./configs/app.stg.json');
    case AppEnv.DEV:
      return require('./configs/app.dev.json');
  }
}
