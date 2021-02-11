import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventousuarioAdminComponent} from './eventousuario-admin/eventousuario-admin.component';
import { EventousuarioDetailComponent} from './eventousuario-detail/eventousuario-detail.component';
import { EventousuarioEditComponent } from './eventousuario-edit/eventousuario-edit.component';
import { EventousuarioListComponent } from './eventousuario-list/eventousuario-list.component';
import { EventousuarioCreateComponent } from './eventousuario-create/eventousuario-create.component';
import { EventousuarioDeleteComponent } from './eventousuario-delete/eventousuario-delete.component';

export const ADMINISTRACION_EVENTOUSUARIO_ROUTES: Routes = [
  {
    path: 'admin', component : EventousuarioAdminComponent, data: { breadcrumb: '' } //Administración de eventousuario
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
];
