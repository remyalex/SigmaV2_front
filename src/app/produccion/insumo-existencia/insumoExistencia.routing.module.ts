import { Routes, RouterModule } from '@angular/router';
import { InsumoExistenciaAdminComponent } from './insumo-existencia-admin/insumo-existencia-admin.component';
import { InsumoExistenciaDetailComponent } from './insumo-existencia-detail/insumo-existencia-detail.component';
import { InsumoExistenciaCreateComponent } from './insumo-existencia-create/insumo-existencia-create.component';
import { InsumoExistenciaEditComponent } from './insumo-existencia-edit/insumo-existencia-edit.component';
import { InsumoExistenciaListComponent } from './insumo-existencia-list/insumo-existencia-list.component';
import { InsumoExistenciaDeleteComponent } from './insumo-existencia-delete/insumo-existencia-delete.component';

export const PRODUCCION_INSUMO_EXISTENCIA_ROUTES: Routes = [
  {
    path: 'admin', component : InsumoExistenciaAdminComponent, data: { breadcrumb: '' }
  },
  {
    path: 'detail', component: InsumoExistenciaDetailComponent, data: { breadcrumb: 'Detallar registro' }
  },
  {
    path: 'create', component: InsumoExistenciaCreateComponent, data: { breadcrumb: 'Crear registro' }
  },
  {
    path: 'edit', component: InsumoExistenciaEditComponent, data: { breadcrumb: 'Editar registro' }
  },
  {
    path: 'list', component: InsumoExistenciaListComponent, data: { breadcrumb: 'Listar registro' }
  },
  {
    path: 'delete', component: InsumoExistenciaDeleteComponent, data: { breadcrumb: 'Eliminar registro' }
  },
];
