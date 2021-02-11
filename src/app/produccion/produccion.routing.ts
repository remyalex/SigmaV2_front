import { PRODUCCION_INSUMO_EXISTENCIA_ROUTES } from './insumo-existencia/insumoExistencia.routing.module';
import { PRODUCCION_VALE_PLANTA_ROUTES } from './registrar-vale-planta/registrarValePlanta.routing.module';
import { AuthGuardService } from './../seguridad/services/auth-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { PORDUCCION_EQUIPOFALLA_ROUTES } from './equipo-falla/equipo-falla.routing.module';
import { PRODUCCION_ENSAYOS_ROUTES } from './solicitud-ensayos/solicitud-ensayos.routing.module';
import { PRODUCCION_MAQUINARIA_ROUTES } from './maquinaria/maquinaria.routing.module';
// tslint:disable-next-line: max-line-length
import { PRODUCCION_INSUMOS_FORMULA_MEZCLA_ROUTES } from './registrar-insumos-de-formula-mezcla/registrar-insumos-de-formula-mezcla.routing.module';
// tslint:disable-next-line: max-line-length
import { PRODUCCION_FORMULA_MEZCLA_LABORATORIO_ROUTES } from './registrar-formulas-mezcla-laboratorio/registrar-formulas-mezcla-laboratorio.routing.module';

import { NgModule } from '@angular/core';
import { PRODUCCION_CARGUE_LAB_ROUTES } from './cargue-resultados-laboratorio/cargue-resultados-laboratorio.routing.module';
// tslint:disable-next-line: max-line-length
import { PRODUCCION_ROUTER_ASIGNAR_MAQUINARIA_DISPONIBLE_A_SOLICITUD } from './asignar-maquinaria-disponible-a-solicitudes/asignar-maquinaria-routing.module';
// tslint:disable-next-line: max-line-length
import { PRODUCCION_IMPORTAR_ARCHIVO_COMBUSTIBLE_ROUTES } from './importar-archivo-combustible/importar-archivo-combustible.routing.module';
import { RegistroMezclaProducidaComponent } from './registro-mezcla-producida/registro-mezcla-producida.component';
import { PRODUCCION_MANTENIMIENTOS_PROGRAMADOS_ROUTES } from './mantenimientos-programados/mantenimientos-programados.routing.module';
//import { PRODUCCION_IMPORTAR_ARCHIVO_COMBUSTIBLE_ROUTES } from './importar-archivo-combustible-vehiculo/importar-archivo-combustible-vehiculo.routing.module';
import { PRODUCCION_ESTADO_MAQUINARIA_PROPIO_ROUTES } from './estado-maquinaria-propio/estado-maquinaria-propio.routing.module';
import { PRODUCCION_PLANILLA_OPERACION_ROUTES } from './planilla-operacion/planilla-operacion.routing.module';
import { PRODUCCION_TARJETA_OPERACION_ROUTES } from './tarjeta-operacion/tarjeta-operacion.routing.module';
import { PRODUCCION_PERSONAL_PLANTA_ROUTES } from './personal-planta/personal-planta.routing.module';
import { PRODUCCION_REGISTRO_MEZCLA_INSUMOS_ROUTES } from './registro-mezcla-insumos/registro-mezcla-insumos.routing.module';
import { PRODUCCION_MEZCLA_ROUTES } from './produccion-mezcla/produccion-mezcla.routing.module';
import { PRODUCCION_ASIGNAR_CONDUCTORES_MAQUINARIA_ROUTES } from './asignar-conductores-maquinaria/asignar-conductores-maquinaria.routing.module';

