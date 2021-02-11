import {Routes} from '@angular/router';
import { MantenimientoAdminComponent } from 'src/app/administracion/grupo/mantenimiento/mantenimiento-admin/mantenimiento-admin.component';
import { MaquinariaMantenimientoAdminComponent } from './maquinaria-mantenimiento-admin/maquinaria-mantenimiento-admin.component';

export const PRODUCCION_MANTENIMIENTOS_PROGRAMADOS_ROUTES: Routes = [
   { path: 'list', component : MaquinariaMantenimientoAdminComponent, data: { breadcrumb: 'Mantenimientos programados' }}
];
