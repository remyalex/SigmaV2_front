import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_personanovedad: '/api/administracion/personanovedad',
  // tslint:disable-next-line:max-line-length
  path_administracion_personanovedad_tipoNovedadPersonaId: '/api/administracion/lista/ADMINISTRACION_PERSONA_TIPO_NOVEDAD/items',
};


/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_personanovedad_create: 'ADMINISTRACION_PERSONANOVEDAD_CREATE',
  permiso_administracion_personanovedad_update: 'ADMINISTRACION_PERSONANOVEDAD_UPDATE',
  permiso_administracion_personanovedad_delete: 'ADMINISTRACION_PERSONANOVEDAD_DELETE',
  permiso_administracion_personanovedad_view: 'ADMINISTRACION_PERSONANOVEDAD_VIEW',
  permiso_administracion_personanovedad_list: 'ADMINISTRACION_PERSONANOVEDAD_LIST',
  permiso_administracion_personanovedad_export: 'ADMINISTRACION_PERSONANOVEDAD_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_PERSONANOVEDAD = {
  activo: 'Activo',
  fechaDesde: 'Fecha hora desde',
  fechaHasta: 'Fecha hora hasta',
  id: 'Id',
  observaciones: 'Observaciones',
  personaId: 'Persona',
  tipoNovedadPersonaId: 'Tipo de novedad',
  fechaDesdeMayorMenor: 'La fecha desde debe ser menor a la fecha hasta',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS
};
