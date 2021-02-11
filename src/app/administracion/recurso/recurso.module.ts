import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatInputModule, MatFormFieldModule } from '@angular/material';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { RecursoAdminComponent } from './recurso-admin/recurso-admin.component';
import { RecursoCreateComponent } from './recurso-create/recurso-create.component';
import { RecursoDetailComponent } from './recurso-detail/recurso-detail.component';
import { RecursoEditComponent } from './recurso-edit/recurso-edit.component';
import { RecursoListComponent } from './recurso-list/recurso-list.component';
import { RecursoDeleteComponent } from './recurso-delete/recurso-delete.component';
import { EquipodisponibilidadModule } from '../equipodisponibilidad/equipodisponibilidad.module';
import { InsumoModule } from '../insumo/insumo.module';
import { LugardisponibilidadModule } from '../lugardisponibilidad/lugardisponibilidad.module';
import { PersonadisponibilidadModule } from '../personadisponibilidad/personadisponibilidad.module';

@NgModule({
  declarations: [
    RecursoAdminComponent,
    RecursoCreateComponent,
    RecursoDetailComponent,
    RecursoEditComponent,
    RecursoListComponent,
    RecursoDeleteComponent,
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
    EquipodisponibilidadModule,
    LugardisponibilidadModule,
    PersonadisponibilidadModule
  ],
  exports: [
    RecursoAdminComponent,
    RecursoCreateComponent,
    RecursoDetailComponent,
    RecursoEditComponent,
    RecursoListComponent,
    RecursoDeleteComponent,
  ]
})
export class RecursoModule { }
