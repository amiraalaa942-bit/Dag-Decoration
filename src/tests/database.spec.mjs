import { pool } from '../database';

describe('Database Connection', () => {
  it('should connect to database', async () => {
    const result = await pool.query('SELECT NOW() as time');
    expect(result.rows[0].time).toBeDefined();
  });

  it('should have users table', async () => {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      )
    `);
    expect(result.rows[0].exists).toBeTrue();
  });

  it('should have paintings table', async () => {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'paintings'
      )
    `);
    expect(result.rows[0].exists).toBeTrue();
  });
});