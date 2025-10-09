import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule
  ]
})
export class SalesModule { }
