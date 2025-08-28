import { Routes } from '@angular/router';

import { AuthGuard } from './auth.guard'; // ✅ correct import
import { SellerAuthComponent } from './seller-auth/seller-auth.component';
import { SellerAddProductComponent } from './seller-add-product/seller-add-product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';



export const routes: Routes = [


   {path:'seller', component:SellerAuthComponent},
   { path: 'products', component: ProductListComponent },
   { path: 'update-product/:id', component: UpdateProductComponent  },
   { path: 'login', component: LoginComponent  },
   { path: 'home', component: HomeComponent  },
 
 { path: 'seller-home',
    loadComponent: () =>
      import('./seller-home/seller-home.component').then(m => m.SellerHomeComponent),
    canActivate: [AuthGuard],  
  },

  {
    path: 'seller-auth',
    loadComponent: () =>
      import('./seller-auth/seller-auth.component').then(m => m.SellerAuthComponent),
  },
   {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'product-list',
    loadComponent: () =>
      import('./product-list/product-list.component').then(m => m.ProductListComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'seller-add-product',
    loadComponent: () =>
      import('./seller-add-product/seller-add-product.component').then(m => m.SellerAddProductComponent),
    canActivate: [AuthGuard],
  },
];
