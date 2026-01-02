import express from "express";
import { authenticateJWT } from "../middleware/authentication.js";
import { CartModel } from '../models/Cart.js';

const router = express.Router();

router.post('/cart/add', authenticateJWT, async (req, res) => {
  try {
    const { paintingId } = req.body; 
    const userid = (req as any).user.id;
    
    let CartInfocheck = await CartModel.addToCart(userid, paintingId);
    
    res.json({ 
      message: 'Added to cart successfully',
      cartItemId: CartInfocheck.id
    });
  } catch (error) {
    console.error('🚨 CART ERROR:', error);
    res.status(500).json({ error: 'Failed to add to cart: '  + (error as Error).message });
  }
});


router.get('/cart', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    let CartInfo = await CartModel.getCurrentOrder(userId);
    res.status(200).send(CartInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get cart' });
  }
});


router.delete('/cart/:id', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const {id} = req.params;
    let Id = parseInt(id);
    let CartInfo = await CartModel.deleteCartItem(userId,Id);
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete cart' });
  }
});

router.put('/cart/:id',authenticateJWT,async(req,res)=>
{
  try{
    const userId = (req as any).user.id;
    const {quantity}=req.body;
    const {id} = req.params;
    let Id = parseInt(id);
    let updatedCart = await CartModel.UpdateCartQuantity(quantity,userId,Id);

    res.status(200).send(updatedCart);


  }
  catch(error)
  {
    res.status(500).json({ error: 'Failed to update cart' });

  }

})

export default router;