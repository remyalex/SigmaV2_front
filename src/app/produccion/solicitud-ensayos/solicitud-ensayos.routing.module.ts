import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolicitudEnsayosListComponent } from './solicitud-ensayos-list/solicitud-ensayos-list.component';
import { SolicitudEnsayosCreateComponent } from './solicitud-ensayos-create/solicitud-ensayos-create.component';
import { SolicitudEnsayosComponent } from './solicitud-ensayos/solicitud-ensayos.component';

export const PRODUCCION_ENSAYOS_ROUTES: Routes = [
  {
    path: 'view', component: SolicitudEnsayosComponent, data: { breadcrumb: '' } //Administración de rol
  },
  {
    path: 'create', component: SolicitudEnsayosCreateComponent, data: { breadcrumb: 'Crear ensayo' }
  },
  {
    path: 'list', component: SolicitudEnsayosListComponent, data: { breadcrumb: 'Listar ensayo' }
  },
];