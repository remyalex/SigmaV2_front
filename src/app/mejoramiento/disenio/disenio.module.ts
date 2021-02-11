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
import { DisenioDetailComponent } from './disenio-detail/disenio-detail.component';
import { DisenioEditComponent } from './disenio-edit/disenio-edit.component';
import { DisenioCreateComponent } from './disenio-create/disenio-create.component';
import { DisenioInformacionModule } from '../disenio-informacion/disenio-informacion.module';


@NgModule({
  declarations: [
    DisenioEditComponent,
    DisenioCreateComponent,
    DisenioDetailComponent
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
    DisenioInformacionModule
  ],
  exports: [
    DisenioEditComponent,
    DisenioCreateComponent,
    DisenioDetailComponent
  ]
})
export class DisenioModule { }
