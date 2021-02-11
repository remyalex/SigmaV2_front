import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LugarAdminComponent} from './lugar-admin/lugar-admin.component';
import { LugarDetailComponent} from './lugar-detail/lugar-detail.component';
import { LugarEditComponent } from './lugar-edit/lugar-edit.component';
import { LugarListComponent } from './lugar-list/lugar-list.component';
import { LugarCreateComponent } from './lugar-create/lugar-create.component';
import { LugarDeleteComponent } from './lugar-delete/lugar-delete.component';

export const ADMINISTRACION_LUGAR_ROUTES: Routes = [
  {
    path: 'admin', component : LugarAdminComponent, data: { breadcrumb: '' } //Administración de lugar
  },
  {
    path: 'detail', component: LugarDetailComponent, data: { breadcrumb: 'Detallar lugar' }
  },
  {
    path: 'create', component: LugarCreateComponent, data: { breadcrumb: 'Crear lugar' }
  },
  {
    path: 'edit', component: LugarEditComponent, data: { breadcrumb: 'Editar lugar' }
  },
  {
    path: 'list', component: LugarListComponent, data: { breadcrumb: 'Listar lugar' }
  },
  {
    path: 'delete', component: LugarDeleteComponent, data: { breadcrumb: 'Eliminar lugar' }
  },
];
