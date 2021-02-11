import { AuthGuardService } from '../seguridad/services/auth-guard.service';
import { Routes } from '@angular/router';
import { INTERVENCION_CONSULTA_PROGRAMACION_PERIODICA_ROUTES } from './consultarProgramacionPeriodica/consultar-list.routing.module';
import { ConProgDiariaTrabajoListComponent } from './programacion-diaria-trabajo/consolidado.component';

export const INTERVENCION_ROUTES: Routes = [
    {
        path: 'consultarprogramacionperiodica', children: INTERVENCION_CONSULTA_PROGRAMACION_PERIODICA_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Consultar Programacion Periodica' }
    },
    {
        path: 'consolidado-programacion-diaria-trabajo', 
        component: ConProgDiariaTrabajoListComponent, 
        data: {
            breadcrumb: 'Consolidado programación diaria de trabajo' 
        }
    }
];
