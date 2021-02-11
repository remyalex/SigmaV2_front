import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramarListComponent } from './programar-list/programar-list.component';
import { ProgramarDetalleListComponent } from './programar-detalle-list/programar-detalle-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { ConfirmCapacidadComponent } from './confirm-capacidad/confirm-capacidad.component';

@NgModule({
  declarations: [ProgramarListComponent, ProgramarDetalleListComponent, ConfirmCapacidadComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    PipesModule,
    HttpClientModule,
    NgxDatatableModule,
    SharedModule,
    SeguridadModule,
  ],
  exports: [
    ProgramarListComponent,
    ProgramarDetalleListComponent,
    ConfirmCapacidadComponent
  ]
})
export class ProduccionMezclaModule { }
