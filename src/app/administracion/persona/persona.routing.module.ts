import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonaAdminComponent} from './persona-admin/persona-admin.component';
import { PersonaDetailComponent} from './persona-detail/persona-detail.component';
import { PersonaEditComponent } from './persona-edit/persona-edit.component';
import { PersonaListComponent } from './persona-list/persona-list.component';
import { PersonaCreateComponent } from './persona-create/persona-create.component';
import { PersonaDeleteComponent } from './persona-delete/persona-delete.component';
import { PersonanovedadAdminComponent } from '../personanovedad/personanovedad-admin/personanovedad-admin.component';
import { PersonanovedadDetailComponent } from '../personanovedad/personanovedad-detail/personanovedad-detail.component';
import { PersonanovedadCreateComponent } from '../personanovedad/personanovedad-create/personanovedad-create.component';
import { PersonanovedadEditComponent } from '../personanovedad/personanovedad-edit/personanovedad-edit.component';
import { PersonanovedadListComponent } from '../personanovedad/personanovedad-list/personanovedad-list.component';
import { PersonanovedadDeleteComponent } from '../personanovedad/personanovedad-delete/personanovedad-delete.component';

export const ADMINISTRACION_PERSONA_ROUTES: Routes = [
  {
    path: 'admin', component : PersonaAdminComponent, data: { breadcrumb: '' } //Administración de persona
  },
  {
    path: 'detail', component: PersonaDetailComponent, data: { breadcrumb: 'Detallar persona' }
  },
  {
    path: 'create', component: PersonaCreateComponent, data: { breadcrumb: 'Crear persona' }
  },
  {
    path: 'edit', component: PersonaEditComponent, data: { breadcrumb: 'Editar persona' }
  },
  {
    path: 'list', component: PersonaListComponent, data: { breadcrumb: 'Listar persona' }
  },
  {
    path: 'delete', component: PersonaDeleteComponent, data: { breadcrumb: 'Eliminar persona' }
  },
  {
    path: 'admin', component : PersonanovedadAdminComponent, data: { breadcrumb: 'Administración de personanovedad' }
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
