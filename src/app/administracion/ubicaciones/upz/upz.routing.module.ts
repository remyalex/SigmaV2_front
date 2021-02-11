import { UpzAdminComponent } from './upz-admin/upz-admin.component';
import { UpzCreateComponent } from './upz-create/upz-create.component';
import { UpzDetailComponent } from './upz-detail/upz-detail.component';
import { UpzEditComponent } from './upz-edit/upz-edit.component';
import { UpzDeleteComponent } from './upz-delete/upz-delete.component';
import { UpzListComponent } from './upz-list/upz-list.component';


export const  ADMINISTRACION_UPZ_ROUTER = [
    {
        path: 'admin', component: UpzAdminComponent, data: {breadcrum: ''}
    },
    {
        path: 'create', component: UpzCreateComponent, data: {breadcrum: 'Crear Upz'}
    },
    {
        path: 'edit', component: UpzEditComponent, data: {breadcrum: 'Editar Upz'}
    },
    {
        path: 'detail', component: UpzDetailComponent, data: {breadcrum: 'Detallar Upz'}
    },
    {
        path: 'delete', component: UpzDeleteComponent, data: {breadcrum: 'Eliminar Upz'}
    },
    {
        path: 'list', component: UpzListComponent, data: {breadcrum: 'Listar Upz'}
    }
];
