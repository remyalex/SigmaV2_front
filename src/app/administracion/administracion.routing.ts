import { ADMINISTRACION_TIPOINTERVENCION_ROUTES } from './tipointervencion/tipointervencion.routing.module';
import { ADMINISTRACION_EQUIPOCONDUCTOR_ROUTES } from './equipoconductor/equipoconductor.routing.module';
import { ADMINISTRACION_ORFEO_ROUTES } from './orfeo/orfeo.routing.module';
import { ADMINISTRACION_FORMATO_ROUTES } from './formato/formato.routing.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../seguridad/services/auth-guard.service';

// Llamado de routers
import { ADMINISTRACION_LUGAR_ROUTES } from './lugar/lugar.routing.module';
import { ADMINISTRACION_LISTAS_ROUTES } from './listas/listas.routing.module';
import { DASHBOARD_ROUTES } from '../dashboard/dashboard.routing';
import { ADMINISTRACION_USUARIO_ROUTES } from './usuario/usuario.routing.module';
import { ADMINISTRACION_INSUMO_ROUTES } from './insumo/insumo.routing.module';
import { ADMINISTRACION_MENU_ROUTES } from './menu/menu.routing.module';
import { ADMINISTRACION_TIPOCARGUE_ROUTES } from './tipocargue/tipocargue.routing.module';
import { ADMINISTRACION_EQUIPO_ROUTES } from './equipo/equipo.routing.module';
import { ADMINISTRACION_ROL_ROUTES } from './rol/rol.routing.module';
import { ADMINISTRACION_TIPOMANTENIMIENTO_ROUTES } from './tipomantenimiento/tipomantenimiento.routing.module';
import { ADMINISTRACION_PERSONA_ROUTES } from './persona/persona.routing.module';
import { ADMINISTRACION_PROCESO_ROUTES } from './proceso/proceso.routing.module';
import { ADMINISTRACION_AUDITORIA_ROUTES } from './auditoria/auditoria.routing.module';
import { ADMINISTRACION_GRUPO_ROUTES } from './grupo/grupo.routing';
import { ADMINISTRACION_FORMATOSECCION_ROUTES } from './formato/formatoseccion/formatoseccion.routing.module';
import { ADMINISTRACION_FORMATOSECCIONCAMPO_ROUTES } from './formato/formatoseccion/formatoseccioncampo/formatoseccioncampo.routing.module';
import { ADMINISTRACION_WIDGET_ROUTES } from './widget/widget.routing.module';
import { ADMINISTRACION_EVENTO_ROUTES } from './evento/evento.routing.module';
import { ADMINISTRACION_MENSAJE_ROUTES } from './mensaje/mensaje.routing.module';
import { ADMINISTRACION_RECURSO_ROUTES } from './recurso/recurso.routing.module';
import { ADMINISTRACION_EQUIPODISPONIBILIDAD_ROUTES } from './equipodisponibilidad/equipodisponibilidad.routing.module';
import { ADMINISTRACION_LUGARDISPONIBILIDAD_ROUTES } from './lugardisponibilidad/lugardisponibilidad.routing.module';
import { ADMINISTRACION_PERSONADISPONIBILIDAD_ROUTES } from './personadisponibilidad/personadisponibilidad.routing.module';
import { ADMINISTRACION_PLANILLAOPERACIONES_ROUTES } from './planillaoperaciones/planillaoperaciones.routing.module';
import { ADMINISTRACION_TIPOFALLA_ROUTES } from './tipofalla/tipofalla.routing.module';
import { ADMINISTRACION_GESTIONARPROCESOS_ROUTES } from './gestionarprocesos/gestionarprocesos.routing';
import { ADMINISTRACION_TRANSICIONCONDICIONES_ROUTES } from './transicioncondiciones/transicioncondiciones.routing.module';
import { ADMINISTRACION_MIGESTION_ROUTES } from './migestion/migestion.routing.module';
import { ADMINISTRACION_UsuarioActividades_ROUTES } from './usuario-actividades/usuario-actividades.routing.module';
import { ADMINISTRACION_ESTADISTICA_USUARIO_ROUTES } from './estadisticausuario/estadisticaUsuario.routing.module';

import { ADMINISTRACION_GESTIONAR_DOCUMENTO_ROUTES } from './gestionarDocumento/gestionarDocumento.routing.module';
import { ADMINISTRACION_ZONA_ROUTES } from './ubicaciones/zona/zona.routing.module';
import { ADMINISTRACION_BARRIO_ROUTER } from './ubicaciones/barrio/barrio.routing.module';
import { ADMINISTRACION_LOCALIDAD_ROUTER } from './ubicaciones/localidad/localidad.routing.module';
import { ADMINISTRACION_CUADRANTE_ROUTER } from './ubicaciones/cuadrante/cuadrante.routing.module';
import { ADMINISTRACION_UPLA_ROUTER } from './ubicaciones/upla/upla.routing.module';
import { ADMINISTRACION_UPZ_ROUTER } from './ubicaciones/upz/upz.routing.module';

