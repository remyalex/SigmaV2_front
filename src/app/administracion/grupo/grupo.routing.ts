import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GrupoAdminComponent } from './grupo-admin/grupo-admin.component';
import { GrupoListComponent } from './grupo-list/grupo-list.component';
import { GrupoCreateComponent } from './grupo-create/grupo-create.component';
import { GrupoDeleteComponent } from './grupo-delete/grupo-delete.component';
import { GrupoEditComponent } from './grupo-edit/grupo-edit.component';


export const ADMINISTRACION_GRUPO_ROUTES: Routes = [
  {
    path: 'admin', component: GrupoAdminComponent, data: { breadcrumb: 'Administración de Grupos' }
  },
  {
    path: 'list', component: GrupoListComponent, data: { breadcrumb: 'Lista de Grupos' }
  },
  {
    path: 'create', component: GrupoCreateComponent, data: { breadcrumb: 'Crear Grupo' }
  },
  {
    path: 'edit/:id', component: GrupoEditComponent, data: { breadcrumb: 'Editar Grupo' }
  },
  {
    path: 'delete', component: GrupoDeleteComponent, data: { breadcrumb: 'Eliminar Grupo' }
  },
];
