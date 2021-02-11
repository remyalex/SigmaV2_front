import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EquipodisponibilidadAdminComponent} from './equipodisponibilidad-admin/equipodisponibilidad-admin.component';
import { EquipodisponibilidadDetailComponent} from './equipodisponibilidad-detail/equipodisponibilidad-detail.component';
import { EquipodisponibilidadEditComponent } from './equipodisponibilidad-edit/equipodisponibilidad-edit.component';
import { EquipodisponibilidadListComponent } from './equipodisponibilidad-list/equipodisponibilidad-list.component';
import { EquipodisponibilidadCreateComponent } from './equipodisponibilidad-create/equipodisponibilidad-create.component';
import { EquipodisponibilidadDeleteComponent } from './equipodisponibilidad-delete/equipodisponibilidad-delete.component';

export const ADMINISTRACION_EQUIPODISPONIBILIDAD_ROUTES: Routes = [
  {
    path: 'admin', component : EquipodisponibilidadAdminComponent, data: { breadcrumb: '' } //Administración de equipodisponibilidad
  },
  {
    path: 'detail', component: EquipodisponibilidadDetailComponent, data: { breadcrumb: 'Detallar equipodisponibilidad' }
  },
  {
    path: 'create', component: EquipodisponibilidadCreateComponent, data: { breadcrumb: 'Crear equipodisponibilidad' }
  },
  {
    path: 'edit', component: EquipodisponibilidadEditComponent, data: { breadcrumb: 'Editar equipodisponibilidad' }
  },
  {
    path: 'list', component: EquipodisponibilidadListComponent, data: { breadcrumb: 'Listar equipodisponibilidad' }
  },
  {
    path: 'delete', component: EquipodisponibilidadDeleteComponent, data: { breadcrumb: 'Eliminar equipodisponibilidad' }
  },
];