export const ADMINISTRACION_ROUTES: Routes = [
  {
    path: 'dashboard', children: DASHBOARD_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Dashboard' }
  },
  {
    path: 'listas', children: ADMINISTRACION_LISTAS_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Listas' }
  },
  {
    path: 'menu', children: ADMINISTRACION_MENU_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Menú' }
  },
  {
    path: 'usuario', children: ADMINISTRACION_USUARIO_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Usuarios' }
  },
  {
    path: 'lugar', children: ADMINISTRACION_LUGAR_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Lugares' }
  },
  {
    path: 'insumo', children: ADMINISTRACION_INSUMO_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Insumos' }
  },
  {
    path: 'persona', children: ADMINISTRACION_PERSONA_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'personas' }
  },
  {
    path: 'rol', children: ADMINISTRACION_ROL_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'roles' }
  },
  {
    path: 'equipo', children: ADMINISTRACION_EQUIPO_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Equipos' }
  },
  {
    path: 'tipocargue', children: ADMINISTRACION_TIPOCARGUE_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Tipo de cargue' }
  },
  {
    path: 'tipofalla', children: ADMINISTRACION_TIPOFALLA_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Tipo de falla' }
  },
  {
    path: 'tipointervencion', children: ADMINISTRACION_TIPOINTERVENCION_ROUTES,
    canActivate: [AuthGuardService], data: { breadcrumb: 'Tipo de intervención' }
  },
  {
    path: 'formato', children: ADMINISTRACION_FORMATO_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Formatos' }
  },
  {
    path: 'tipomantenimiento', children: ADMINISTRACION_TIPOMANTENIMIENTO_ROUTES,
    canActivate: [AuthGuardService], data: { breadcrumb: 'Tipo de mantenimiento' }
  },
  {
    path: 'formatoseccion', children: ADMINISTRACION_FORMATOSECCION_ROUTES,
    canActivate: [], data: { breadcrumb: 'Formato sección' }
  },
  {
    path: 'formatoseccioncampo', children: ADMINISTRACION_FORMATOSECCIONCAMPO_ROUTES,
    canActivate: [], data: { breadcrumb: 'Formato sección campo' }
  },
  {
    path: 'widget', children: ADMINISTRACION_WIDGET_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Widgets' }
  },
  {
    path: 'tipomantenimiento', children: ADMINISTRACION_TIPOMANTENIMIENTO_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Tipo de mantenimiento' }
  },
  {
    path: 'auditoria', children: ADMINISTRACION_AUDITORIA_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Auditoria' }
  },
  {
    path: 'proceso', children: ADMINISTRACION_PROCESO_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Procesos' }
  },
  {
    path: 'grupo', children: ADMINISTRACION_GRUPO_ROUTES, canActivate: [], data: { breadcrumb: 'Grupo' }
  },
  {
    path: 'gestionarprocesos', children: ADMINISTRACION_GESTIONARPROCESOS_ROUTES, canActivate: [], data: { breadcrumb: 'Gestionar Procesos' }
  },
  {
    path: 'planillaoperaciones', children: ADMINISTRACION_PLANILLAOPERACIONES_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Planilla Operaciones' }
  },
  {
    path: 'evento', children: ADMINISTRACION_EVENTO_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Eventos' }
  },
  {
    path: 'mensaje', children: ADMINISTRACION_MENSAJE_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Mensajes' }
  },
  {
    path: 'orfeo', children: ADMINISTRACION_ORFEO_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Orfeo' }
  },
  {
    path: 'recurso', children: ADMINISTRACION_RECURSO_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Recurso' }
  },
  {
    path: 'equipodisponibilidad', children: ADMINISTRACION_EQUIPODISPONIBILIDAD_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Equipo Disponibilidad' }
  },
  {
    path: 'equipoconductor', children: ADMINISTRACION_EQUIPOCONDUCTOR_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Cargue de vehículos' }
  },
  {
    path: 'lugardisponibilidad', children: ADMINISTRACION_LUGARDISPONIBILIDAD_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Lugar Disponibilidad' }
  },
  {
    path: 'personadisponibilidad', children: ADMINISTRACION_PERSONADISPONIBILIDAD_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Persona Disponibilidad' }
  },
  {
    path: 'transicioncondiciones', children: ADMINISTRACION_TRANSICIONCONDICIONES_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Condiciones para transiciones' }
  },
  {
    path: 'migestion', children: ADMINISTRACION_MIGESTION_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Mi GestiÃ³n' }
  },
  {
    path: 'usuarioactividades', children: ADMINISTRACION_UsuarioActividades_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Actividades del Usuario' }
  },
  {
    path: 'estadisticausuario', children: ADMINISTRACION_ESTADISTICA_USUARIO_ROUTES, canActivate: [AuthGuardService], data: {breadcrumb: 'Estadistica Usuario'}
  },
  {
    path: 'gestionarDocumento', children: ADMINISTRACION_GESTIONAR_DOCUMENTO_ROUTES, canActivate: [AuthGuardService], data: { breadcrumb: 'Gestionar Documentos' }
  },
  {
    path: 'zona', children: ADMINISTRACION_ZONA_ROUTES, canActivate: [AuthGuardService], data: {breadcrumb: 'Gestionar Zonas'}
  },
  {
    // tslint:disable-next-line: max-line-length
    path: 'localidad', children: ADMINISTRACION_LOCALIDAD_ROUTER, canActivate: [AuthGuardService], data: {breadcrumb: 'Gestionar Localidades'}
  },
  {
    path: 'barrio', children: ADMINISTRACION_BARRIO_ROUTER, canActivate: [AuthGuardService], data: {breadcrumb: 'Gestionar Barrios'}
  },
  {
    // tslint:disable-next-line: max-line-length
    path: 'cuadrante', children: ADMINISTRACION_CUADRANTE_ROUTER, canActivate: [AuthGuardService], data: {breadcrumb: 'Gestionar Cuadrantes'}
  },
  {
    path: 'upla', children: ADMINISTRACION_UPLA_ROUTER, canActivate: [AuthGuardService], data: {breadcrumb: 'Gestionar Uplas'}
  },
  {
    path: 'upz', children: ADMINISTRACION_UPZ_ROUTER, canActivate: [AuthGuardService], data: {breadcrumb: 'Gestionar Upzs'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(ADMINISTRACION_ROUTES)],
  exports: [RouterModule]
})
export class AdministracionRouting { }
