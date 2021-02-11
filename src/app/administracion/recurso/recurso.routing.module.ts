import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecursoAdminComponent } from './recurso-admin/recurso-admin.component';
import { RecursoDetailComponent } from './recurso-detail/recurso-detail.component';
import { RecursoCreateComponent } from './recurso-create/recurso-create.component';
import { RecursoEditComponent } from './recurso-edit/recurso-edit.component';
import { RecursoListComponent } from './recurso-list/recurso-list.component';
import { RecursoDeleteComponent } from './recurso-delete/recurso-delete.component';


export const ADMINISTRACION_RECURSO_ROUTES: Routes = [
  {
    path: 'admin', component : RecursoAdminComponent, data: { breadcrumb: '' } //Administración de recurso
  },
  {
    path: 'detail', component: RecursoDetailComponent, data: { breadcrumb: 'Detallar recurso' }
  },
  {
    path: 'create', component: RecursoCreateComponent, data: { breadcrumb: 'Crear recurso' }
  },
  {
    path: 'edit', component: RecursoEditComponent, data: { breadcrumb: 'Editar recurso' }
  },
  {
    path: 'list', component: RecursoListComponent, data: { breadcrumb: 'Listar recurso' }
  },
  {
    path: 'delete', component: RecursoDeleteComponent, data: { breadcrumb: 'Eliminar recurso' }
  },
];
