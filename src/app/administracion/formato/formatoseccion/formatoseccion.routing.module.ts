import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormatoseccionAdminComponent} from './formatoseccion-admin/formatoseccion-admin.component';
import { FormatoseccionDetailComponent} from './formatoseccion-detail/formatoseccion-detail.component';
import { FormatoseccionEditComponent } from './formatoseccion-edit/formatoseccion-edit.component';
import { FormatoseccionListComponent } from './formatoseccion-list/formatoseccion-list.component';
import { FormatoseccionCreateComponent } from './formatoseccion-create/formatoseccion-create.component';
import { FormatoseccionDeleteComponent } from './formatoseccion-delete/formatoseccion-delete.component';

export const ADMINISTRACION_FORMATOSECCION_ROUTES: Routes = [
  {
    path: 'admin', component : FormatoseccionAdminComponent, data: { breadcrumb: '' } //Administración de formato sección
  },
  {
    path: 'detail', component: FormatoseccionDetailComponent, data: { breadcrumb: 'Detallar formato sección' }
  },
  {
    path: 'create', component: FormatoseccionCreateComponent, data: { breadcrumb: 'Crear formato sección' }
  },
  {
    path: 'edit', component: FormatoseccionEditComponent, data: { breadcrumb: 'Editar formato sección' }
  },
  {
    path: 'list', component: FormatoseccionListComponent, data: { breadcrumb: 'Listar formato sección' }
  },
  {
    path: 'delete', component: FormatoseccionDeleteComponent, data: { breadcrumb: 'Eliminar formato sección' }
  },
];
