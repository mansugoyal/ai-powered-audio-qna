import 'dotenv/config'; // Ensure this is at the top
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from 'config';
import Container from 'typedi';
import { useContainer } from 'routing-controllers';

useContainer(Container); // Ensure using routing-controllers' useContainer
console.log("Config module:", config);

// Explicitly define the expected structure
const postgresConfig = config.get<{
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}>('postgresConfig');

const nodeEnv: string = config.get<string>('nodeEnv')?.toLowerCase();
const isProdOrPreprod = nodeEnv === 'prod' || nodeEnv === 'preprod';

const sslRejectUnauthorized: boolean = config.get<boolean>('postgresSslRejectUnauthorized');

export const AppDataSource = new DataSource({
  ...postgresConfig,
  type: 'postgres',
  ssl: isProdOrPreprod ? { rejectUnauthorized: sslRejectUnauthorized } : false,
  synchronize: false,
  logging: true,
  entities: ['src/models/**/*{.ts,.js}'],
  migrations: ['src/migrations/**/*{.ts,.js}', 'src/seeders/migrations/**/*{.ts,.js}'],
});

// Register DataSource in TypeDI container
Container.set(DataSource, AppDataSource);

// Uncomment to initialize or run migrations
// AppDataSource.initialize().then(() => console.log("Database Initialized"));
// AppDataSource.runMigrations().then(() => console.log("Migrations Executed"));
