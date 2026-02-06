import { Routes } from '@angular/router';

import { UserLayout } from './layouts/user-layout/user-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';

import { Homepage } from './user/homepage/homepage';
import { Shop } from './user/shop/shop';
import { Details } from './user/details/details';
import { Register } from './user/register/register';
import { Login as UserLogin } from './user/login/login';

import { Home } from './admin/home/home';
import { ProductList } from './admin/product-list/product-list';
import { Orders } from './admin/orders/orders';
import { Users } from './admin/users/users';
import { Login as AdminLogin } from './admin/login/login';
import { Cart } from './user/cart/cart';
import { Address } from './user/address/address';
import { MyOrders } from './user/my-orders/my-orders';
import { Profile } from './user/profile/profile';
import { Dresses } from './user/dresses/dresses';
import { Tops } from './user/tops/tops';
import { Bestseller } from './user/bestseller/bestseller';
import { Newarrivals } from './user/newarrivals/newarrivals';
import { Newarrivalsc } from './user/newarrivalsc/newarrivalsc';

export const routes: Routes = [
  {
    path: 'login',
    component: UserLogin,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'admin/login',
    component: AdminLogin,
  },

  {
    path: '',
    component: UserLayout,
    children: [
      { path: '', component: Homepage },
      { path: 'shop', component: Shop },
      { path: 'product/:id', component: Details },
      { path: 'cart', component: Cart },
      { path: 'address', component: Address },
      { path: 'my-orders', component: MyOrders },
      { path: 'profile', component: Profile },
      { path: 'newarrivals', component: Newarrivalsc },
      { path: 'bestseller', component: Bestseller },
      { path: 'tops', component: Tops },
      { path: 'dresses', component: Dresses },
    ],
  },

  {
    path: 'admin',
    component: AdminLayout,
    children: [
      { path: 'home', component: Home },
      {
        path: 'product_list',
        component: ProductList,
        runGuardsAndResolvers: 'always',
      },
      { path: 'orders', component: Orders },
      { path: 'users', component: Users },
    ],
  },
];
