import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Api } from '../../services/api';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  Api = inject(Api);
  @Output() checkoutData = new EventEmitter<any>();
  @Input() cartData:any;
  Name:string=''
  Phone:number=0
  Location:string=''

  cartInfo: any[] = []
  TotalPayment:number = 0
  constructor(private router: Router) {}

   ngOnInit(): void 
    {
      if (!localStorage.getItem('tokenClient') ) {
        this.router.navigate(['/']);
      }
      
      
    }
    
    logFieldChange(fieldName: string, value: any): void {
      console.log(`${fieldName} changed to:`, value);
    }
    
    
    
    Continue()
    {
      const checkoutData = {
          customer: {
            name: this.Name,
            phone: this.Phone,
            location: this.Location
          },
          cart: this.cartData,
        };
        
        this.checkoutData.emit({
          checkoutData
      });
    }

}
