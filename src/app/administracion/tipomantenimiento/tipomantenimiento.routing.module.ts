import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TipomantenimientoAdminComponent} from './tipomantenimiento-admin/tipomantenimiento-admin.component';
import { TipomantenimientoDetailComponent} from './tipomantenimiento-detail/tipomantenimiento-detail.component';
import { TipomantenimientoEditComponent } from './tipomantenimiento-edit/tipomantenimiento-edit.component';
import { TipomantenimientoListComponent } from './tipomantenimiento-list/tipomantenimiento-list.component';
import { TipomantenimientoCreateComponent } from './tipomantenimiento-create/tipomantenimiento-create.component';
import { TipomantenimientoDeleteComponent } from './tipomantenimiento-delete/tipomantenimiento-delete.component';

export const ADMINISTRACION_TIPOMANTENIMIENTO_ROUTES: Routes = [
  {
    path: 'admin', component : TipomantenimientoAdminComponent, data: { breadcrumb: '' } //Administración de tipomantenimiento
  },
  {
    path: 'detail', component: TipomantenimientoDetailComponent, data: { breadcrumb: 'Detallar tipomantenimiento' }
  },
  {
    path: 'create', component: TipomantenimientoCreateComponent, data: { breadcrumb: 'Crear tipomantenimiento' }
  },
  {
    path: 'edit', component: TipomantenimientoEditComponent, data: { breadcrumb: 'Editar tipomantenimiento' }
  },
  {
    path: 'list', component: TipomantenimientoListComponent, data: { breadcrumb: 'Listar tipomantenimiento' }
  },
  {
    path: 'delete', component: TipomantenimientoDeleteComponent, data: { breadcrumb: 'Eliminar tipomantenimiento' }
  },
];
