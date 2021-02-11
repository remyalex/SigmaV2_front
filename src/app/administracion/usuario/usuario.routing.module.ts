import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioAdminComponent} from './usuario-admin/usuario-admin.component';
import { UsuarioDetailComponent} from './usuario-detail/usuario-detail.component';
import { UsuarioEditComponent } from './usuario-edit/usuario-edit.component';
import { UsuarioListComponent } from './usuario-list/usuario-list.component';
import { UsuarioCreateComponent } from './usuario-create/usuario-create.component';
import { UsuarioDeleteComponent } from './usuario-delete/usuario-delete.component';
import { UsuarioChangePasswordComponent } from './usuario-change-password/usuario-change-password.component';

export const ADMINISTRACION_USUARIO_ROUTES: Routes = [
  {
    path: 'admin', component : UsuarioAdminComponent, data: { breadcrumb: '' } //Administración de usuario
  },
  {
    path: 'detail', component: UsuarioDetailComponent, data: { breadcrumb: 'Detallar usuario' }
  },
  {
    path: 'create', component: UsuarioCreateComponent, data: { breadcrumb: 'Crear usuario' }
  },
  {
    path: 'edit', component: UsuarioEditComponent, data: { breadcrumb: 'Editar usuario' }
  },
  {
    path: 'list', component: UsuarioListComponent, data: { breadcrumb: 'Listar usuario' }
  },
  {
    path: 'delete', component: UsuarioDeleteComponent, data: { breadcrumb: 'Eliminar usuario' }
  },
  {
    path: 'change-password', component: UsuarioChangePasswordComponent, data: { breadcrumb: 'Cambiar contraseña usuario' }
  },
];
