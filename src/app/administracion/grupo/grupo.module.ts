import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatInputModule, MatFormFieldModule } from '@angular/material';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { GrupoAdminComponent } from './grupo-admin/grupo-admin.component';
import { GrupoListComponent } from './grupo-list/grupo-list.component';
import { ADMINISTRACION_GRUPO_ROUTES } from './grupo.routing';
import { GrupoCreateComponent } from './grupo-create/grupo-create.component';
import { GrupoDeleteComponent } from './grupo-delete/grupo-delete.component';
import { GrupoEditComponent } from './grupo-edit/grupo-edit.component';
import { MantenimientoModule } from './mantenimiento/mantenimiento.module';
import { ImportarGrupoComponent } from './grupo-importar/importar-grupo/importar-grupo.component';
import { ImportarPksGrupoComponent } from './grupo-importar/importar-pks-grupo/importar-pks-grupo.component';

@NgModule({
  declarations: [
    GrupoAdminComponent,
    GrupoListComponent,
    GrupoCreateComponent,
    GrupoDeleteComponent,
    GrupoEditComponent,
    ImportarGrupoComponent,
    ImportarPksGrupoComponent
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
    RouterModule.forChild(ADMINISTRACION_GRUPO_ROUTES),
    MantenimientoModule,
  ]
})
export class GrupoModule { }