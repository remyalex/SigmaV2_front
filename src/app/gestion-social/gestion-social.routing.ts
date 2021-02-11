import { AuthGuardService } from '../seguridad/services/auth-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { SOCIAL_ACTA_VOLANTE_ROUTES } from './registrar-acta-vecindad-volante/registrar-acta-vecindad-volante.routing';
import { NgModule } from '@angular/core';
import { ACTAS_VECINDAD_ROUTES } from './actas-vecindad/actas-vecindad.routing.module';
import { APROBAR_ACTAS_ROUTES } from './aprobar-actas-vecindad/aprobar-actas.routing.module';
import { ENCUESTA_SATISFACCION_ROUTES } from './encuesta-satisfaccion/encuesta-satisfaccion.routing.module';
import { GESTIONAR_RADICADOS_ROUTES } from './gestionar-radicados-pqrsfd/gestionar-radicados-pqrsfd.routing';

export const GESTION_SOCIAL_ROUTES: Routes = [
    {
        // tslint:disable-next-line: max-line-length
        path: 'registrarActaVecindadVolante', children: SOCIAL_ACTA_VOLANTE_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Registrar Actas Volante ' }
    },
    {
        path: 'actas-vecindad', children: ACTAS_VECINDAD_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Actas de vecindad' }
    },
    {
        path: 'aprobar-actas', children: APROBAR_ACTAS_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Actas de vecindad' }
    },
    {
        path: 'encuesta-satisfaccion', children: ENCUESTA_SATISFACCION_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Encuestas de Satisfacción' }
    },
    {
        path: 'gestionar-radicados-pqrsfd', children: GESTIONAR_RADICADOS_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Gestionar radicados pqrsfd' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(GESTION_SOCIAL_ROUTES)],
    exports: [RouterModule]
})
export class GestionSocialRouting { }
