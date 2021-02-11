import { Routes } from '@angular/router';
import { CuadranteAdminComponent } from './cuadrante-admin/cuadrante-admin.component';
import { CuadranteCreateComponent } from './cuadrante-create/cuadrante-create.component';
import { CuadranteEditComponent } from './cuadrante-edit/cuadrante-edit.component';
import { CuadranteDeleteComponent } from './cuadrante-delete/cuadrante-delete.component';
import { CuadranteListComponent } from './cuadrante-list/cuadrante-list.component';
import { CuadranteDetailComponent } from './cuadrante-detail/cuadrante-detail.component';


export const ADMINISTRACION_CUADRANTE_ROUTER: Routes = [
    {
        path: 'admin', component: CuadranteAdminComponent, data: {breadcrumb: ''}
    },
    {
        path: 'create', component: CuadranteCreateComponent, data: {breadcrumb: 'Crear Cuadrante'}
    },
    {
        path: 'edit', component: CuadranteEditComponent, data: {breadcrumb: 'Editar Cuadrante'}
    },
    {
        path: 'detail', component: CuadranteDetailComponent, data: {breadcrumb: 'Detallar Cuadrante'}
    },
    {
        path: 'delete', component: CuadranteDeleteComponent, data: {breadcrumb: 'Eliminar Cuadrante'}
    },
    {
        path: 'list', component: CuadranteListComponent, data: {breadcrumb: 'Listar Cuadrante'}
    }
];