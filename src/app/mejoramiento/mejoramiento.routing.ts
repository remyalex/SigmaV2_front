import { AuthGuardService } from '../seguridad/services/auth-guard.service';
import { Routes } from '@angular/router';
import { MEJORAMIENTO_HISTORIAL_MANTENIMIENTO_ROUTES } from './historial-mantenimiento/historial-mantenimiento.routing.module';


export const MEJORAMIENTO_ROUTES: Routes = [
    {
        path: 'historialmantenimiento', children: MEJORAMIENTO_HISTORIAL_MANTENIMIENTO_ROUTES, canActivate: [AuthGuardService], data: {breadcrumb: 'Historial Mantenimiento'}
    }
]
