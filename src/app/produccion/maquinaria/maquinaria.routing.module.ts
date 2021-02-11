import {Routes} from '@angular/router';
import { CrearMaquinariaComponent } from './crear-maquinaria/crear-maquinaria.component';
import { ListMaquinariaComponent } from './list-maquinaria/list-maquinaria.component';
import { MaquinariaAdminComponent } from './maquinaria-admin/maquinaria-admin.component';
import { MantenimientoAdminComponent } from 'src/app/administracion/grupo/mantenimiento/mantenimiento-admin/mantenimiento-admin.component';

export const PRODUCCION_MAQUINARIA_ROUTES: Routes = [
   { path: 'create', component : CrearMaquinariaComponent, data: { breadcrumb: 'Maquinaria o Equipo' }},
   { path: 'list', component : MaquinariaAdminComponent, data: { breadcrumb: 'Maquinaria o Equipo' }}
];
