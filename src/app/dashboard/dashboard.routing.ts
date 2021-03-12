import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { AutoprogramarComponent } from "./autoprogramar/autoprogramar.component";


export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'home', component: DashboardHomeComponent
  },
  {
    path: 'autoprog', component: AutoprogramarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(DASHBOARD_ROUTES)],
  exports: [RouterModule]
})
export class DashboardRouting { }
