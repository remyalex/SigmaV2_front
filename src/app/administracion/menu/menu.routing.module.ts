import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuAdminComponent} from './menu-admin/menu-admin.component';
import { MenuDetailComponent} from './menu-detail/menu-detail.component';
import { MenuEditComponent } from './menu-edit/menu-edit.component';
import { MenuListComponent } from './menu-list/menu-list.component';
import { MenuCreateComponent } from './menu-create/menu-create.component';
import { MenuDeleteComponent } from './menu-delete/menu-delete.component';

export const ADMINISTRACION_MENU_ROUTES: Routes = [
  {
    path: 'admin', component : MenuAdminComponent, data: { breadcrumb: '' } //Administración de menu
  },
  {
    path: 'detail', component: MenuDetailComponent, data: { breadcrumb: 'Detallar menu' }
  },
  {
    path: 'create', component: MenuCreateComponent, data: { breadcrumb: 'Crear menu' }
  },
  {
    path: 'edit', component: MenuEditComponent, data: { breadcrumb: 'Editar menu' }
  },
  {
    path: 'list', component: MenuListComponent, data: { breadcrumb: 'Listar menu' }
  },
  {
    path: 'delete', component: MenuDeleteComponent, data: { breadcrumb: 'Eliminar menu' }
  }

];
