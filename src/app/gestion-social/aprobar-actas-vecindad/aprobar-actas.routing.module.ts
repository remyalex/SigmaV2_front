import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AprobarActasAdminComponent } from './aprobar-actas-admin/aprobar-actas.component';
import { AprobarActasListComponent } from './aprobar-actas-list/aprobar-actas-list.component';
import { AprobarActasAttachComponent } from './aprobar-actas-attach/aprobar-actas-attach.component';
import { AprobarActasAproveComponent } from './aprobar-actas-aprove/aprobar-actas-aprove.component';

export const APROBAR_ACTAS_ROUTES: Routes = [
  {
    path: 'admin', component: AprobarActasAdminComponent, data: { breadcrumb: '' }
  },
  {
    path: 'list', component: AprobarActasListComponent, data: { breadcrumb: 'Listar actas' }
  },
  {
    path: 'attach', component: AprobarActasAttachComponent, data: { breadcrumb: 'Adjuntar' }
  },
  {
    path: 'aprove', component: AprobarActasAproveComponent, data: { breadcrumb: 'Aprobar acta' }
  },
  // {
  //   path: 'edit', component: ActasVecindadEditComponent, data: { breadcrumb: 'Editar acta' }
  // },  
];