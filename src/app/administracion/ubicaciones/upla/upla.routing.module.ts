import { UplaAdminComponent } from './upla-admin/upla-admin.component';
import { UplaCreateComponent } from './upla-create/upla-create.component';
import { UplaDetailComponent } from './upla-detail/upla-detail.component';
import { UplaEditComponent } from './upla-edit/upla-edit.component';
import { UplaDeleteComponent } from './upla-delete/upla-delete.component';
import { UplaListComponent } from './upla-list/upla-list.component';


export const  ADMINISTRACION_UPLA_ROUTER = [
    {
        path: 'admin', component: UplaAdminComponent, data: {breadcrum: ''}
    },
    {
        path: 'create', component: UplaCreateComponent, data: {breadcrum: 'Crear Upla'}
    },
    {
        path: 'edit', component: UplaEditComponent, data: {breadcrum: 'Editar Upla'}
    },
    {
        path: 'detail', component: UplaDetailComponent, data: {breadcrum: 'Detallar Upla'}
    },
    {
        path: 'delete', component: UplaDeleteComponent, data: {breadcrum: 'Eliminar Upla'}
    },
    {
        path: 'list', component: UplaListComponent, data: {breadcrum: 'Listar Upla'}
    }
];
