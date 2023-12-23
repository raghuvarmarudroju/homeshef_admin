import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';
import { PipesModule } from '../../theme/pipes/pipes.module';

import { AgmCoreModule } from '@agm/core';
import { IngredientsComponent } from './ingredients.component';
import { IngredientDialogComponent } from './ingredient-dialog/ingredient-dialog.component';

export const routes = [
  { path: '', component: IngredientsComponent, pathMatch: 'full' }
];
@NgModule({
  declarations: [
    IngredientsComponent,
    IngredientDialogComponent
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
export class IngredientsModule { }
