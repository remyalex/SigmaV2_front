import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormatoseccioncampoAdminComponent} from './formatoseccioncampo-admin/formatoseccioncampo-admin.component';
import { FormatoseccioncampoDetailComponent} from './formatoseccioncampo-detail/formatoseccioncampo-detail.component';
import { FormatoseccioncampoEditComponent } from './formatoseccioncampo-edit/formatoseccioncampo-edit.component';
import { FormatoseccioncampoListComponent } from './formatoseccioncampo-list/formatoseccioncampo-list.component';
import { FormatoseccioncampoCreateComponent } from './formatoseccioncampo-create/formatoseccioncampo-create.component';
import { FormatoseccioncampoDeleteComponent } from './formatoseccioncampo-delete/formatoseccioncampo-delete.component';

export const ADMINISTRACION_FORMATOSECCIONCAMPO_ROUTES: Routes = [
  {
    path: 'admin', component : FormatoseccioncampoAdminComponent, data: { breadcrumb: '' } //Administración de formato sección campo
  },
  {
    path: 'detail', component: FormatoseccioncampoDetailComponent, data: { breadcrumb: 'Detallar formato sección campo' }
  },
  {
    path: 'create', component: FormatoseccioncampoCreateComponent, data: { breadcrumb: 'Crear formato seccion campo' }
  },
  {
    path: 'edit', component: FormatoseccioncampoEditComponent, data: { breadcrumb: 'Editar formato sección campo' }
  },
  {
    path: 'list', component: FormatoseccioncampoListComponent, data: { breadcrumb: 'Listar formato sección campo' }
  },
  {
    path: 'delete', component: FormatoseccioncampoDeleteComponent, data: { breadcrumb: 'Eliminar formato sección campo' }
  },
];
