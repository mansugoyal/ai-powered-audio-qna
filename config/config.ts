
export default {
    port: 'PORT',
    nodeEnv: 'NODE_ENV',
    postgresConfig: {
      host: 'POSTGRES_HOST',
      port: 'POSTGRES_PORT',
      username: 'POSTGRES_USER',
      password: 'POSTGRES_PASSWORD',
      database: 'POSTGRES_DB',
    },
    dirs: {
      migrations: 'TYPEORM_MIGRATIONS',
      entities: 'TYPEORM_ENTITIES',
    },
    smtp: {
      host: 'EMAIL_HOST',
      pass: 'EMAIL_PASS',
      port: 'EMAIL_PORT',
      user: 'EMAIL_USER',
    },
    app: {
      name: 'APP_NAME',
      host: 'APP_HOST',//
      schema: 'APP_SCHEMA',//
      routePrefix: 'APP_ROUTE_PREFIX',//
      port: 'APP_PORT',//
    }
  };