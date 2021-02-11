import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LugardisponibilidadAdminComponent} from './lugardisponibilidad-admin/lugardisponibilidad-admin.component';
import { LugardisponibilidadDetailComponent} from './lugardisponibilidad-detail/lugardisponibilidad-detail.component';
import { LugardisponibilidadEditComponent } from './lugardisponibilidad-edit/lugardisponibilidad-edit.component';
import { LugardisponibilidadListComponent } from './lugardisponibilidad-list/lugardisponibilidad-list.component';
import { LugardisponibilidadCreateComponent } from './lugardisponibilidad-create/lugardisponibilidad-create.component';
import { LugardisponibilidadDeleteComponent } from './lugardisponibilidad-delete/lugardisponibilidad-delete.component';

export const ADMINISTRACION_LUGARDISPONIBILIDAD_ROUTES: Routes = [
  {
    path: 'admin', component : LugardisponibilidadAdminComponent, data: { breadcrumb: '' } //Administración de lugardisponibilidad
  },
  {
    path: 'detail', component: LugardisponibilidadDetailComponent, data: { breadcrumb: 'Detallar lugardisponibilidad' }
  },
  {
    path: 'create', component: LugardisponibilidadCreateComponent, data: { breadcrumb: 'Crear lugardisponibilidad' }
  },
  {
    path: 'edit', component: LugardisponibilidadEditComponent, data: { breadcrumb: 'Editar lugardisponibilidad' }
  },
  {
    path: 'list', component: LugardisponibilidadListComponent, data: { breadcrumb: 'Listar lugardisponibilidad' }
  },
  {
    path: 'delete', component: LugardisponibilidadDeleteComponent, data: { breadcrumb: 'Eliminar lugardisponibilidad' }
  },
];
