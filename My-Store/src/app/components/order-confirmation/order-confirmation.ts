import { Component, inject } from '@angular/core';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  imports: [CommonModule, RouterModule],
  templateUrl: './order-confirmation.html',
  styleUrl: './order-confirmation.css',
})
export class OrderConfirmation {
  Api = inject(Api);
  http = inject(HttpClient)
  orderData: any;
  OrderSucceed:boolean=false;
  
  // Add toast properties
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'error';

  ngOnInit(): void {
    if (!localStorage.getItem('tokenClient') ) {
      this.showToastMessage('Please login first', 'error');
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1500);
      return;
    }
    this.orderData = this.Api.sharedOrderData;
    if (!this.orderData) {
      this.showToastMessage('No order data found', 'error');
      setTimeout(() => {
        this.router.navigate(['/cart-checkout']);
      }, 1500);
    }
  }

  constructor(private router:Router){};

  Confirm()
  {
    
    this.OrderSucceed = true
    this.http.post('http://localhost:3000/send-order',
      {
        order:this.orderData,
        from:this.orderData.checkout.checkoutData.customer.name,
        subject:"New Order",

      }).subscribe(
        {
          next: ()=>
          {
            console.log("order sent successfully to email")
          }
          ,
          error:(err:any)=>
          {
            this.showToastMessage('Order confirmed but email failed to send.', 'error');
            console.log(`failed sending to email error ${err}`);
          }

        }
      );
    
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