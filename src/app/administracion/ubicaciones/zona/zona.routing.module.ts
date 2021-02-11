
import { ZonaAdminComponent } from './zona-admin/zona-admin.component';
import { Routes } from '@angular/router';
import { ZonaCreateComponent } from './zona-create/zona-create.component';
import { ZonaEditComponent } from './zona-edit/zona-edit.component';
import { ZonaDetailComponent } from './zona-detail/zona-detail.component';
import { ZonaListComponent } from './zona-list/zona-list.component';
import { ZonaDeleteComponent } from './zona-delete/zona-delete.component';


export const ADMINISTRACION_ZONA_ROUTES: Routes = [
    {
    path: 'admin', component: ZonaAdminComponent, data: { breadcrumb: '' }
    },
    {
        path: 'create', component: ZonaCreateComponent, data: {breadcrumb: 'Crear Zona' },
    },
    {
        path: 'edit', component: ZonaEditComponent, data: {breadcrumb: 'Editar Zona' },
    },
    {
        path: 'detail', component: ZonaDetailComponent, data: {breadcrumb: 'Detallar Zona' },
    },
    {
        path: 'delete', component: ZonaDeleteComponent, data: {breadcrumb: 'Eliminar Zona' }
    },
    {
        path: 'list', component: ZonaListComponent, data: {breadcrumb: 'Listar Zona'}
    }

];
