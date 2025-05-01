import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { Database } from './types';
export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => {
      try {
        const dialect = new PostgresDialect({
          pool: new Pool({
            user: process.env.BD_USER || 'root',
            host: process.env.BD_HOST || 'localhost',
            database: process.env.BD_DATABASE || '',
            password: process.env.BD_PASSWORD || '',
            port: Number(process.env.BD_PORT) || 3306,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
          }),
        });
        return new Kysely<Database>({
          log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : [],
          dialect,
        });
      } catch (e) {
        console.log(e);
        return null;
      }
    },
  },
];
