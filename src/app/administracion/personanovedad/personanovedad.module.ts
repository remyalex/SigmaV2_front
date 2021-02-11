import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonanovedadAdminComponent } from './personanovedad-admin/personanovedad-admin.component';
import { PersonanovedadCreateComponent } from './personanovedad-create/personanovedad-create.component';
import { PersonanovedadDetailComponent } from './personanovedad-detail/personanovedad-detail.component';
import { PersonanovedadEditComponent } from './personanovedad-edit/personanovedad-edit.component';
import { PersonanovedadListComponent } from './personanovedad-list/personanovedad-list.component';
import { PersonanovedadDeleteComponent } from './personanovedad-delete/personanovedad-delete.component';
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
    PersonanovedadAdminComponent,
    PersonanovedadCreateComponent,
    PersonanovedadDetailComponent,
    PersonanovedadEditComponent,
    PersonanovedadListComponent,
    PersonanovedadDeleteComponent,
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
    SeguridadModule,
    SharedModule,
  ],
  exports: [
    PersonanovedadListComponent,
    PersonanovedadAdminComponent,
    PersonanovedadCreateComponent,
    PersonanovedadEditComponent,
    PersonanovedadDetailComponent,
    PersonanovedadDeleteComponent,
  ]
})
export class PersonanovedadModule { }
