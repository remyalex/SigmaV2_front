import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProcesoCreateComponent } from './proceso-create/proceso-create.component';
import { ProcesoEditComponent } from './proceso-edit/proceso-edit.component';
import { ProcesoListComponent } from './proceso-list/proceso-list.component';
import { ProcesoDeleteComponent } from './proceso-delete/proceso-delete.component';
import { ProcesoAdminComponent } from './proceso-admin/proceso-admin.component';
import { ProcesoDetailComponent } from './proceso-detail/proceso-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatInputModule, MatFormFieldModule } from '@angular/material';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { ActividadModule } from './actividad/actividad.module';
import { TransicionModule } from './transicion/transicion.module';

import { ADMINISTRACION_PROCESO_ROUTES } from './proceso.routing.module';


@NgModule({
  declarations: [
    ProcesoCreateComponent,
    ProcesoEditComponent,
    ProcesoListComponent,
    ProcesoDeleteComponent,
    ProcesoAdminComponent,
    ProcesoDetailComponent
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
    RouterModule.forChild(ADMINISTRACION_PROCESO_ROUTES),
    ActividadModule,
    TransicionModule
  ]
})
export class ProcesoModule { }
