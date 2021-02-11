import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonanovedadAdminComponent} from './personanovedad-admin/personanovedad-admin.component';
import { PersonanovedadDetailComponent} from './personanovedad-detail/personanovedad-detail.component';
import { PersonanovedadEditComponent } from './personanovedad-edit/personanovedad-edit.component';
import { PersonanovedadListComponent } from './personanovedad-list/personanovedad-list.component';
import { PersonanovedadCreateComponent } from './personanovedad-create/personanovedad-create.component';
import { PersonanovedadDeleteComponent } from './personanovedad-delete/personanovedad-delete.component';

export const ADMINISTRACION_PERSONANOVEDAD_ROUTES: Routes = [
  {
    path: 'admin', component : PersonanovedadAdminComponent, data: { breadcrumb: '' } //Administración de personanovedad
  },
  {
    path: 'detail', component: PersonanovedadDetailComponent, data: { breadcrumb: 'Detallar personanovedad' }
  },
  {
    path: 'create', component: PersonanovedadCreateComponent, data: { breadcrumb: 'Crear personanovedad' }
  },
  {
    path: 'edit', component: PersonanovedadEditComponent, data: { breadcrumb: 'Editar personanovedad' }
  },
  {
    path: 'list', component: PersonanovedadListComponent, data: { breadcrumb: 'Listar personanovedad' }
  },
  {
    path: 'delete', component: PersonanovedadDeleteComponent, data: { breadcrumb: 'Eliminar personanovedad' }
  },
];
