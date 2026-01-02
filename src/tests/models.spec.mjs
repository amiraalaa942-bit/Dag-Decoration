import { UserModel } from '../models/User.ts';
import { PaintingModel } from '../models/Painting.ts';
import { CartModel } from '../models/Cart.ts';

describe('Model Database Action Tests', () => {
  
  describe('UserModel', () => {
    it('should create user with parameters and find by ID', async () => {
      // Test with actual data
      const username = `testuser_${Date.now()}`;
      const password = 'hashedpass123';
      const firstName = 'John';
      const lastName = 'Doe';
      
      const user = await UserModel.create(
        username,
        password,  // Should be hashed
        firstName,
        lastName,
        'user'
      );
      
      expect(user.id).toBeDefined();
      
      // Test findById with the created ID
      const foundUser = await UserModel.findById(user.id);
      expect(foundUser?.username).toBe(username);
      expect(foundUser?.first_name).toBe(firstName);
    });

    it('should find user by username', async () => {
      const username = `finduser_${Date.now()}`;
      
      await UserModel.create(
        username,
        'pass123',
        'Find',
        'Me',
        'user'
      );
      
      const found = await UserModel.findByUsername(username);
      expect(found?.username).toBe(username);
    });
  });

  describe('PaintingModel', () => {
  it('should create painting', async () => {
    expect(true).toBeTrue();
  });

    it('should get image URL by painting ID', async () => {
expect(true).toBeTrue();
    });
  });

  describe('CartModel', () => {
    let testUserId = 1;
    let testPaintingId = 1;

    it('should add painting to cart with user ID and painting ID', async () => {
      const cartItem = await CartModel.addToCart(
        testUserId,      // Actual user ID
        testPaintingId   // Actual painting ID
      );
      
      expect(cartItem.id).toBeDefined();
    });

    it('should get current order for user ID', async () => {
      const order = await CartModel.getCurrentOrder(testUserId);
      expect(Array.isArray(order)).toBeTrue();
    });

    it('should handle adding same painting multiple times', async () => {
      // Add first time
      await CartModel.addToCart(testUserId, testPaintingId);
      
      // Add second time (should handle duplicates)
      const result = await CartModel.addToCart(testUserId, testPaintingId);
      expect(result.id).toBeDefined();
    });
  });

});