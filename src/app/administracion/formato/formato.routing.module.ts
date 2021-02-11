import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormatoAdminComponent} from './formato-admin/formato-admin.component';
import { FormatoDetailComponent} from './formato-detail/formato-detail.component';
import { FormatoEditComponent } from './formato-edit/formato-edit.component';
import { FormatoListComponent } from './formato-list/formato-list.component';
import { FormatoCreateComponent } from './formato-create/formato-create.component';
import { FormatoDeleteComponent } from './formato-delete/formato-delete.component';

export const ADMINISTRACION_FORMATO_ROUTES: Routes = [
  {
    path: 'admin', component : FormatoAdminComponent, data: { breadcrumb: '' } //Administración de formato
  },
  {
    path: 'detail', component: FormatoDetailComponent, data: { breadcrumb: 'Detallar formato' }
  },
  {
    path: 'create', component: FormatoCreateComponent, data: { breadcrumb: 'Crear formato' }
  },
  {
    path: 'edit', component: FormatoEditComponent, data: { breadcrumb: 'Editar formato' }
  },
  {
    path: 'list', component: FormatoListComponent, data: { breadcrumb: 'Listar formato' }
  },
  {
    path: 'delete', component: FormatoDeleteComponent, data: { breadcrumb: 'Eliminar formato' }
  },
];
