import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatoseccionAdminComponent } from './formatoseccion-admin/formatoseccion-admin.component';
import { FormatoseccionCreateComponent } from './formatoseccion-create/formatoseccion-create.component';
import { FormatoseccionDetailComponent } from './formatoseccion-detail/formatoseccion-detail.component';
import { FormatoseccionEditComponent } from './formatoseccion-edit/formatoseccion-edit.component';
import { FormatoseccionListComponent } from './formatoseccion-list/formatoseccion-list.component';
import { FormatoseccionDeleteComponent } from './formatoseccion-delete/formatoseccion-delete.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../../shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatInputModule, MatFormFieldModule } from '@angular/material';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';

@NgModule({
  declarations: [
    FormatoseccionAdminComponent,
    FormatoseccionCreateComponent,
    FormatoseccionDetailComponent,
    FormatoseccionEditComponent,
    FormatoseccionListComponent,
    FormatoseccionDeleteComponent,
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
    FormatoseccionListComponent,
    FormatoseccionAdminComponent,
    FormatoseccionCreateComponent,
    FormatoseccionEditComponent,
    FormatoseccionDetailComponent,
    FormatoseccionDeleteComponent,
  ]
})
export class FormatoseccionModule { }
