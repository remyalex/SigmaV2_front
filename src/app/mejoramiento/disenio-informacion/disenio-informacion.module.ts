import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { SeguridadModule } from '../../seguridad/seguridad.module';
import { BrowserModule } from '@angular/platform-browser';
import { DisenioInformacionEditarComponent } from './disenio-informacion-editar/disenio-informacion-editar.component';
import { DisenioInformacionVerComponent } from './disenio-informacion-ver/disenio-informacion-ver.component';

@NgModule({
  declarations: [
    DisenioInformacionEditarComponent,
    DisenioInformacionVerComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
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
    DisenioInformacionEditarComponent,
    DisenioInformacionVerComponent
  ]
})
export class DisenioInformacionModule { }
