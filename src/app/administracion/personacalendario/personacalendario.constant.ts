import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_personacalendario: '/api/administracion/personacalendario',
  path_administracion_personacalendario_disponibleId: '/api/administracion/lista/ADMINISTRACION_DISPONIBLE/items',
  path_administracion_personacalendario_personaDisponibilidadId: '/api/administracion/lista/ADMINISTRACION_PERSONA_DISPONIBILIDAD/items',
  path_administracion_personacalendario_calendarios: '/api/administracion/personacalendario/listCalendariosPersona/',
  path_administracion_personacalendario_calendars: '/api/administracion/personacalendario/calendarios',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_personacalendario_create: 'ADMINISTRACION_PERSONACALENDARIO_CREATE',
  permiso_administracion_personacalendario_update: 'ADMINISTRACION_PERSONACALENDARIO_UPDATE',
  permiso_administracion_personacalendario_delete: 'ADMINISTRACION_PERSONACALENDARIO_DELETE',
  permiso_administracion_personacalendario_view: 'ADMINISTRACION_PERSONACALENDARIO_VIEW',
  permiso_administracion_personacalendario_list: 'ADMINISTRACION_PERSONACALENDARIO_LIST',
  permiso_administracion_personacalendario_export: 'ADMINISTRACION_PERSONACALENDARIO_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_PERSONACALENDARIO = {
  activo: 'Activo',
  dia: 'Día',
  disponibleId: 'Disponible',
  fechaFin: 'Fecha Fin',
  fechaInicio: 'Fecha Inicio',
  id: 'Id',
  horario: 'Horario',
  noDisponible: 'NO',
  nombreResponsable: 'Nombre de responsable',
  personaDisponibilidadId: 'Persona Disponibilidad',
  personas: 'Personas',
  responsableId: 'Responsable',
  siDisponible: 'SI',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
