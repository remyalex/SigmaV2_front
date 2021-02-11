import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatInputModule, MatFormFieldModule } from '@angular/material';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { EncuestaSatisfaccionCreateComponent } from './encuesta-satisfaccion-create/encuesta-satisfaccion-create.component';
import { EncuestaSatisfaccionListComponent } from './encuesta-satisfaccion-list/encuesta-satisfaccion-list.component';
import { EncuestaSatisfaccionEditComponent } from './encuesta-satisfaccion-edit/encuesta-satisfaccion-edit.component';
import { EncuestaSatisfaccionAttachComponent } from './encuesta-satisfaccion-attach/encuesta-satisfaccion-attach.component';

@NgModule({
  declarations: [
    EncuestaSatisfaccionCreateComponent,
    EncuestaSatisfaccionListComponent,
    EncuestaSatisfaccionEditComponent,
    EncuestaSatisfaccionAttachComponent,
  ],
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
    SeguridadModule
  ],
  exports: [
    EncuestaSatisfaccionCreateComponent,
    EncuestaSatisfaccionListComponent,
    EncuestaSatisfaccionEditComponent,
    EncuestaSatisfaccionAttachComponent,
  ]
})
export class EncuestaSatisfaccionModule { }