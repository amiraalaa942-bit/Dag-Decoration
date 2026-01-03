import { Component, inject } from '@angular/core';
import { Cart } from '../cart/cart';
import { Checkout } from '../checkout/checkout';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart-checkout',
  imports: [CommonModule, Cart, Checkout, RouterModule],
  templateUrl: './cart-checkout.html',
  styleUrl: './cart-checkout.css',
})
export class CartCheckout {
  Api = inject(Api);
  cartDataFromCart: any;
  checkoutDataFromCheckout: any;
  
  // Add toast properties
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'error';

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (!localStorage.getItem('tokenClient')) {
      this.showToastMessage('Please login first', 'error');
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1500);
      return;
    }
  }

  handleCartData(data: any) {
    this.cartDataFromCart = data;

  }

  handleCheckoutData(data: any) {
    this.checkoutDataFromCheckout = data;
    if (!this.cartDataFromCart || !this.cartDataFromCart || this.cartDataFromCart.length === 0) {
      this.showToastMessage('Your cart is empty. Add items before checkout.', 'error');
      return;
    }
    const orderData = {
      cart: this.cartDataFromCart,
      checkout: data,
      orderDate: new Date().toISOString()
    };

    if (this.Api) {
      this.Api.sharedOrderData = orderData;
    }
    this.showToastMessage('Order confirmed! Redirecting...', 'success');
    setTimeout(() => {
      this.router.navigate(['/confirmation']);
    }, 1500);
  }


  // Add toast method
  private showToastMessage(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}