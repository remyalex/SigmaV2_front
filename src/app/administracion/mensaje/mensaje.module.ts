import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MensajeAdminComponent } from './mensaje-admin/mensaje-admin.component';
import { MensajeCreateComponent } from './mensaje-create/mensaje-create.component';
import { MensajeDetailComponent } from './mensaje-detail/mensaje-detail.component';
import { MensajeEditComponent } from './mensaje-edit/mensaje-edit.component';
import { MensajeListComponent } from './mensaje-list/mensaje-list.component';
import { MensajeLeidoComponent } from './mensaje-delete/mensaje-delete.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatInputModule, MatFormFieldModule } from '@angular/material';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';

@NgModule({
  declarations: [
    MensajeAdminComponent,
    MensajeCreateComponent,
    MensajeDetailComponent,
    MensajeEditComponent,
    MensajeListComponent,
    MensajeLeidoComponent,
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
    SeguridadModule,
  ],
  exports: [
    MensajeListComponent,
    MensajeAdminComponent,
    MensajeCreateComponent,
    MensajeEditComponent,
    MensajeDetailComponent,
    MensajeLeidoComponent,
  ]
})
export class MensajeModule { }
