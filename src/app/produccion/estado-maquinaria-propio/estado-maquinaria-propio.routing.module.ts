import { Routes } from '@angular/router';
import { EstadoMaquinariaPropioAdminComponent } from './estado-maquinaria-propio-admin/estado-maquinaria-propio-admin.component';
import { EstadoMaquinariaPropioListComponent } from './estado-maquinaria-propio-list/estado-maquinaria-propio-list.component';

export const PRODUCCION_ESTADO_MAQUINARIA_PROPIO_ROUTES: Routes = [
  {
    path: 'admin', component : EstadoMaquinariaPropioAdminComponent, data: { breadcrumb: '' } //Administración de equipo
  },
  {
    path: 'list', component: EstadoMaquinariaPropioListComponent, data: { breadcrumb: 'Listar consultar' }
  },

];
