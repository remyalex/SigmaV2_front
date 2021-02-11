import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanillaoperacionesAdminComponent } from './planillaoperaciones-admin/planillaoperaciones-admin.component';
import { PlanillaoperacionesCreateComponent } from './planillaoperaciones-create/planillaoperaciones-create.component';
import { PlanillaoperacionesEditComponent } from './planillaoperaciones-edit/planillaoperaciones-edit.component';
import { PlanillaoperacionesDeleteComponent } from './planillaoperaciones-delete/planillaoperaciones-delete.component';
import { PlanillaoperacionesListComponent } from './planillaoperaciones-list/planillaoperaciones-list.component';

export const ADMINISTRACION_PLANILLAOPERACIONES_ROUTES: Routes = [
  {
    path: 'admin', component: PlanillaoperacionesAdminComponent, data: { breadcrumb: 'Administración de items planilla Operaciones' }
  },
  {
    path: 'create', component: PlanillaoperacionesCreateComponent, data: { breadcrumb: 'Crear items planilla Operaciones' }
  },
  {
    path: 'edit/:id', component: PlanillaoperacionesEditComponent, data: { breadcrumb: 'Editar items planilla Operaciones' }
  },
  {
    path: 'list', component: PlanillaoperacionesListComponent, data: { breadcrumb: 'Listar items planilla Operaciones' }
  },
  {
    path: 'delete', component: PlanillaoperacionesDeleteComponent, data: { breadcrumb: 'Eliminar items planilla Operaciones' }
  }
];
