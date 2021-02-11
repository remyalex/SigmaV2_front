import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EquipoAdminComponent } from './equipo-admin/equipo-admin.component';
import { EquipoCreateComponent } from './equipo-create/equipo-create.component';
import { EquipoDetailComponent } from './equipo-detail/equipo-detail.component';
import { EquipoEditComponent } from './equipo-edit/equipo-edit.component';
import { EquipoListComponent } from './equipo-list/equipo-list.component';
import { EquipoDeleteComponent } from './equipo-delete/equipo-delete.component';
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
    EquipoAdminComponent,
    EquipoCreateComponent,
    EquipoDetailComponent,
    EquipoEditComponent,
    EquipoListComponent,
    EquipoDeleteComponent,
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
    EquipoListComponent,
    EquipoAdminComponent,
    EquipoCreateComponent,
    EquipoEditComponent,
    EquipoDetailComponent,
    EquipoDeleteComponent,
  ],
  providers: [DatePipe]
})
export class EquipoModule { }
