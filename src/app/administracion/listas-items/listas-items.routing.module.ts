import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListasItemsDetailComponent } from './listas-items-detail/listas-items-detail.component';
import { ListasItemsCreateComponent } from './listas-items-create/listas-items-create.component';
import { ListasItemsEditComponent } from './listas-items-edit/listas-items-edit.component';
import { ListasItemsListComponent } from './listas-items-list/listas-items-list.component';
import { ListasItemsAdminComponent } from './listas-items-admin/listas-items-admin.component';
import { ListasItemsDeleteComponent } from './listas-items-delete/listas-items-delete.component';


export const ADMINISTRACION_LISTA_ITEM_ROUTES: Routes = [
  {
      path: 'admin', component : ListasItemsAdminComponent, data: { breadcrumb: '' } //Administración de listas item
  },
  {
      path: 'detail', component: ListasItemsDetailComponent, data: { breadcrumb: 'Detallar listas item' } 
  },
  {
      path: 'create', component: ListasItemsCreateComponent, data: { breadcrumb: 'Crear listas item' } 
  },
  {
      path: 'edit', component: ListasItemsEditComponent, data: { breadcrumb: 'Editar listas item' } 
  },
  {
      path: 'list', component: ListasItemsListComponent, data: { breadcrumb: 'Listar listas item' } 
  },
  {
      path: 'delete', component: ListasItemsDeleteComponent, data: { breadcrumb: 'Eliminar listas item' } 
  }

];
@NgModule({
    imports: [RouterModule.forChild(ADMINISTRACION_LISTA_ITEM_ROUTES)],
    exports: [RouterModule]
  })
export class AdministracionListasItemsRoutingModule { }

