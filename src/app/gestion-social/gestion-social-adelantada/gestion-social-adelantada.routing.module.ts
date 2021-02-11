import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionSocialAdelantadaListComponent } from './gestion-social-adelantada-list/gestion-social-adelantada-list.component';
import { GestionSocialAdelantadaComponent } from './gestion-social-adelantada/gestion-social-adelantada.component';
import { GestionSocialAdelantadaEditComponent } from './gestion-social-adelantada-edit/gestion-social-adelantada-edit.component';

export const SOCIAL_REGISTRAR_GESTION_ADELANTADA_ROUTES: Routes = [
  {
    path: 'admin', component: GestionSocialAdelantadaComponent, data: { breadcrumb: '' }
  },
   {
    path: 'list', component: GestionSocialAdelantadaListComponent, data: { breadcrumb: 'Listar' }
  },
  // {
  //   path: 'create', component: GestionSocialAdelantadaCreateComponent, data: { breadcrumb: 'Crear' }
  // },
  // {
  //    path: 'edit', component: GestionSocialAdelantadaEditComponent, data: { breadcrumb: 'Editar' }
  // },
  {
    path: 'list/:pk', component: GestionSocialAdelantadaListComponent, data: { breadcrumb: 'Listar Gestiones Adelantadas' }
  },
];