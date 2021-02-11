import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrfeoAdminComponent} from './orfeo-admin/orfeo-admin.component';
import { OrfeoDetailComponent} from './orfeo-detail/orfeo-detail.component';
import { OrfeoListComponent } from './orfeo-list/orfeo-list.component';

export const ADMINISTRACION_ORFEO_ROUTES: Routes = [
  {
    path: 'admin', component : OrfeoAdminComponent, data: { breadcrumb: '' } //Consulta de documentos orfeo
  },
  {
    path: 'detail', component: OrfeoDetailComponent, data: { breadcrumb: 'Detallar orfeo' }
  },
  {
    path: 'list', component: OrfeoListComponent, data: { breadcrumb: 'Listar orfeo' }
  }
];
