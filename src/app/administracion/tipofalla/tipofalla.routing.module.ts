import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TipofallaAdminComponent} from './tipofalla-admin/tipofalla-admin.component';
import { TipofallaDetailComponent} from './tipofalla-detail/tipofalla-detail.component';
import { TipofallaEditComponent } from './tipofalla-edit/tipofalla-edit.component';
import { TipofallaListComponent } from './tipofalla-list/tipofalla-list.component';
import { TipofallaCreateComponent } from './tipofalla-create/tipofalla-create.component';
import { TipofallaDeleteComponent } from './tipofalla-delete/tipofalla-delete.component';

export const ADMINISTRACION_TIPOFALLA_ROUTES: Routes = [
  {
    path: 'admin', component : TipofallaAdminComponent, data: { breadcrumb: '' } //Administración de tipofalla
  },
  {
    path: 'detail', component: TipofallaDetailComponent, data: { breadcrumb: 'Detallar tipofalla' }
  },
  {
    path: 'create', component: TipofallaCreateComponent, data: { breadcrumb: 'Crear tipofalla' }
  },
  {
    path: 'edit', component: TipofallaEditComponent, data: { breadcrumb: 'Editar tipofalla' }
  },
  {
    path: 'list', component: TipofallaListComponent, data: { breadcrumb: 'Listar tipofalla' }
  },
  {
    path: 'delete', component: TipofallaDeleteComponent, data: { breadcrumb: 'Eliminar tipofalla' }
  },
];
