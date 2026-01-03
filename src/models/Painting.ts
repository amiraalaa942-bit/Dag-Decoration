import { pool } from '../database.js';

export interface Painting {
  picId: number;
  name: string;
  price: number;
  height: number;
  width: number;
  picUrl: string;
}

export class PaintingModel {
  static async create(
    name: string,
    price: number,
    height: number,
    width: number,
    picUrl: string
  ): Promise<{picId: number, name: string, price: number}>  {
   try
   {
     const result = await pool.query(
       `INSERT INTO paintings (name, price, height, width, picUrl) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING picId,name,price,picUrl`,
       [name, price, height, width, picUrl]
     );
     return result.rows[0];

   }catch (error) 
      {  
      console.error('Error in PaintingModel.findById:', error);
      throw error;
      }
  }

  static async findById(id: number): Promise<Painting | null> {
   try
   {
     const result = await pool.query(
       `SELECT picId, name, price, height, width, picUrl 
        FROM paintings WHERE picId = $1 `,
       [id]
     );
     return result.rows[0] || null;

   }
   catch (error) 
      {  
      console.error('Error in PaintingModel.findById:', error);
      throw error;
      }
  }

  static async findAll(): Promise<Painting[]> {
    try{
      const result = await pool.query(
        `SELECT * FROM paintings`
      );
      return result.rows;

    }
    catch (error) 
      {  
      console.error('Error in PaintingModel.findAll:', error);
      throw error;
      }
  }

  static async getImageUrl(id:number):Promise<{picurl:string} | null>
  {
    try{

        const paintingImage = await pool.query(
            'SELECT picUrl FROM paintings WHERE picId = $1',
            [id]
        );
    if (paintingImage.rows.length === 0) {
        return null;
    }
    return { picurl: paintingImage.rows[0].picurl };
    }
    catch (error) 
      {  
      console.error('Error in PaintingModel.getImageUrl:', error);
      throw error;
      }

  }
  static async deletePainting(picid:number):Promise<any>
  {
    try{
      let result = await pool.query(
        `DELETE FROM paintings WHERE picId = $1`,[picid]
      );
      return result.rows[0]

    }
    catch(error)
    {
      throw error;
    }
  }
}