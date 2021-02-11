import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EquipocalendarioAdminComponent} from './equipocalendario-admin/equipocalendario-admin.component';
import { EquipocalendarioDetailComponent} from './equipocalendario-detail/equipocalendario-detail.component';
import { EquipocalendarioEditComponent } from './equipocalendario-edit/equipocalendario-edit.component';
import { EquipocalendarioListComponent } from './equipocalendario-list/equipocalendario-list.component';
import { EquipocalendarioCreateComponent } from './equipocalendario-create/equipocalendario-create.component';
import { EquipocalendarioDeleteComponent } from './equipocalendario-delete/equipocalendario-delete.component';

export const ADMINISTRACION_EQUIPOCALENDARIO_ROUTES: Routes = [
  {
    path: 'admin', component : EquipocalendarioAdminComponent, data: { breadcrumb: '' } //Administración de equipocalendario
  },
  {
    path: 'detail', component: EquipocalendarioDetailComponent, data: { breadcrumb: 'Detallar equipocalendario' }
  },
  {
    path: 'create', component: EquipocalendarioCreateComponent, data: { breadcrumb: 'Crear equipocalendario' }
  },
  {
    path: 'edit', component: EquipocalendarioEditComponent, data: { breadcrumb: 'Editar equipocalendario' }
  },
  {
    path: 'list', component: EquipocalendarioListComponent, data: { breadcrumb: 'Listar equipocalendario' }
  },
  {
    path: 'delete', component: EquipocalendarioDeleteComponent, data: { breadcrumb: 'Eliminar equipocalendario' }
  },
];
