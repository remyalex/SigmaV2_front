import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/**
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_personadisponibilidad:
    '/api/administracion/personadisponibilidad/',
  path_administracion_personadisponibilidad_personaId: '/api/administracion/persona/searchAutocomplete',
  path_administracion_personadisponibilidad_persona: '/api/administracion/persona',
  path_administracion_personadisponibilidad_tipoAsignacionId:
    '/api/administracion/lista/ADMINISTRACION_DISPONIBILIDAD_TIPOASIGNACION/items',
    path_administracion_personadisponibilidad_turnoId:
    '/api/administracion/lista/ADMINISTRACION_DISPONIBILIDAD_TURNO/items',
  path_administracion_equipodisponibilidad_categoriaPersonaId:
    '/api/administracion/lista/ADMINISTRACION_PERSONA_CATEGORIA/items',
  path_administracion_equipodisponibilidad_areaId:
    '/api/administracion/lista/UMV_AREAS/items',
  path_administracion_equipodisponibilidad_cargoId:
    '/api/administracion/lista/UMV_CARGOS/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_personadisponibilidad_create: 'ADMINISTRACION_PERSONADISPONIBILIDAD_CREATE',
  permiso_administracion_personadisponibilidad_update: 'ADMINISTRACION_PERSONADISPONIBILIDAD_UPDATE',
  permiso_administracion_personadisponibilidad_delete: 'ADMINISTRACION_PERSONADISPONIBILIDAD_DELETE',
  permiso_administracion_personadisponibilidad_view: 'ADMINISTRACION_PERSONADISPONIBILIDAD_VIEW',
  permiso_administracion_personadisponibilidad_list: 'ADMINISTRACION_PERSONADISPONIBILIDAD_LIST',
  permiso_administracion_personadisponibilidad_export: 'ADMINISTRACION_PERSONADISPONIBILIDAD_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_PERSONADISPONIBILIDAD = {
  activo: 'Activo',
  apellido: 'Apellido',
  categoria: 'Categoría',
  nombre: 'Nombre',
  identificacion: 'Identificación',
  area: 'Área',
  cargo: 'Cargo',
  calendario: 'Calendario',
  fechaDesde: 'Fecha Desde',
  fechaHasta: 'Fecha Hasta',
  id: 'Id',
  intervalo: 'Intérvalo',
  personaId: 'Persona',
  tipoAsignacionId: 'Tipo Asignación',
  placeHolderTipoAsignacion: 'Tipo de asignación',
  placeHolderTurno: 'Turno',
  turnoId: 'Turno',
  datosNecesarioPersona: 'La persona no posee la configuración necesario para la disponibilidad',
  estadoIncorrectoPersona: 'El estado de la persona no le permite realizar esta acción',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
