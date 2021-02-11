import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InsumoAdminComponent} from './insumo-admin/insumo-admin.component';
import { InsumoDetailComponent} from './insumo-detail/insumo-detail.component';
import { InsumoEditComponent } from './insumo-edit/insumo-edit.component';
import { InsumoListComponent } from './insumo-list/insumo-list.component';
import { InsumoCreateComponent } from './insumo-create/insumo-create.component';
import { InsumoDeleteComponent } from './insumo-delete/insumo-delete.component';

export const ADMINISTRACION_INSUMO_ROUTES: Routes = [
  {
    path: 'admin', component : InsumoAdminComponent, data: { breadcrumb: '' } //Administración de insumo
  },
  {
    path: 'detail', component: InsumoDetailComponent, data: { breadcrumb: 'Detallar insumo' }
  },
  {
    path: 'create', component: InsumoCreateComponent, data: { breadcrumb: 'Crear insumo' }
  },
  {
    path: 'edit', component: InsumoEditComponent, data: { breadcrumb: 'Editar insumo' }
  },
  {
    path: 'list', component: InsumoListComponent, data: { breadcrumb: 'Listar insumo' }
  },
  {
    path: 'delete', component: InsumoDeleteComponent, data: { breadcrumb: 'Eliminar insumo' }
  },
];
