import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  
};
/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  administracion_rol_create: 'ADMINISTRACION_ROL_CREATE',
  administracion_rol_update: 'ADMINISTRACION_ROL_UPDATE',
  administracion_rol_delete: 'ADMINISTRACION_ROL_DELETE',
  administracion_rol_view: 'ADMINISTRACION_ROL_VIEW',
  administracion_rol_list: 'ADMINISTRACION_ROL_LIST',
  administracion_rol_export: 'ADMINISTRACION_ROL_EXPORT',
};
/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_ROL = {  
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
