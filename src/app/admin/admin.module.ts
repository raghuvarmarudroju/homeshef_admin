import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { SharedModule } from '../shared/shared.module'; 
import { AdminComponent } from './admin.component';
import { MenuComponent } from './components/menu/menu.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { FullScreenComponent } from './components/fullscreen/fullscreen.component'; 
import { MessagesComponent } from './components/messages/messages.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ProfileDialogComponent } from './components/profile-dialog/profile-dialog.component'; 
import { AuthGuard } from './../guards/auth.guard';

export const routes = [ 
  { 
    path: '', 
    component: AdminComponent, children: [
      { path: '', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),canActivate: [AuthGuard], data: { roles: [1,3,5,8] } }, 
      { path: 'menu-items', loadChildren: () => import('./menu-items/menu-items.module').then(m => m.MenuItemsModule),canActivate: [AuthGuard], data: { roles: [1,3] } },
      { path: 'stock', loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule),canActivate: [AuthGuard], data: { roles: [1,3,5,8] } },
      { path: 'sales', loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule),canActivate: [AuthGuard], data: { roles: [1,3] } },
      { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule),canActivate: [AuthGuard], data: { roles: [1,3,5],breadcrumb: 'Users' } },
      { path: 'riders', loadChildren: () => import('./riders/riders.module').then(m => m.RidersModule),canActivate: [AuthGuard], data: { roles: [1,3,5],breadcrumb: 'Riders' } },
      { path: 'cuisines', loadChildren: () => import('./cuisines/cuisines.module').then(m => m.CuisinesModule),canActivate: [AuthGuard], data: { roles: [1,3,5],breadcrumb: 'Cuisines' } },
      { path: 'ingredients', loadChildren: () => import('./ingredients/ingredients.module').then(m => m.IngredientsModule),canActivate: [AuthGuard], data: { roles: [1,3,5],breadcrumb: 'Ingredients' } },
      { path: 'reservations', loadChildren: () => import('./reservations/reservations.module').then(m => m.ReservationsModule),canActivate: [AuthGuard], data: { breadcrumb: 'Reservations' } },
      { path: 'customers', loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule),canActivate: [AuthGuard], data: { breadcrumb: 'Customers' } },
      { path: 'coupons', loadChildren: () => import('./coupons/coupons.module').then(m => m.CouponsModule),canActivate: [AuthGuard], data: { breadcrumb: 'Coupons' } },
      { path: 'withdrawal', loadChildren: () => import('./withdrawal/withdrawal.module').then(m => m.WithdrawalModule),canActivate: [AuthGuard], data: { breadcrumb: 'Withdrawal Requests' } },
      { path: 'analytics', loadChildren: () => import('./analytics/analytics.module').then(m => m.AnalyticsModule), data: { breadcrumb: 'Analytics' } },
      { path: 'refund', loadChildren: () => import('./refund/refund.module').then(m => m.RefundModule),canActivate: [AuthGuard], data: { breadcrumb: 'Refund Requests' } },
      { path: 'followers', loadChildren: () => import('./followers/followers.module').then(m => m.FollowersModule),canActivate: [AuthGuard], data: { breadcrumb: 'Followers' } },
      { path: 'support', loadChildren: () => import('./support/support.module').then(m => m.SupportModule),canActivate: [AuthGuard], data: { breadcrumb: 'Support' } },
      { path: 'reviews', loadChildren: () => import('./reviews/reviews.module').then(m => m.ReviewsModule),canActivate: [AuthGuard], data: { breadcrumb: 'Reviews' } }  
    ]
  } 
];


@NgModule({
  declarations: [
    AdminComponent,
    MenuComponent,
    UserMenuComponent,
    FullScreenComponent,
    MessagesComponent,
    BreadcrumbComponent,
    ProfileDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAK4SToF8JnwGlIIi28zar7_A0cUiZi8uo',
      libraries: ["places"]
    })
  ]
})
export class AdminModule { }
