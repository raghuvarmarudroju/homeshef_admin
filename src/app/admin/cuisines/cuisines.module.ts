import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { CuisineDialogComponent } from './cuisine-dialog/cuisine-dialog.component';
import { CuisinesComponent } from './cuisines.component';
import { AgmCoreModule } from '@agm/core';

export const routes = [
  { path: '', component: CuisinesComponent, pathMatch: 'full' }
];
@NgModule({
  declarations: [
    CuisinesComponent,
    CuisineDialogComponent
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
  ]
})
export class CuisinesModule { }
