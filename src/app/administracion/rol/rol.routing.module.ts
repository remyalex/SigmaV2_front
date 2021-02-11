import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolAdminComponent} from './rol-admin/rol-admin.component';
import { RolDetailComponent} from './rol-detail/rol-detail.component';
import { RolEditComponent } from './rol-edit/rol-edit.component';
import { RolListComponent } from './rol-list/rol-list.component';
import { RolCreateComponent } from './rol-create/rol-create.component';
import { RolDeleteComponent } from './rol-delete/rol-delete.component';

export const ADMINISTRACION_ROL_ROUTES: Routes = [
  {
    path: 'admin', component : RolAdminComponent, data: { breadcrumb: '' } //Administración de rol
  },
  {
    path: 'detail', component: RolDetailComponent, data: { breadcrumb: 'Detallar rol' }
  },
  {
    path: 'create', component: RolCreateComponent, data: { breadcrumb: 'Crear rol' }
  },
  {
    path: 'edit', component: RolEditComponent, data: { breadcrumb: 'Editar rol' }
  },
  {
    path: 'list', component: RolListComponent, data: { breadcrumb: 'Listar rol' }
  },
  {
    path: 'delete', component: RolDeleteComponent, data: { breadcrumb: 'Eliminar rol' }
  }

];
