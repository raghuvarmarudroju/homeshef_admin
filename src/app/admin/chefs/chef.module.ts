import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { ChefsComponent } from './chefs.component';
import { ChefDialogComponent } from './chef-dialog/chef-dialog.component';
import { AgmCoreModule } from '@agm/core';
import { DetailsDialogComponent } from './details-dialog/details-dialog.component';
import { ApprovalsComponent } from './approvals/approvals.component';

export const routes = [
  { path: '', redirectTo: 'list',component: ChefsComponent, pathMatch: 'full' },
  { path: 'list', component: ChefsComponent, data: { breadcrumb: 'Chefs' } },
  { path: 'approvals', component: ApprovalsComponent, data: {roles: [1,3], breadcrumb: 'Approvals' } },
];

@NgModule({
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
  declarations: [
    ChefsComponent,
    ChefDialogComponent,
    DetailsDialogComponent,
    ApprovalsComponent
  ] 
})
export class ChefModule { }
