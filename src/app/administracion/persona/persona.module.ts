import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonaAdminComponent } from './persona-admin/persona-admin.component';
import { PersonaCreateComponent } from './persona-create/persona-create.component';
import { PersonaDetailComponent } from './persona-detail/persona-detail.component';
import { PersonaEditComponent } from './persona-edit/persona-edit.component';
import { PersonaListComponent } from './persona-list/persona-list.component';
import { PersonaDeleteComponent } from './persona-delete/persona-delete.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatInputModule, MatFormFieldModule } from '@angular/material';
import { PersonanovedadModule } from '../personanovedad/personanovedad.module';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';

@NgModule({
  declarations: [
    PersonaAdminComponent,
    PersonaCreateComponent,
    PersonaDetailComponent,
    PersonaEditComponent,
    PersonaListComponent,
    PersonaDeleteComponent,
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
    PersonanovedadModule
  ],
  exports: [
    PersonaListComponent,
    PersonaAdminComponent,
    PersonaCreateComponent,
    PersonaEditComponent,
    PersonaDetailComponent,
    PersonaDeleteComponent,
  ]
})
export class PersonaModule { }
