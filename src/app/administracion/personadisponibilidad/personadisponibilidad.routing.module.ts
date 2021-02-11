import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonadisponibilidadAdminComponent} from './personadisponibilidad-admin/personadisponibilidad-admin.component';
import { PersonadisponibilidadDetailComponent} from './personadisponibilidad-detail/personadisponibilidad-detail.component';
import { PersonadisponibilidadEditComponent } from './personadisponibilidad-edit/personadisponibilidad-edit.component';
import { PersonadisponibilidadListComponent } from './personadisponibilidad-list/personadisponibilidad-list.component';
import { PersonadisponibilidadCreateComponent } from './personadisponibilidad-create/personadisponibilidad-create.component';
import { PersonadisponibilidadDeleteComponent } from './personadisponibilidad-delete/personadisponibilidad-delete.component';

export const ADMINISTRACION_PERSONADISPONIBILIDAD_ROUTES: Routes = [
  {
    path: 'admin', component : PersonadisponibilidadAdminComponent, data: { breadcrumb: '' } //Administración de personadisponibilidad
  },
  {
    path: 'detail', component: PersonadisponibilidadDetailComponent, data: { breadcrumb: 'Detallar personadisponibilidad' }
  },
  {
    path: 'create', component: PersonadisponibilidadCreateComponent, data: { breadcrumb: 'Crear personadisponibilidad' }
  },
  {
    path: 'edit', component: PersonadisponibilidadEditComponent, data: { breadcrumb: 'Editar personadisponibilidad' }
  },
  {
    path: 'list', component: PersonadisponibilidadListComponent, data: { breadcrumb: 'Listar personadisponibilidad' }
  },
  {
    path: 'delete', component: PersonadisponibilidadDeleteComponent, data: { breadcrumb: 'Eliminar personadisponibilidad' }
  },
];
