import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransicioncondicionesAdminComponent } from './transicioncondiciones-admin/transicioncondiciones-admin.component';
import { TransicioncondicionesCreateComponent } from './transicioncondiciones-create/transicioncondiciones-create.component';

export const ADMINISTRACION_TRANSICIONCONDICIONES_ROUTES: Routes = [
  {
    path: 'admin', component : TransicioncondicionesAdminComponent, data: { breadcrumb: 'Admin' }
  },
  {
    path: 'create', component : TransicioncondicionesCreateComponent, data: { breadcrumb: 'Create' }
  }
];