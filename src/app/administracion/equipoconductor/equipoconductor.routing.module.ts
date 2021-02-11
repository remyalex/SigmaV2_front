import { EquipoConductorListComponent } from './equipoconductor-list/equipoconductor-list.component';
import { EquipoConductorEditComponent } from './equipoconductor-edit/equipoconductor-edit.component';
import { EquipoConductorCreateComponent } from './equipoconductor-create/equipoconductor-create.component';
import { EquipoConductorDetailComponent } from './equipoconductor-detail/equipoconductor-detail.component';
import { EquipoConductorAdminComponent } from './equipoconductor-admin/equipoconductor-admin.component';
import { EquipoconductorDeleteComponent } from './../equipoconductor/equipoconductor-delete/equipoconductor-delete.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const ADMINISTRACION_EQUIPOCONDUCTOR_ROUTES: Routes = [
  {
    path: 'admin', component : EquipoConductorAdminComponent, data: { breadcrumb: '' } //Administración de equipoconductor
  },
  {
    path: 'detail', component: EquipoConductorDetailComponent, data: { breadcrumb: 'Detallar cargue vehículo' }
  },
  {
    path: 'create', component: EquipoConductorCreateComponent, data: { breadcrumb: 'Crear cargue vehículo' }
  },
  {
    path: 'edit', component: EquipoConductorEditComponent, data: { breadcrumb: 'Editar cargue vehículo' }
  },
  {
    path: 'list', component: EquipoConductorListComponent, data: { breadcrumb: 'Listar cargue vehículo' }
  },
  {
    path: 'delete', component: EquipoconductorDeleteComponent, data: { breadcrumb: 'Eliminar cargue vehículo' }
  },
];
