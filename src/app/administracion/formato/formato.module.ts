import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatoAdminComponent } from './formato-admin/formato-admin.component';
import { FormatoCreateComponent } from './formato-create/formato-create.component';
import { FormatoDetailComponent } from './formato-detail/formato-detail.component';
import { FormatoEditComponent } from './formato-edit/formato-edit.component';
import { FormatoListComponent } from './formato-list/formato-list.component';
import { FormatoDeleteComponent } from './formato-delete/formato-delete.component';
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
    FormatoAdminComponent,
    FormatoCreateComponent,
    FormatoDetailComponent,
    FormatoEditComponent,
    FormatoListComponent,
    FormatoDeleteComponent,
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
    FormatoListComponent,
    FormatoAdminComponent,
    FormatoCreateComponent,
    FormatoEditComponent,
    FormatoDetailComponent,
    FormatoDeleteComponent,
  ]
})
export class FormatoModule { }
