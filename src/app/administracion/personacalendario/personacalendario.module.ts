import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonacalendarioAdminComponent } from './personacalendario-admin/personacalendario-admin.component';
import { PersonacalendarioCreateComponent } from './personacalendario-create/personacalendario-create.component';
import { PersonacalendarioDetailComponent } from './personacalendario-detail/personacalendario-detail.component';
import { PersonacalendarioEditComponent } from './personacalendario-edit/personacalendario-edit.component';
import { PersonacalendarioListComponent } from './personacalendario-list/personacalendario-list.component';
import { PersonacalendarioDeleteComponent } from './personacalendario-delete/personacalendario-delete.component';
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
    PersonacalendarioAdminComponent,
    PersonacalendarioCreateComponent,
    PersonacalendarioDetailComponent,
    PersonacalendarioEditComponent,
    PersonacalendarioListComponent,
    PersonacalendarioDeleteComponent,
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
    PersonacalendarioListComponent,
    PersonacalendarioAdminComponent,
    PersonacalendarioCreateComponent,
    PersonacalendarioEditComponent,
    PersonacalendarioDetailComponent,
    PersonacalendarioDeleteComponent,
  ]
})
export class PersonacalendarioModule { }
