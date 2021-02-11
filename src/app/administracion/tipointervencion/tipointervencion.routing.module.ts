import { Routes } from '@angular/router';
import { TipointervencionCreateComponent } from './tipointervencion-create/tipointervencion-create.component';
import { TipointervencionEditComponent } from './tipointervencion-edit/tipointervencion-edit.component';
import { TipointervencionAdminComponent } from './tipointervencion-admin/tipointervencion-admin.component';
import { TipointervencionListComponent } from './tipointervencion-list/tipointervencion-list.component';
import { TipointervencionDeleteComponent } from './tipointervencion-delete/tipointervencion-delete.component';
import { TipointervencionDetailComponent } from './tipointervencion-detail/tipointervencion-detail.component';

export const ADMINISTRACION_TIPOINTERVENCION_ROUTES: Routes = [
  {
    path: 'detail', component: TipointervencionDetailComponent, data: { breadcrumb: 'Detallar tipo intervencion' }
  },
  {
    path: 'create', component: TipointervencionCreateComponent, data: { breadcrumb: 'Crear tipo intervencion' }
  },
  {
    path: 'edit', component: TipointervencionEditComponent, data: { breadcrumb: 'Editar tipo intervencion' }
  },
  {
    path: 'delete', component: TipointervencionDeleteComponent, data: { breadcrumb: 'Eliminar tipo intervencion' }
  },
  {
    path: 'list', component: TipointervencionListComponent, data: { breadcrumb: 'Listar tipo intervencion' }
  },
  {
    path: 'admin', component: TipointervencionAdminComponent, data: { breadcrumb: 'Administrar tipo intervencion' }
  },
];
