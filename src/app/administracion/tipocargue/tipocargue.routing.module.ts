import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TipocargueAdminComponent} from './tipocargue-admin/tipocargue-admin.component';
import { TipocargueDetailComponent} from './tipocargue-detail/tipocargue-detail.component';
import { TipocargueEditComponent } from './tipocargue-edit/tipocargue-edit.component';
import { TipocargueListComponent } from './tipocargue-list/tipocargue-list.component';
import { TipocargueCreateComponent } from './tipocargue-create/tipocargue-create.component';
import { TipocargueDeleteComponent } from './tipocargue-delete/tipocargue-delete.component';
import { TipocargueestructuraAdminComponent } from '../tipocargueestructura/tipocargueestructura-admin/tipocargueestructura-admin.component';
import { TipocargueestructuraDetailComponent } from '../tipocargueestructura/tipocargueestructura-detail/tipocargueestructura-detail.component';
import { TipocargueestructuraCreateComponent } from '../tipocargueestructura/tipocargueestructura-create/tipocargueestructura-create.component';
import { TipocargueestructuraEditComponent } from '../tipocargueestructura/tipocargueestructura-edit/tipocargueestructura-edit.component';
import { TipocargueestructuraListComponent } from '../tipocargueestructura/tipocargueestructura-list/tipocargueestructura-list.component';
import { TipocargueestructuraDeleteComponent } from '../tipocargueestructura/tipocargueestructura-delete/tipocargueestructura-delete.component';

export const ADMINISTRACION_TIPOCARGUE_ROUTES: Routes = [
  {
    path: 'admin', component : TipocargueAdminComponent, data: { breadcrumb: '' } //Administración de tipocargue
  },
  {
    path: 'detail', component: TipocargueDetailComponent, data: { breadcrumb: 'Detallar tipocargue' }
  },
  {
    path: 'create', component: TipocargueCreateComponent, data: { breadcrumb: 'Crear tipocargue' }
  },
  {
    path: 'edit', component: TipocargueEditComponent, data: { breadcrumb: 'Editar tipocargue' }
  },
  {
    path: 'list', component: TipocargueListComponent, data: { breadcrumb: 'Listar tipocargue' }
  },
  {
    path: 'delete', component: TipocargueDeleteComponent, data: { breadcrumb: 'Eliminar tipocargue' }
  },
  {
    path: 'admin', component : TipocargueestructuraAdminComponent, data: { breadcrumb: 'Administración de tipocargueestructura' }
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
