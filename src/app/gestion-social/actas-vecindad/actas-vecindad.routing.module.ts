import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActasVecindadComponent } from './actas-vecindad/actas-vecindad.component';
import { ActasVecindadCreateComponent } from './actas-vecindad-create/actas-vecindad-create.component';
import { ActasVecindadListComponent } from './actas-vecindad-list/actas-vecindad-list.component';
import { ActasVecindadEditComponent } from './actas-vecindad-edit/actas-vecindad-edit.component';
import { ActasVecindadAttachComponent } from './actas-vecindad-attach/actas-vecindad-attach.component';

export const ACTAS_VECINDAD_ROUTES: Routes = [
  {
    path: 'admin', component: ActasVecindadComponent, data: { breadcrumb: '' }
  },
   {
    path: 'list', component: ActasVecindadListComponent, data: { breadcrumb: 'Listar actas' }
  },
  {
    path: 'create', component: ActasVecindadCreateComponent, data: { breadcrumb: 'Crear acta' }
  },
  {
    path: 'edit', component: ActasVecindadEditComponent, data: { breadcrumb: 'Editar acta' }
  },
  {
    path: 'attach', component: ActasVecindadAttachComponent, data: { breadcrumb: 'adjuntar' }
  },
  // {
  //   path: 'delete', component: solicitudEnsayosDeleteComponent, data: { breadcrumb: 'Eliminar ensayo' }
  // }
];