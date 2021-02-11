import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PredisenioCreateComponent } from './predisenio-create/predisenio-create.component';
import { PredisenioEditComponent } from './predisenio-edit/predisenio-edit.component';
import { PredisenioDetailComponent } from './predisenio-detail/predisenio-detail.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { SeguridadModule } from '../../seguridad/seguridad.module';
import { UbicarApiqueComponent } from './ubicar-apique/ubicar-apique.component';

@NgModule({
  declarations: [PredisenioCreateComponent, PredisenioEditComponent, PredisenioDetailComponent, UbicarApiqueComponent],
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
    SeguridadModule
  ],
  exports: [
    PredisenioCreateComponent, PredisenioEditComponent, PredisenioDetailComponent
  ]
})
export class PredisenioModule { }
