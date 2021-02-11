import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_eventousuario: '/api/administracion/evento/',
  path_administracion_eventousuario_usuarioId: '/api/usuario/searchAutocomplete',
  path_administracion_eventousuario_valorPermitidoId:
    '/api/administracion/lista/ADMINISTRACION_EVENTOS_VALORESPERMITIDOS/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_eventousuario_create: 'ADMINISTRACION_EVENTOUSUARIO_CREATE',
  permiso_administracion_eventousuario_update: 'ADMINISTRACION_EVENTOUSUARIO_UPDATE',
  permiso_administracion_eventousuario_delete: 'ADMINISTRACION_EVENTOUSUARIO_DELETE',
  permiso_administracion_eventousuario_view: 'ADMINISTRACION_EVENTOUSUARIO_VIEW',
  permiso_administracion_eventousuario_list: 'ADMINISTRACION_EVENTOUSUARIO_LIST',
  permiso_administracion_eventousuario_export: 'ADMINISTRACION_EVENTOUSUARIO_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_EVENTOUSUARIO = {
  activo: 'Activo',
  eventoId: 'Evento',
  fechaDesde: 'Fecha Desde',
  fechaHasta: 'Fecha Hasta',
  id: 'Id',
  usuarioId: 'Usuario',
  valorPermitidoId: 'Valor permitido',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
