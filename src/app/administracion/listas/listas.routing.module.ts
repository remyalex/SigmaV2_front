import { ListasCofirmComponent } from './listas-confirm/listas-confirm.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListasAdminComponent } from './listas-admin/listas-admin.component';
import { ListasDetailComponent } from './listas-detail/listas-detail.component';
import { ListasEditComponent } from './listas-edit/listas-edit.component';
import { ListasListComponent } from './listas-list/listas-list.component';
import { ListasCreateComponent } from './listas-create/listas-create.component';
import { ListasDeleteComponent } from './listas-delete/listas-delete.component';
import { ListasItemsAdminComponent } from '../listas-items/listas-items-admin/listas-items-admin.component';
import { ListasItemsDetailComponent } from '../listas-items/listas-items-detail/listas-items-detail.component';
import { ListasItemsCreateComponent } from '../listas-items/listas-items-create/listas-items-create.component';
import { ListasItemsEditComponent } from '../listas-items/listas-items-edit/listas-items-edit.component';
import { ListasItemsListComponent } from '../listas-items/listas-items-list/listas-items-list.component';
import { ListasItemsDeleteComponent } from '../listas-items/listas-items-delete/listas-items-delete.component';

export const ADMINISTRACION_LISTAS_ROUTES: Routes = [
    {
        path: 'admin', component: ListasAdminComponent, data: { breadcrumb: '' } //Administración de listas
    },
    {
        path: 'detail', component: ListasDetailComponent, data: { breadcrumb: 'Detallar lista' }
    },
    {
        path: 'create', component: ListasCreateComponent, data: { breadcrumb: 'Crear lista' }
    },
    {
        path: 'edit', component: ListasEditComponent, data: { breadcrumb: 'Editar lista' }
    },
    {
        path: 'list', component: ListasListComponent, data: { breadcrumb: 'Listar listas' }
    },
    {
        path: 'delete', component: ListasDeleteComponent, data: { breadcrumb: 'Eliminar listas' }
    },
    {
        path: 'admin', component: ListasItemsAdminComponent, data: { breadcrumb: 'Administración de listas item' }
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
    },
    {
        path: 'confirm', component: ListasCofirmComponent, data: { breadcrumb: 'Eliminar listas item' }
    }

];
@NgModule({
    imports: [RouterModule.forChild(ADMINISTRACION_LISTAS_ROUTES)],
    exports: [RouterModule]
})
export class AdministracionListasRoutingModule { }

