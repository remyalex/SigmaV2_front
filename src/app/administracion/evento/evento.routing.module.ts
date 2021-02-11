import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventoAdminComponent} from './evento-admin/evento-admin.component';
import { EventoDetailComponent} from './evento-detail/evento-detail.component';
import { EventoEditComponent } from './evento-edit/evento-edit.component';
import { EventoListComponent } from './evento-list/evento-list.component';
import { EventoCreateComponent } from './evento-create/evento-create.component';
import { EventoDeleteComponent } from './evento-delete/evento-delete.component';
import { EventousuarioAdminComponent } from './eventousuario/eventousuario-admin/eventousuario-admin.component';
import { EventousuarioDetailComponent } from './eventousuario/eventousuario-detail/eventousuario-detail.component';
import { EventousuarioCreateComponent } from './eventousuario/eventousuario-create/eventousuario-create.component';
import { EventousuarioEditComponent } from './eventousuario/eventousuario-edit/eventousuario-edit.component';
import { EventousuarioListComponent } from './eventousuario/eventousuario-list/eventousuario-list.component';
import { EventousuarioDeleteComponent } from './eventousuario/eventousuario-delete/eventousuario-delete.component';
import { EventorolAdminComponent } from './eventorol/eventorol-admin/eventorol-admin.component';
import { EventorolDetailComponent } from './eventorol/eventorol-detail/eventorol-detail.component';
import { EventorolCreateComponent } from './eventorol/eventorol-create/eventorol-create.component';
import { EventorolEditComponent } from './eventorol/eventorol-edit/eventorol-edit.component';
import { EventorolListComponent } from './eventorol/eventorol-list/eventorol-list.component';
import { EventorolDeleteComponent } from './eventorol/eventorol-delete/eventorol-delete.component';

export const ADMINISTRACION_EVENTO_ROUTES: Routes = [
  {
    path: 'admin', component : EventoAdminComponent, data: { breadcrumb: '' } //Administración de evento
  },
  {
    path: 'detail', component: EventoDetailComponent, data: { breadcrumb: 'Detallar evento' }
  },
  {
    path: 'create', component: EventoCreateComponent, data: { breadcrumb: 'Crear evento' }
  },
  {
    path: 'edit', component: EventoEditComponent, data: { breadcrumb: 'Editar evento' }
  },
  {
    path: 'list', component: EventoListComponent, data: { breadcrumb: 'Listar evento' }
  },
  {
    path: 'delete', component: EventoDeleteComponent, data: { breadcrumb: 'Eliminar evento' }
  },
  {
    path: 'admin', component : EventousuarioAdminComponent, data: { breadcrumb: 'Administración de eventousuario' }
  },
  {
    path: 'detail', component: EventousuarioDetailComponent, data: { breadcrumb: 'Detallar eventousuario' }
  },
  {
    path: 'create', component: EventousuarioCreateComponent, data: { breadcrumb: 'Crear eventousuario' }
  },
  {
    path: 'edit', component: EventousuarioEditComponent, data: { breadcrumb: 'Editar eventousuario' }
  },
  {
    path: 'list', component: EventousuarioListComponent, data: { breadcrumb: 'Listar eventousuario' }
  },
  {
    path: 'delete', component: EventousuarioDeleteComponent, data: { breadcrumb: 'Eliminar eventousuario' }
  },
  {
    path: 'admin', component : EventorolAdminComponent, data: { breadcrumb: 'Administración de eventorol' }
  },
  {
    path: 'detail', component: EventorolDetailComponent, data: { breadcrumb: 'Detallar eventorol' }
  },
  {
    path: 'create', component: EventorolCreateComponent, data: { breadcrumb: 'Crear eventorol' }
  },
  {
    path: 'edit', component: EventorolEditComponent, data: { breadcrumb: 'Editar eventorol' }
  },
  {
    path: 'list', component: EventorolListComponent, data: { breadcrumb: 'Listar eventorol' }
  },
  {
    path: 'delete', component: EventorolDeleteComponent, data: { breadcrumb: 'Eliminar eventorol' }
  },
];
