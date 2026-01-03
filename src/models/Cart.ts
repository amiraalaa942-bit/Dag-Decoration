import { pool } from '../database.js';

export interface CartItem {
  id: number;
  cart_id: number;
  painting_id: number;
  quantity: number;
  status?: string;
}

export interface CartWithDetails {
  id: number; 
  picid: number;
  picname: string;
  price: number;
  height: number;
  width: number;
  quantity: number;
}

export class CartModel {
  static async addToCart(
    userId: number,
    paintingId: number
  ): Promise<{id: number}> {
    try
    {
            let cartResult = await pool.query(
        `SELECT id FROM cart WHERE userid = $1 LIMIT 1`,
        [userId]
      );
      
      let cartId;
      if (cartResult.rows.length === 0) {
        // Create cart if it doesn't exist
        const newCart = await pool.query(
          `INSERT INTO cart (userid,paintingid) VALUES ($1,$2) RETURNING id`,
          [userId,paintingId]
        );
      } 

      const existing = await pool.query(
       `SELECT ci.* FROM cart_items ci 
        JOIN cart c ON ci.cart_id = c.id 
        WHERE ci.painting_id = $1 AND c.userid = $2`,
        [paintingId, userId]
      );
      if (existing.rows.length > 0) {
        // Update quantity
        const result = await pool.query(
        `UPDATE cart_items ci 
        SET quantity = ci.quantity + 1 
        FROM cart c 
        WHERE ci.painting_id = $1 AND ci.cart_id = c.id AND c.userid = $2 
        RETURNING ci.id`,
          [paintingId, userId]
        );
        return result.rows[0];
      } else {
        // Insert new item
        const result = await pool.query(
          `INSERT INTO cart_items (cart_id, painting_id, quantity) 
          VALUES ((SELECT id FROM cart WHERE userid = $1 LIMIT 1), $2, 1) 
          RETURNING id`,
          [userId, paintingId]
        );
        return result.rows[0];
         }
      }   
      catch (error) 
      {  
      console.error('Error in CartModel.addToCart:', error);
      throw error;
      }
  }

  static async getCurrentOrder(userId: number): Promise<CartWithDetails[]> {
    try{
      const result = await pool.query(
          `SELECT ci.id, p.picid, p.name, p.price, p.height, p.width, ci.quantity
          FROM cart_items ci
          INNER JOIN paintings p ON ci.painting_id = p.picid
          INNER JOIN cart c ON ci.cart_id = c.id
          WHERE c.userid = $1`,
        [userId]
      );
      return result.rows;

    }
      catch (error) 
      {  
      console.error('Error in CartModel.getCurrentOrder:', error);
      throw error;
      }

  }

  static async deleteCartItem(userid:number, cartid:number):Promise<CartWithDetails[]>
  {
    try{
      
      let result = await pool.query
      (`DELETE FROM cart_items ci 
 USING cart c 
 WHERE ci.id = $2 AND ci.cart_id = c.id AND c.userid = $1 
 RETURNING ci.*`,
        [userid,cartid]
      )
      return result.rows[0];
    }
    catch(error)
    {
      throw error;
    }

  }

  static async UpdateCartQuantity(quantity:number,userId:number,id:number):Promise<CartItem[]>
  {
    try
    {
      const result = await pool.query(
`UPDATE cart_items ci 
 SET quantity = $1
 FROM cart c 
 WHERE ci.id = $2 AND ci.cart_id = c.id AND c.userid = $3 
 RETURNING ci.id`,
                [quantity,id, userId]
              );
        return result.rows[0];
    }
    catch(err)
    {
      throw err;

    }
  }
}