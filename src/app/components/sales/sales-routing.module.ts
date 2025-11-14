import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { RouteComponent } from './route/route.component';
import { SettingsComponent } from './settings/settings.component';
import { NotificationComponent } from './notification/notification.component';
import { salesAuthGuard } from 'src/app/utility/guards/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'post-login',
    canActivate: [salesAuthGuard],
    component: LayoutComponent,
    data: {
      title: 'Home',
    },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: HomeComponent,
        data: {
          title: 'Home',
        },
      },
      {
        path: 'product',
        component: ProductComponent,
        data: {
          title: 'Product',
        },
      },
      {
        path: 'bill',
        loadChildren: () =>
          import('./bill/bill.module').then((m) => m.BillModule),
      },
      {
        path: 'payment',
        loadChildren: () =>
          import('./payment/payment.module').then((m) => m.PaymentModule),
      },
      {
        path: 'route',
        component: RouteComponent,
        data: {
          title: 'Route',
        },
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: {
          title: 'Settings',
        },
      },
      {
        path: 'notification',
        component: NotificationComponent,
        data: {
          title: 'Settings',
        },
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
