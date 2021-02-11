import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MensajeAdminComponent} from './mensaje-admin/mensaje-admin.component';
import { MensajeDetailComponent} from './mensaje-detail/mensaje-detail.component';
import { MensajeEditComponent } from './mensaje-edit/mensaje-edit.component';
import { MensajeListComponent } from './mensaje-list/mensaje-list.component';
import { MensajeCreateComponent } from './mensaje-create/mensaje-create.component';
import { MensajeLeidoComponent } from './mensaje-delete/mensaje-delete.component';

export const ADMINISTRACION_MENSAJE_ROUTES: Routes = [
  {
    path: 'admin', component : MensajeAdminComponent, data: { breadcrumb: '' } //Administración de mensaje
  },
  {
    path: 'detail', component: MensajeDetailComponent, data: { breadcrumb: 'Detallar mensaje' }
  },
  {
    path: 'create', component: MensajeCreateComponent, data: { breadcrumb: 'Crear mensaje' }
  },
  {
    path: 'edit', component: MensajeEditComponent, data: { breadcrumb: 'Editar mensaje' }
  },
  {
    path: 'list', component: MensajeListComponent, data: { breadcrumb: 'Listar mensaje' }
  },
  {
    path: 'delete', component: MensajeLeidoComponent, data: { breadcrumb: 'Eliminar mensaje' }
  },
];
