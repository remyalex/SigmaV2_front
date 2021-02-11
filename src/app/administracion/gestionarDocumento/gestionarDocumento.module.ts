import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionarDocumentoAdminComponent } from './gestionarDocumento-admin/gestionarDocumento-admin.component';
import { GestionarDocumentoDetailComponent } from './gestionarDocumento-detail/gestionarDocumento-detail.component';
import { GestionarDocumentoListComponent } from './gestionarDocumento-list/gestionarDocumento-list.component';
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
    GestionarDocumentoAdminComponent,
    GestionarDocumentoDetailComponent,
    GestionarDocumentoListComponent,
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
    GestionarDocumentoListComponent,
    GestionarDocumentoAdminComponent,
    GestionarDocumentoDetailComponent,
  ]
})
export class GestionarDocumentoModule { }
