import {Routes} from '@angular/router';
import {EquipofallaAdminComponent} from './equipo-falla-admin/equipo-falla-admin.component';
import { EquipoFallaCancelComponent } from './equipo-falla-cancel/equipo-falla-cancel.component';

export const PORDUCCION_EQUIPOFALLA_ROUTES: Routes = [
   { path: 'admin', component : EquipofallaAdminComponent, data: { breadcrumb: 'equipo falla' }},
   { path: 'create', component : EquipoFallaCancelComponent, data: { breadcrumb: 'equipo falla' }}
];
