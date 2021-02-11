import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TipocargueestructuraAdminComponent} from './tipocargueestructura-admin/tipocargueestructura-admin.component';
import { TipocargueestructuraDetailComponent} from './tipocargueestructura-detail/tipocargueestructura-detail.component';
import { TipocargueestructuraEditComponent } from './tipocargueestructura-edit/tipocargueestructura-edit.component';
import { TipocargueestructuraListComponent } from './tipocargueestructura-list/tipocargueestructura-list.component';
import { TipocargueestructuraCreateComponent } from './tipocargueestructura-create/tipocargueestructura-create.component';
import { TipocargueestructuraDeleteComponent } from './tipocargueestructura-delete/tipocargueestructura-delete.component';

export const ADMINISTRACION_TIPOCARGUEESTRUCTURA_ROUTES: Routes = [
  {
    path: 'admin', component : TipocargueestructuraAdminComponent, data: { breadcrumb: '' } //Administración de tipocargueestructura
  },
  {
    path: 'detail', component: TipocargueestructuraDetailComponent, data: { breadcrumb: 'Detallar tipocargueestructura' }
  },
  {
    path: 'create', component: TipocargueestructuraCreateComponent, data: { breadcrumb: 'Crear tipocargueestructura' }
  },
  {
    path: 'edit', component: TipocargueestructuraEditComponent, data: { breadcrumb: 'Editar tipocargueestructura' }
  },
  {
    path: 'list', component: TipocargueestructuraListComponent, data: { breadcrumb: 'Listar tipocargueestructura' }
  },
  {
    path: 'delete', component: TipocargueestructuraDeleteComponent, data: { breadcrumb: 'Eliminar tipocargueestructura' }
  },
];
