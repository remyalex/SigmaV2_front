import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActividadAdminComponent } from './actividad-admin/actividad-admin.component';
import { ActividadCreateComponent } from './actividad-create/actividad-create.component';
import { ActividadDeleteComponent } from './actividad-delete/actividad-delete.component';
import { ActividadDetailComponent } from './actividad-detail/actividad-detail.component';
import { ActividadListComponent } from './actividad-list/actividad-list.component';
import { ActividadEditComponent } from './actividad-edit/actividad-edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatInputModule, MatFormFieldModule } from '@angular/material';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ActividadAdminComponent,
    ActividadCreateComponent,
    ActividadDeleteComponent,
    ActividadDetailComponent,
    ActividadListComponent,
    ActividadEditComponent
  ],
  entryComponents: [
    ActividadCreateComponent,
    ActividadDeleteComponent,
    ActividadDetailComponent,
    ActividadEditComponent
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
    ActividadAdminComponent,
    ActividadCreateComponent,
    ActividadDeleteComponent,
    ActividadDetailComponent,
    ActividadListComponent,
    ActividadEditComponent
  ]
})
export class ActividadModule {
}


