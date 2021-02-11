import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AsignarConductoresMaquinariaListComponent } from './asignar-conductores-maquinaria-list/asignar-conductores-maquinaria-list.component';
import { AsignarConductoresMaquinariaCreateComponent } from './asignar-conductores-maquinaria-create/asignar-conductores-maquinaria-create.component';
import { AsignarConductoresMaquinariaComponent } from './asignar-conductores-maquinaria/asignar-conductores-maquinaria.component';
import { AsignarConductoresMaquinariaEditComponent } from './asignar-conductores-maquinaria-edit/asignar-conductores-maquinaria-edit.component';
import { AsignarConductoresMaquinariaDetalleComponent } from './asignar-conductores-maquinaria-detalle/asignar-conductores-maquinaria-detalle.component';
import { AsignarConductoresMaquinariaDeleteComponent } from './asignar-conductores-maquinaria-delete/asignar-conductores-maquinaria-delete.component';

export const PRODUCCION_ASIGNAR_CONDUCTORES_MAQUINARIA_ROUTES: Routes = [
  {
    path: 'view', component: AsignarConductoresMaquinariaComponent, data: { breadcrumb: '' } //Administración de rol
  },
  {
    path: 'create', component: AsignarConductoresMaquinariaCreateComponent, data: { breadcrumb: 'Crear asignar conductores maquinaria' }
  },
  {
    path: 'list', component: AsignarConductoresMaquinariaListComponent, data: { breadcrumb: 'Listar asignar conductores maquinaria' }
  },
  {
    path: 'edit', component: AsignarConductoresMaquinariaEditComponent, data: { breadcrumb: 'Editar asignar conductores maquinaria' }
  },
  {
    path: 'detalle', component: AsignarConductoresMaquinariaDetalleComponent, data: { breadcrumb: 'Detalle asignar conductores maquinaria' }
  },
  {
    path: 'delete', component: AsignarConductoresMaquinariaDeleteComponent, data: { breadcrumb: 'Eliminar asignar conductores maquinaria' }
  },
];