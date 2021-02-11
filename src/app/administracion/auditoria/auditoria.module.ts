import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditoriaAdminComponent } from './auditoria-admin/auditoria-admin.component';
import { AuditoriaDetailComponent } from './auditoria-detail/auditoria-detail.component';
import { AuditoriaListComponent } from './auditoria-list/auditoria-list.component';
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
    AuditoriaAdminComponent,
    AuditoriaDetailComponent,
    AuditoriaListComponent,
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
    AuditoriaListComponent,
    AuditoriaAdminComponent,
    AuditoriaDetailComponent,
  ]
})
export class AuditoriaModule { }
