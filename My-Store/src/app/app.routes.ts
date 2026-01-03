import { Routes } from '@angular/router';
import { Paintings } from './components/paintings/paintings';
import {Admin} from './components/admin/admin';
import { OrderConfirmation } from './components/order-confirmation/order-confirmation';
import { LogIn } from './components/log-in/log-in';
import { Register } from './components/register/register';
import { CartCheckout } from './components/cart-checkout/cart-checkout';
console.log('LogIn component:', LogIn); 
export const routes: Routes = 
[
    {path:'',component:LogIn},
    {path:'register',component:Register},
    {path:'paintings',component:Paintings},
    {path:'admin',component:Admin},
    { path: 'cart', component: CartCheckout },
    {path:'confirmation',component:OrderConfirmation},
    {path:'**',component:LogIn},
];
