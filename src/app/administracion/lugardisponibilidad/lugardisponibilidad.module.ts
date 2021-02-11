import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LugardisponibilidadAdminComponent } from './lugardisponibilidad-admin/lugardisponibilidad-admin.component';
import { LugardisponibilidadCreateComponent } from './lugardisponibilidad-create/lugardisponibilidad-create.component';
import { LugardisponibilidadDetailComponent } from './lugardisponibilidad-detail/lugardisponibilidad-detail.component';
import { LugardisponibilidadEditComponent } from './lugardisponibilidad-edit/lugardisponibilidad-edit.component';
import { LugardisponibilidadListComponent } from './lugardisponibilidad-list/lugardisponibilidad-list.component';
import { LugardisponibilidadDeleteComponent } from './lugardisponibilidad-delete/lugardisponibilidad-delete.component';
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
    LugardisponibilidadAdminComponent,
    LugardisponibilidadCreateComponent,
    LugardisponibilidadDetailComponent,
    LugardisponibilidadEditComponent,
    LugardisponibilidadListComponent,
    LugardisponibilidadDeleteComponent,
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
    LugardisponibilidadListComponent,
    LugardisponibilidadAdminComponent,
    LugardisponibilidadCreateComponent,
    LugardisponibilidadEditComponent,
    LugardisponibilidadDetailComponent,
    LugardisponibilidadDeleteComponent,
  ]
})
export class LugardisponibilidadModule { }
