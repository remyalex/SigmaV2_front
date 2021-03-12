import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DashboardUrlComponent } from './dashboard-url/dashboard-url.component';
import { AutoprogramarComponent } from './autoprogramar/autoprogramar.component';
import { ModalrComponent } from './modalr/modalr.component';
import { ModalCargandoComponent } from './modal-cargando/modal-cargando.component';
//import { FichaDiagnosticoComponent } from './ficha-diagnostico/ficha-diagnostico.component';

@NgModule({
  declarations: [
    DashboardUrlComponent,
    DashboardHomeComponent,
    AutoprogramarComponent,
    ModalrComponent,
    ModalCargandoComponent,
    //FichaDiagnosticoComponent,
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
    AutoprogramarComponent,
  ]
})
export class DashboardModule { }
