import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { CargueResultadosLaboratorioAdminComponent } from './cargue-resultados-laboratorio-admin/cargue-resultados-laboratorio-admin.component';
// tslint:disable-next-line: max-line-length
import { CargueResultadosLaboratorioDetailComponent } from './cargue-resultados-laboratorio-detail/cargue-resultados-laboratorio-detail.component';
// tslint:disable-next-line: max-line-length
import { CargueResultadosLaboratorioEditComponent } from './cargue-resultados-laboratorio-edit/cargue-resultados-laboratorio-edit.component';
// tslint:disable-next-line: max-line-length
import { CargueResultadosLaboratorioListComponent } from './cargue-resultados-laboratorio-list/cargue-resultados-laboratorio-list.component';

export const PRODUCCION_CARGUE_LAB_ROUTES: Routes = [
  {
    path: 'admin', component: CargueResultadosLaboratorioAdminComponent, data: { breadcrumb: 'Administración de cargue resultados' }
  },
  {
    path: 'detail', component: CargueResultadosLaboratorioDetailComponent, data: { breadcrumb: 'Detallar cargue resultados' }
  },
  {
    path: 'edit/:id/:pk', component: CargueResultadosLaboratorioEditComponent, data: { breadcrumb: 'Editar cargue resultados' }
  },
  {
    path: 'list/:pk', component: CargueResultadosLaboratorioListComponent, data: { breadcrumb: 'Listar cargue resultados' }
  }
];
