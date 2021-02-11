import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EncuestaSatisfaccionListComponent } from './encuesta-satisfaccion-list/encuesta-satisfaccion-list.component';
import { EncuestaSatisfaccionCreateComponent } from './encuesta-satisfaccion-create/encuesta-satisfaccion-create.component';
import { EncuestaSatisfaccionEditComponent } from './encuesta-satisfaccion-edit/encuesta-satisfaccion-edit.component';
import { EncuestaSatisfaccionAttachComponent } from './encuesta-satisfaccion-attach/encuesta-satisfaccion-attach.component';

export const ENCUESTA_SATISFACCION_ROUTES: Routes = [
   {
    path: 'list', component: EncuestaSatisfaccionListComponent, data: { breadcrumb: 'Listar encuestas' }
  },
  {
    path: 'create', component: EncuestaSatisfaccionCreateComponent, data: { breadcrumb: 'Crear encuesta' }
  },
  {
    path: 'edit', component: EncuestaSatisfaccionEditComponent, data: { breadcrumb: 'Editar encuesta' }
  },
  {
    path: 'attach', component: EncuestaSatisfaccionAttachComponent, data: { breadcrumb: 'adjuntar' }
  },
];