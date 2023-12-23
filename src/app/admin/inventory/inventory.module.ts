import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { SharedModule } from '../../shared/shared.module';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { StockComponent } from './stock/stock.component';
import { BusinessStockComponent } from './business-stock/business-stock.component';
import { StoreStockComponent } from './store-stock/store-stock.component';
import { TransferStockComponent } from './transfer-stock/transfer-stock.component';

export const routes = [ 
  { path: '', redirectTo: 'list', pathMatch: 'full'},
  { path: 'list', component: StockComponent, data: { breadcrumb: 'Stock' } },
  { path: 'transfer-stock', component: TransferStockComponent, data: { breadcrumb: 'Transfer Stock' } },
  { path: 'business-level/:id', component: BusinessStockComponent, data: { breadcrumb: 'Business Stock' } },
  { path: 'store-level/:id', component: StockComponent, data: { breadcrumb: 'Store Stock' } },
];

@NgModule({
  declarations: [
    StockComponent,
    BusinessStockComponent,
    StoreStockComponent,
    TransferStockComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [
    RouterModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class InventoryModule { }
