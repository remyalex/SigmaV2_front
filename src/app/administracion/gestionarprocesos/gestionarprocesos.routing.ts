import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionarprocesosAdminComponent } from './gestionarprocesos-admin/gestionarprocesos-admin.component';
import { GestionarprocesosListComponent } from './gestionarprocesos-list/gestionarprocesos-list.component';


export const ADMINISTRACION_GESTIONARPROCESOS_ROUTES: Routes = [
  {
    path: 'admin', component: GestionarprocesosAdminComponent, data: { breadcrumb: 'Administración de Gestionar procesos' }
  },
  {
    path: 'list', component: GestionarprocesosListComponent, data: { breadcrumb: 'Lista de Gestionar procesos' }
  },
];
