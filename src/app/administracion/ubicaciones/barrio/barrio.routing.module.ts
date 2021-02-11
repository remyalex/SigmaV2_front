import { BarrioAdminComponent } from './barrio-admin/barrio-admin.component';
import { Routes } from '@angular/router';
import { BarrioCreateComponent } from './barrio-create/barrio-create.component';
import { BarrioEditComponent } from './barrio-edit/barrio-edit.component';
import { BarrioDetailComponent } from './barrio-detail/barrio-detail.component';
import { BarrioDeleteComponent } from './barrio-delete/barrio-delete.component';
import { BarrioListComponent } from './barrio-list/barrio-list.component';


export const ADMINISTRACION_BARRIO_ROUTER: Routes = [
    {
        path: 'admin', component: BarrioAdminComponent, data: {breadcrumb: ''}
    },
    {
        path: 'create', component: BarrioCreateComponent, data: {breadcrumb: 'Crear Barrio'}
    },
    {
        path: 'edit', component: BarrioEditComponent, data: {breadcrumb: 'Editar Barrio'}
    },
    {
        path: 'detail', component: BarrioDetailComponent, data: {breadcrumb: 'Detallar Barrio'}
    },
    {
        path: 'delete', component: BarrioDeleteComponent, data: {breadcrumb: 'Eliminar barrio'}
    },
    {
        path: 'list', component: BarrioListComponent, data: {breadcrumb: 'Listar Barrio'}
    }
];
