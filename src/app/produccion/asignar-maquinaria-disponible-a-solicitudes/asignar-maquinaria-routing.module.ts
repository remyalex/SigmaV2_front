import { Routes } from '@angular/router';
import { AsignarMaquinariaAdminComponent } from './asignar-maquinaria-admin/asignar-maquinaria-admin.component';


export const PRODUCCION_ROUTER_ASIGNAR_MAQUINARIA_DISPONIBLE_A_SOLICITUD: Routes = [
    {
        path: 'asignar-maquinaria-admin', component: AsignarMaquinariaAdminComponent, data: {breadcrumb: 'admin'}
    }
];
