import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product/product.component';
import { SalesStockComponent } from './sales-stock/sales-stock.component';
import { StockComponent } from './stock/stock.component';
import { ReturnStockComponent } from './return-stock/return-stock.component';
import { InventoryManagementRoutingModule } from './inventory-management.routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [CommonModule, InventoryManagementRoutingModule, SharedModule],
  declarations: [
    ProductComponent,
    SalesStockComponent,
    StockComponent,
    ReturnStockComponent,
  ],
})
export class InventoryManagementModule {}
