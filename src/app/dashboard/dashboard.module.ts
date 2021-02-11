import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DashboardUrlComponent } from './dashboard-url/dashboard-url.component';

@NgModule({
  declarations: [
    DashboardUrlComponent,
    DashboardHomeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxChartsModule,
    PerfectScrollbarModule,
    SharedModule,
  ],
  exports: [
    DashboardHomeComponent,
    DashboardUrlComponent,
  ]
})
export class DashboardModule { }
