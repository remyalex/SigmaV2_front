import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventorolAdminComponent} from './eventorol-admin/eventorol-admin.component';
import { EventorolDetailComponent} from './eventorol-detail/eventorol-detail.component';
import { EventorolEditComponent } from './eventorol-edit/eventorol-edit.component';
import { EventorolListComponent } from './eventorol-list/eventorol-list.component';
import { EventorolCreateComponent } from './eventorol-create/eventorol-create.component';
import { EventorolDeleteComponent } from './eventorol-delete/eventorol-delete.component';

export const ADMINISTRACION_EVENTOROL_ROUTES: Routes = [
  {
    path: 'admin', component : EventorolAdminComponent, data: { breadcrumb: '' } //Administración de eventorol
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
