import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonadisponibilidadAdminComponent } from './personadisponibilidad-admin/personadisponibilidad-admin.component';
import { PersonadisponibilidadCreateComponent } from './personadisponibilidad-create/personadisponibilidad-create.component';
import { PersonadisponibilidadDetailComponent } from './personadisponibilidad-detail/personadisponibilidad-detail.component';
import { PersonadisponibilidadEditComponent } from './personadisponibilidad-edit/personadisponibilidad-edit.component';
import { PersonadisponibilidadListComponent } from './personadisponibilidad-list/personadisponibilidad-list.component';
import { PersonadisponibilidadDeleteComponent } from './personadisponibilidad-delete/personadisponibilidad-delete.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatInputModule, MatFormFieldModule } from '@angular/material';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { ScheduleComponent } from 'src/app/shared/schedule/schedule.component';

@NgModule({
  declarations: [
    PersonadisponibilidadAdminComponent,
    PersonadisponibilidadCreateComponent,
    PersonadisponibilidadDetailComponent,
    PersonadisponibilidadEditComponent,
    PersonadisponibilidadListComponent,
    PersonadisponibilidadDeleteComponent,
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
    PersonadisponibilidadListComponent,
    PersonadisponibilidadAdminComponent,
    PersonadisponibilidadCreateComponent,
    PersonadisponibilidadEditComponent,
    PersonadisponibilidadDetailComponent,
    PersonadisponibilidadDeleteComponent,
  ]  
})
export class PersonadisponibilidadModule { }
