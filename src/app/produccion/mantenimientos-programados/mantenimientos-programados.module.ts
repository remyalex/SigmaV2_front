import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaquinariaMantenimientoAdminComponent } from './maquinaria-mantenimiento-admin/maquinaria-mantenimiento-admin.component';
import { MaquinariaMantenimientoAddComponent } from './maquinaria-mantenimiento-add/maquinaria-mantenimiento-add.component';
import { MaquinariaEquipoListComponent } from './maquinaria-equipo-list/maquinaria-equipo-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { RouterModule } from '@angular/router';
import { PRODUCCION_MANTENIMIENTOS_PROGRAMADOS_ROUTES } from './mantenimientos-programados.routing.module';
import { MantenimientosProgramadosService } from './services/mantenimientos-programados.service';
import { MaquinariaMantenimientoCancelComponent } from './maquinaria-mantenimiento-cancel/maquinaria-mantenimiento-cancel.component';

@NgModule({
  declarations: [
    MaquinariaEquipoListComponent,
    MaquinariaMantenimientoAddComponent,
    MaquinariaMantenimientoCancelComponent,
    MaquinariaMantenimientoAdminComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SeguridadModule,
    RouterModule.forChild(PRODUCCION_MANTENIMIENTOS_PROGRAMADOS_ROUTES)
  ],
  entryComponents: [
    MaquinariaMantenimientoAddComponent,
    MaquinariaMantenimientoCancelComponent
  ],
  providers: [
    MantenimientosProgramadosService
  ]
})
export class MantenimientosProgramadosModule { }
