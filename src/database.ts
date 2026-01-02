import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables based on NODE_ENV
let envFile = '.env';
if (process.env.NODE_ENV === 'production') {
  envFile = '.env.production';
} else if (process.env.NODE_ENV === 'test') {
  envFile = '.env.test';
}
dotenv.config({ path: envFile });

console.log(`📁 Loading env from: ${envFile}`);
console.log(`🏃‍♂️ NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`🔐 DB User: ${process.env.POSTGRES_USER}`);

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  
  // Enable SSL for production AND test (RDS requires SSL)
ssl: false,
  
  // Connection pool settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection on startup
pool.on('connect', () => {
  console.log(`✅ Connected to ${process.env.POSTGRES_DB} on ${process.env.POSTGRES_HOST}`);
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
});

export { pool };