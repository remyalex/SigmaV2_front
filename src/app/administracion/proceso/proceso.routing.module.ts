import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProcesoAdminComponent } from './proceso-admin/proceso-admin.component';
import { ProcesoDetailComponent } from './proceso-detail/proceso-detail.component';
import { ProcesoEditComponent } from './proceso-edit/proceso-edit.component';
import { ProcesoListComponent } from './proceso-list/proceso-list.component';
import { ProcesoCreateComponent } from './proceso-create/proceso-create.component';
import { ProcesoDeleteComponent } from './proceso-delete/proceso-delete.component';

export const ADMINISTRACION_PROCESO_ROUTES: Routes = [
  {
    path: 'admin', component: ProcesoAdminComponent, data: { breadcrumb: 'Administración de proceso' }
  },
  {
    path: 'detail', component: ProcesoDetailComponent, data: { breadcrumb: 'Detallar proceso' }
  },
  {
    path: 'create', component: ProcesoCreateComponent, data: { breadcrumb: 'Crear proceso' }
  },
  {
    path: 'edit/:id', component: ProcesoEditComponent, data: { breadcrumb: 'Editar proceso' }
  },
  {
    path: 'list', component: ProcesoListComponent, data: { breadcrumb: 'Listar proceso' }
  },
  {
    path: 'delete', component: ProcesoDeleteComponent, data: { breadcrumb: 'Eliminar proceso' }
  }
];
