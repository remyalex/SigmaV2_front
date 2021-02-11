import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonacalendarioAdminComponent} from './personacalendario-admin/personacalendario-admin.component';
import { PersonacalendarioDetailComponent} from './personacalendario-detail/personacalendario-detail.component';
import { PersonacalendarioEditComponent } from './personacalendario-edit/personacalendario-edit.component';
import { PersonacalendarioListComponent } from './personacalendario-list/personacalendario-list.component';
import { PersonacalendarioCreateComponent } from './personacalendario-create/personacalendario-create.component';
import { PersonacalendarioDeleteComponent } from './personacalendario-delete/personacalendario-delete.component';

export const ADMINISTRACION_PERSONACALENDARIO_ROUTES: Routes = [
  {
    path: 'admin', component : PersonacalendarioAdminComponent, data: { breadcrumb: '' } //Administración de personacalendario
  },
  {
    path: 'detail', component: PersonacalendarioDetailComponent, data: { breadcrumb: 'Detallar personacalendario' }
  },
  {
    path: 'create', component: PersonacalendarioCreateComponent, data: { breadcrumb: 'Crear personacalendario' }
  },
  {
    path: 'edit', component: PersonacalendarioEditComponent, data: { breadcrumb: 'Editar personacalendario' }
  },
  {
    path: 'list', component: PersonacalendarioListComponent, data: { breadcrumb: 'Listar personacalendario' }
  },
  {
    path: 'delete', component: PersonacalendarioDeleteComponent, data: { breadcrumb: 'Eliminar personacalendario' }
  },
];
