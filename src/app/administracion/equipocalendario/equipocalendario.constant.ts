import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_equipocalendario: '/api/administracion/equipocalendario/',
  path_administracion_equipocalendario_disponibleId: '/api/administracion/lista/ADMINISTRACION_DISPONIBLE/items',
  path_administracion_equipocalendario_equipoDisponibilidadId: '/api/administracion/equipocalendario/',
  path_administracion_equipocalendario_equipo: '/api/administracion/equipo/searchAutocompletar',
  path_administracion_equipocalendario_calendarios: '/api/administracion/equipocalendario/listCalendariosEquipo/',
  path_administracion_equipocalendario_calendars_compl: '/api/administracion/equipocalendariocompl/calendarios/',
  path_administracion_equipocalendario_calendars: '/api/administracion/equipocalendario/calendarios',
  path_administracion_equipocalendarios_visita_asignacion: '/api/administracion/equipocalendario/calendarios/visita-asignascion/'
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_equipocalendario_create: 'ADMINISTRACION_EQUIPOCALENDARIO_CREATE',
  permiso_administracion_equipocalendario_update: 'ADMINISTRACION_EQUIPOCALENDARIO_UPDATE',
  permiso_administracion_equipocalendario_delete: 'ADMINISTRACION_EQUIPOCALENDARIO_DELETE',
  permiso_administracion_equipocalendario_view: 'ADMINISTRACION_EQUIPOCALENDARIO_VIEW',
  permiso_administracion_equipocalendario_list: 'ADMINISTRACION_EQUIPOCALENDARIO_LIST',
  permiso_administracion_equipocalendario_export: 'ADMINISTRACION_EQUIPOCALENDARIO_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_EQUIPOCALENDARIO = {
  activo: 'Activo',
  disponibleId: 'Disponible',
  equipo: 'Equipo',
  equipos: 'Equipos',
  equipoDisponibilidadId: 'Equipo Disponibilidad',
  dia: 'Día',
  fechaFin: 'Fecha Fin',
  fechaInicio: 'Fecha Inicio',
  horaFin: 'Hora fin',
  horaInicio: 'Hora inicio',
  horario: 'Horario',
  id: 'Id',
  noDisponible: 'NO',
  numeroInterno: 'Número interno',
  numeroMovil: 'Número móvil',
  movil: 'Móvil',
  placa: 'Placa',
  siDisponible: 'SI',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
