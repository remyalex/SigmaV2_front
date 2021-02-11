import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_eventorol: '/api/administracion/evento/',
  path_administracion_eventorol_rolId: '/api/administracion/rol/searchAutocomplete',
  path_administracion_eventorol_valorPermitidoId:
    '/api/administracion/lista/ADMINISTRACION_EVENTOS_VALORESPERMITIDOS/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_eventorol_create: 'ADMINISTRACION_EVENTOROL_CREATE',
  permiso_administracion_eventorol_update: 'ADMINISTRACION_EVENTOROL_UPDATE',
  permiso_administracion_eventorol_delete: 'ADMINISTRACION_EVENTOROL_DELETE',
  permiso_administracion_eventorol_view: 'ADMINISTRACION_EVENTOROL_VIEW',
  permiso_administracion_eventorol_list: 'ADMINISTRACION_EVENTOROL_LIST',
  permiso_administracion_eventorol_export: 'ADMINISTRACION_EVENTOROL_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_EVENTOROL = {
  activo: 'Activo',
  eventoId: 'Evento',
  fechaDesde: 'Fecha Desde',
  fechaHasta: 'Fecha Hasta',
  id: 'Id',
  rolId: 'Rol',
  valorPermitidoId: 'Valor permitido',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
