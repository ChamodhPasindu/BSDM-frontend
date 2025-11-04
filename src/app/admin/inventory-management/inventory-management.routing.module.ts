import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { StockComponent } from './stock/stock.component';
import { ReturnStockComponent } from './return-stock/return-stock.component';
import { SalesStockComponent } from './sales-stock/sales-stock.component';
import { ItemBatchComponent } from './item-batch/item-batch.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Inventory',
    },
    children: [
      {
        path: 'item-batch',
        component: ItemBatchComponent,
        data: {
          title: 'Item & Batch',
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
        path: 'stock',
        component: StockComponent,
        data: {
          title: 'Stock',
        },
      },
      {
        path: 'sales-stock',
        component: SalesStockComponent,
        data: {
          title: 'Sales Stock',
        },
      },
      {
        path: 'return-stock',
        component: ReturnStockComponent,
        data: {
          title: 'Return Stock',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryManagementRoutingModule {}