export const PRODUCCION_ROUTES: Routes = [
    {
        // tslint:disable-next-line: max-line-length
        path: 'equipofalla', children: PORDUCCION_EQUIPOFALLA_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Solicitud' }
    },
    {
        // tslint:disable-next-line: max-line-length
        path: 'maquinaria', children: PRODUCCION_MAQUINARIA_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Maquinaria o Equipo' }
    },
    {
        // tslint:disable-next-line: max-line-length
        path: 'mantenimientos', children: PRODUCCION_MANTENIMIENTOS_PROGRAMADOS_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Mantenimientos programados' }
    },
    {
        path: 'ensayos', children: PRODUCCION_ENSAYOS_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Solicitud ensayos' }
    },
    {
        // tslint:disable-next-line: max-line-length
        path: 'cargueResultadosLab', children: PRODUCCION_CARGUE_LAB_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Cargue Resultados Laboratorio' }
    },
    {
        // tslint:disable-next-line: max-line-length
        path: 'asignar-maquinaria-disponible-a-solicitudes', children: PRODUCCION_ROUTER_ASIGNAR_MAQUINARIA_DISPONIBLE_A_SOLICITUD, canActivate: [AuthGuardService], data: { breadcrumb: 'Asignar Maquinaria a Solicitues' }
    },
    {
        // tslint:disable-next-line: max-line-length
        path: 'registrar-insumos-de-formula-mezcla', children: PRODUCCION_INSUMOS_FORMULA_MEZCLA_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Registrar insumos de formula de mezcla' }
    },
    {
        path: 'importar-archivo-combustible',
        children: PRODUCCION_IMPORTAR_ARCHIVO_COMBUSTIBLE_ROUTES,
        canActivate: [AuthGuardService], data: { breadcrumb: 'Cargue archivo combustible vehiculos' }
    },
    {
        path: 'registro-mezcla-producida', component: RegistroMezclaProducidaComponent, data: { breadcrumb: 'Registro mezcla producida' }
    },
    {
        path: 'registrar-formulas-mezcla-laboratorio',
        children: PRODUCCION_FORMULA_MEZCLA_LABORATORIO_ROUTES,
        canActivate: [AuthGuardService],
        data: { breadcrumb: 'Registrar formulas de mezcla de laboratorio' }
    },
    {
        path: 'registrar-vale-planta',
        children: PRODUCCION_VALE_PLANTA_ROUTES,
        canActivate: [AuthGuardService],
        data: { breadcrumb: 'Registrar volumenes materiales ingreso a planta' }
    },
    {
        path: 'insumo-existencia',
        children: PRODUCCION_INSUMO_EXISTENCIA_ROUTES,
        canActivate: [AuthGuardService],
        data: { breadcrumb: 'Generación de reporte de existencia de materiales' }
    },
    {
        // tslint:disable-next-line: max-line-length
        path: 'importar-archivo-combustible',
        children: PRODUCCION_IMPORTAR_ARCHIVO_COMBUSTIBLE_ROUTES,
        canActivate: [AuthGuardService], data: { breadcrumb: 'Cargue archivo combustible vehiculos' }
    },
    {
        // tslint:disable-next-line: max-line-length
        path: 'consultar-estado-maquinaria-propio',
        children: PRODUCCION_ESTADO_MAQUINARIA_PROPIO_ROUTES,
        data: { breadcrumb: 'Consultar estado disponibilidad de maquinaria y equipo propio y en alquiler' }
    },
    {
        // tslint:disable-next-line: max-line-length
        path: 'registrar-planilla-operacion',
        children: PRODUCCION_PLANILLA_OPERACION_ROUTES,
        data: { breadcrumb: 'Registrar Planilla Operación' }
    },
    {
        // tslint:disable-next-line: max-line-length
        path: 'registrar-tarjeta-operacion', children:
            PRODUCCION_TARJETA_OPERACION_ROUTES,
        data: { breadcrumb: 'Registrar Tarjeta Operación' }
    },
	{
        // tslint:disable-next-line: max-line-length
        path: 'programar-personal-planta',
		children: PRODUCCION_PERSONAL_PLANTA_ROUTES,
		data: { breadcrumb: 'Programar el Personal de la Planta' }
    },
    {
        path: 'registro-mezcla-insumos',
		children: PRODUCCION_REGISTRO_MEZCLA_INSUMOS_ROUTES,
		canActivate: [AuthGuardService],
		data: { breadcrumb: 'Registrar mezcla producida y despachada' }
    },
    {
        path: 'mezcla', children: PRODUCCION_MEZCLA_ROUTES, data: {breadcrumb: 'Mezcla' }
    },
    {
        path: 'asignar-conductores-maquinaria', children: PRODUCCION_ASIGNAR_CONDUCTORES_MAQUINARIA_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Asignar conductores y operarios a maquinaria programada de la UMV' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(PRODUCCION_ROUTES)],
    exports: [RouterModule]
})
export class ProduccionRouting { }
