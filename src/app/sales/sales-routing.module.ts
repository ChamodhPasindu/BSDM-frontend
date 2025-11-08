import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { RouteComponent } from './route/route.component';
import { SettingsComponent } from './settings/settings.component';
import { NewComponent } from './customer/new/new.component';
import { ExistingComponent } from './customer/existing/existing.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'post-login',
    component: LayoutComponent,
    data: {
      title: 'Home',
    },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // Add this
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
        path: 'new',
        component: NewComponent,
        data: {
          title: 'New Customer',
        },
      },
      {
        path: 'existing',
        component: ExistingComponent,
        data: {
          title: 'Existing Customer',
        },
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
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
