import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_evento: '/api/administracion/evento/',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_evento_create: 'ADMINISTRACION_EVENTO_CREATE',
  permiso_administracion_evento_update: 'ADMINISTRACION_EVENTO_UPDATE',
  permiso_administracion_evento_delete: 'ADMINISTRACION_EVENTO_DELETE',
  permiso_administracion_evento_view: 'ADMINISTRACION_EVENTO_VIEW',
  permiso_administracion_evento_list: 'ADMINISTRACION_EVENTO_LIST',
  permiso_administracion_evento_export: 'ADMINISTRACION_EVENTO_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_EVENTO = {
  activo: 'Activo',
  descripcion: 'Descripción',
  eventoRol: 'Evento Rol',
  eventoUsuario: 'Evento Usuario',
  id: 'Id',
  nombre: 'Nombre',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
