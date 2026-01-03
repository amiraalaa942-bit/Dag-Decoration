import { Component, inject, Output, EventEmitter, } from '@angular/core';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule , RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  @Output() cartData = new EventEmitter<any>();

  Api = inject(Api);
  cart: Painting[] = [];
  Actualquantity=0;
  TotalAmount = 60
   // Add toast properties
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'error';

  constructor(private router: Router) {}

  ngOnInit(): void 
  {
    if (!localStorage.getItem('tokenClient') ) {
      this.router.navigate(['/']);
    }
    this.GetCart();
  }
  
  CalculatePayment()
  {
    this.TotalAmount = 60;
    for(let item of this.cart)
      {
        this.TotalAmount += item.quantity * item.price
      }

  }
  
  async GetCart(): Promise<void> 
  {
    this.cart = await this.Api?.getCartData();
    console.log("cart has:",this.cart)
    this.CalculatePayment();
    this.cartData.emit(
      {
        items: this.cart,
        TotalAmount: this.TotalAmount
      }
    );
    
    }
   async increase(picid:number)
    {
      
      const painting = this.cart.find(p => p.picid === picid);
        if (painting) {
          painting.quantity++;     
          this.CalculatePayment();
          this.showToastMessage('your cart has been updated', 'success');

          await this.Api?.updateCart(painting['id'],painting.quantity)

          this.cartData.emit(
          {
            items: this.cart,
            TotalAmount: this.TotalAmount
          }
      );
        }


    }

async decrease(picid:number)
{
  
  let painting = this.cart.find(p => p.picid === picid);
  
  if(painting && painting.quantity === 1)
  {
    await this.Api?.deleteCartItem(painting['id']);
    this.cart = this.cart.filter(item => item.picid !== picid);
    this.showToastMessage(`painting ${painting['name']} has been removed from your cart`, 'success');

    this.CalculatePayment();
      this.cartData.emit(
    {
      items: this.cart,
      TotalAmount: this.TotalAmount
    }
  );
  }
  if (painting && painting.quantity > 1) { 
    painting.quantity--;
    this.showToastMessage('your cart has been updated', 'success');

    this.CalculatePayment();
   await this.Api?.updateCart(painting['id'],painting.quantity)

       this.cartData.emit(
        {
          items: this.cart,
          TotalAmount: this.TotalAmount
        }
      );
  }

  
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
