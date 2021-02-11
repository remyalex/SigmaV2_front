import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuditoriaAdminComponent} from './auditoria-admin/auditoria-admin.component';
import { AuditoriaDetailComponent} from './auditoria-detail/auditoria-detail.component';
import { AuditoriaListComponent } from './auditoria-list/auditoria-list.component';

export const ADMINISTRACION_AUDITORIA_ROUTES: Routes = [
  {
    path: 'admin', component : AuditoriaAdminComponent, data: { breadcrumb: '' }
  },
  {
    path: 'detail', component: AuditoriaDetailComponent, data: { breadcrumb: 'Detallar auditoria' }
  },
  {
    path: 'list', component: AuditoriaListComponent, data: { breadcrumb: 'Listar auditoria' }
  },
];
