import { pool } from '../database.js';

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
}

export class UserModel {
  static async create(
    username: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    role: string = 'user'
  ): Promise<{id: number}> {
    try{    
      const result = await pool.query(
        `INSERT INTO users (username, password, first_name, last_name, role) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id`,
        [username, password, firstName, lastName, role]
      );
      return result.rows[0];
      } 
      catch (error) 
      {  
      console.error('Error in UserModel.create:', error);
      throw error;
      }

  }
static async findByUsername(username: string) {
   try{  
  const result = await pool.query(
    'SELECT * FROM users WHERE username = $1', 
    [username]
  );

  return result.rows[0] || null;
}
catch (error) 
      {  
      console.error('Error in UserModel.findByUsername:', error);
      throw error;
      }
}
  static async findById(id: number): Promise<User | null> {
    try{  
    const result = await pool.query(
      `SELECT id, username, first_name, last_name, role 
       FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }catch (error) 
      {  
      console.error('Error in UserModel.findById:', error);
      throw error;
      }
  }

  static async findAll(): Promise<User[]> {
    try{
      const result = await pool.query(
        `SELECT id, username, first_name, last_name, role FROM users`
      );
      return result.rows;

    }
    catch (error) 
      {  
      console.error('Error in UserModel.findAll:', error);
      throw error;
      }
  }
}