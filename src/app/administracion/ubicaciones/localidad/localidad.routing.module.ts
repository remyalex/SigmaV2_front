import { Routes } from '@angular/router';
import { LocalidadAdminComponent } from './localidad-admin/localidad-admin.component';
import { LocalidadCreateComponent } from './localidad-create/localidad-create.component';
import { LocalidadDeleteComponent } from './localidad-delete/localidad-delete.component';
import { LocalidadDetailComponent } from './localidad-detail/localidad-detail.component';
import { LocalidadEditComponent } from './localidad-edit/localidad-edit.component';
import { LocalidadListComponent } from './localidad-list/localidad-list.component';

export const ADMINISTRACION_LOCALIDAD_ROUTER: Routes = [
    {
        path: 'admin', component: LocalidadAdminComponent, data: {breadcrumb: ''}
    },
    {
        path: 'create', component: LocalidadCreateComponent, data: { breadcrumb: 'Crear Localidad'}
    },
    {
        path: 'edit', component: LocalidadEditComponent, data: {breadcrumb: 'Editar Localidad'}
    },
    {
        path: 'detail', component: LocalidadDetailComponent, data: {breadcrumb: 'Detallar Localidad'}
    },
    {
        path: 'delete', component: LocalidadDeleteComponent, data: {breadcrumb: 'Eliminar Localidad'}
    },
    {
        path: 'list', component: LocalidadListComponent, data: {breadcrumb: 'Listar Localidad'}
    }
];
