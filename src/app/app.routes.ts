import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { MenuComponent } from './menu/menu.component';
import { FlavorComponent } from './flavor/flavor.component';
import { PaymentComponent } from './payment/payment.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
    {path:'',component:LoginPageComponent},
    {path:'home/:orderNum',component:HomePageComponent},
    {path:'menu',component:MenuComponent},
    {path:'flavor',component:FlavorComponent},
    {path:'cart/:orderNum',component:CartComponent},
    {path:'payment/:orderNum',component:PaymentComponent},
    {path:'success',component:LoginPageComponent}

];
