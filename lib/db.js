import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.SSL === 'true' ? { rejectUnauthorized: false } : false,
});

export default pool;
