import { RegistrarValePlantaAttachComponent } from './registrar-vale-planta-attach/registrar-vale-planta-attach.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrarValePlantaAdminComponent } from './registrar-vale-planta-admin/registrar-vale-planta-admin.component';
import { RegistrarValePlantaDetailComponent } from './registrar-vale-planta-detail/registrar-vale-planta-detail.component';
import { RegistrarValePlantaCreateComponent } from './registrar-vale-planta-create/registrar-vale-planta-create.component';
import { RegistrarValePlantaEditComponent } from './registrar-vale-planta-edit/registrar-vale-planta-edit.component';
import { RegistrarValePlantaListComponent } from './registrar-vale-planta-list/registrar-vale-planta-list.component';
import { RegistrarValePlantaDeleteComponent } from './registrar-vale-planta-delete/registrar-vale-planta-delete.component';

export const PRODUCCION_VALE_PLANTA_ROUTES: Routes = [
  {
    path: 'admin', component : RegistrarValePlantaAdminComponent, data: { breadcrumb: '' }
  },
  {
    path: 'detail', component: RegistrarValePlantaDetailComponent, data: { breadcrumb: 'Detallar registro' }
  },
  {
    path: 'create', component: RegistrarValePlantaCreateComponent, data: { breadcrumb: 'Crear registro' }
  },
  {
    path: 'edit', component: RegistrarValePlantaEditComponent, data: { breadcrumb: 'Editar registro' }
  },
  {
    path: 'list', component: RegistrarValePlantaListComponent, data: { breadcrumb: 'Listar registro' }
  },
  {
    path: 'delete', component: RegistrarValePlantaDeleteComponent, data: { breadcrumb: 'Eliminar registro' }
  },
  {
    path: 'attach', component: RegistrarValePlantaAttachComponent, data: { breadcrumb: 'Adjuntar archivo' }
  },
];
