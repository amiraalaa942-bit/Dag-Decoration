import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class Api {
  TotalAmount:number = 0;
  sharedOrderData: any = null;
  cartItems: any[] = [];
  
  ClientToken =  localStorage.getItem('tokenClient');
  
  constructor(private http: HttpClient){}
    setCartData(paintingId:number): void {
      this.http.post('http://localhost:3000/cart/add',{paintingId: paintingId }  ,  {
      headers: { 'Authorization': `Bearer ${this.ClientToken}` }
    }).subscribe({
      next: () => {
        console.log('Added to cart successfully');
      },
      error: (error) => {
        console.error('failed add to cart:', error);
      }
  });

    }

    getCartData(): Promise<Painting[]> {


        return new Promise((resolve, reject) => {
    this.http.get<Painting[]>('http://localhost:3000/cart',
      {
        headers : {'Authorization' : `Bearer ${this.ClientToken} `}
      }
    )
      .subscribe({
        next: (data) => {
          this.cartItems = data;
          this.GetTotalPrice();
          resolve(this.cartItems);
        },
        error: (error) => {
          console.error('Error loading cart:', error);
          reject(error);
        }
      });
  });
}

deleteCartItem(cartid:number):Promise<void>
{
   return new Promise((resolve,reject) => this.http.delete(`http://localhost:3000/cart/${cartid}`, {
    headers: { 'Authorization': `Bearer ${this.ClientToken}` }
  }).subscribe({
      next: () => {
        console.log('deleted from cart successfully');
        resolve()
      },
      error: (error) => {
        console.error('failed delete from cart:', error);

        reject(error)
      }
    }))
}
GetTotalPrice():void
{
  this.TotalAmount = 60;
  this.cartItems.forEach(painting => {
    this.TotalAmount += painting.Price * painting.Quantity;
  });
}

getCurrentUser() {
    const adminToken = localStorage.getItem('tokenAdmin') ;
    const userToken = localStorage.getItem('tokenClient');


    if(adminToken)
    {
      return this.http.get('http://localhost:3000/current-user', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

    }
    else if(userToken)
    {
        return this.http.get('http://localhost:3000/current-user', {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
    }
    return throwError(() => new Error('No token found'));
  }
  
  updateCart(id:number,quantity:number):Promise<Painting[]>
  {
    return new Promise((resolve,reject)=>
     this.http.put<any>(`http://localhost:3000/cart/${id}`,
      {quantity:quantity},
    {
      headers: {'Authorization' : `Bearer ${this.ClientToken}`}
    }).subscribe(
      {
        next:(res)=>
        {
          this.cartItems = res;
          resolve(res);
        }
        ,
        error:(err)=>
        {
          reject(err);
        }
    
      }
    ));
      
      
  }
}
