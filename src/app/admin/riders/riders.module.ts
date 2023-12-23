import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { RiderDialogComponent } from './rider-dialog/rider-dialog.component';
import { RidersComponent } from './riders.component';
import { AgmCoreModule } from '@agm/core';

export const routes = [
  { path: '', component: RidersComponent, pathMatch: 'full' }
];
@NgModule({
  declarations: [
    RidersComponent,
    RiderDialogComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SharedModule,
    PipesModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAK4SToF8JnwGlIIi28zar7_A0cUiZi8uo',
      libraries: ["places"]
    })    
  ],
})
export class RidersModule { }
