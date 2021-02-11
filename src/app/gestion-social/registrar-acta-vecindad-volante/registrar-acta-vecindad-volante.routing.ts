import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { RegistrarActaVecindadVolanteAdminComponent } from './registrar-acta-vecindad-volante-admin/registrar-acta-vecindad-volante-admin.component';
// tslint:disable-next-line: max-line-length
import { RegistrarActaVecindadVolanteCreateComponent } from './registrar-acta-vecindad-volante-create/registrar-acta-vecindad-volante-create.component';
// tslint:disable-next-line: max-line-length
import { RegistrarActaVecindadVolanteEditComponent } from './registrar-acta-vecindad-volante-edit/registrar-acta-vecindad-volante-edit.component';
// tslint:disable-next-line: max-line-length
import { RegistrarActaVecindadVolanteListComponent } from './registrar-acta-vecindad-volante-list/registrar-acta-vecindad-volante-list.component';
import { ActaAficheCreateComponent } from './acta-afiche-create/acta-afiche-create.component';
import { ActaAficheListComponent } from './acta-afiche-list/acta-afiche-list.component';
import { ActaAficheEditComponent } from './acta-afiche-edit/acta-afiche-edit.component';

export const SOCIAL_ACTA_VOLANTE_ROUTES: Routes = [
  {
    path: 'admin', component : RegistrarActaVecindadVolanteAdminComponent, data: { breadcrumb: 'Actas Volante' }
  },
  {
    path: 'create/:pk', component: RegistrarActaVecindadVolanteCreateComponent, data: { breadcrumb: 'Crear Acta volante' }
  },
  {
    path: 'edit/:id/:pk', component: RegistrarActaVecindadVolanteEditComponent, data: { breadcrumb: 'Editar Acta volante' }
  },
  {
    path: 'list/:pk', component: RegistrarActaVecindadVolanteListComponent, data: { breadcrumb: 'Listar Acta volante' }
  },
  {
    path: 'listAfiche/:pk', component: ActaAficheListComponent, data: { breadcrumb: 'Listar Acta afiche' }
  },
  {
    path: 'createAfiche/:pk', component: ActaAficheCreateComponent, data: { breadcrumb: 'Crear Acta afiche' }
  },
  {
    path: 'editAfiche/:id/:pk', component: ActaAficheEditComponent, data: { breadcrumb: 'Editar Acta afiche' }
  },
];
