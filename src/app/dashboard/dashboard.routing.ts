import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';


export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'home', component: DashboardHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(DASHBOARD_ROUTES)],
  exports: [RouterModule]
})
export class DashbardRouting { }
