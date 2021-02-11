import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_mensaje: '/api/administracion/mensaje',
  path_administracion_mensaje_destinatarioId: '/api/administracion/lista/ADMINISTRACION_DESTINATARIO/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_mensaje_create: 'ADMINISTRACION_MENSAJE_CREATE',
  permiso_administracion_mensaje_update: 'ADMINISTRACION_MENSAJE_UPDATE',
  permiso_administracion_mensaje_delete: 'ADMINISTRACION_MENSAJE_DELETE',
  permiso_administracion_mensaje_view: 'ADMINISTRACION_MENSAJE_VIEW',
  permiso_administracion_mensaje_list: 'ADMINISTRACION_MENSAJE_LIST',
  permiso_administracion_mensaje_export: 'ADMINISTRACION_MENSAJE_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_MENSAJE = {
  estado: 'Estado',
  activo: 'Activo',
  destinatarioId: 'Destinatario',
  fechaRegistro: 'Fecha Registro',
  id: 'Id',
  leido: 'Leído',
  no_leido: 'No leido',
  mensaje: 'Mensaje',
  origen: 'Origen',
  actualizar_mensaje: 'Actualizar',
  actualizar_mensaje_leido: '¿Desea actualizar a leido?',
  fechaInicio: 'Desde',
  fechaFin: 'Hasta',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
