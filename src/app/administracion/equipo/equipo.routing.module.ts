import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EquipoAdminComponent} from './equipo-admin/equipo-admin.component';
import { EquipoDetailComponent} from './equipo-detail/equipo-detail.component';
import { EquipoEditComponent } from './equipo-edit/equipo-edit.component';
import { EquipoListComponent } from './equipo-list/equipo-list.component';
import { EquipoCreateComponent } from './equipo-create/equipo-create.component';
import { EquipoDeleteComponent } from './equipo-delete/equipo-delete.component';

export const ADMINISTRACION_EQUIPO_ROUTES: Routes = [
  {
    path: 'admin', component : EquipoAdminComponent, data: { breadcrumb: '' } //Administración de equipo
  },
  {
    path: 'detail', component: EquipoDetailComponent, data: { breadcrumb: 'Detallar equipo' }
  },
  {
    path: 'create', component: EquipoCreateComponent, data: { breadcrumb: 'Crear equipo' }
  },
  {
    path: 'edit', component: EquipoEditComponent, data: { breadcrumb: 'Editar equipo' }
  },
  {
    path: 'list', component: EquipoListComponent, data: { breadcrumb: 'Listar equipo' }
  },
  {
    path: 'delete', component: EquipoDeleteComponent, data: { breadcrumb: 'Eliminar equipo' }
  },
];
