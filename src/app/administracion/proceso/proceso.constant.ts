import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  // path_administracion_proceso: '/api/administracion/proceso',
  path_administracion_proceso: '/api/administracion/proceso',
  databaseTables: '/api/database',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_proceso_create: 'ADMINISTRACION_PROCESO_CREATE',
  permiso_administracion_proceso_update: 'ADMINISTRACION_PROCESO_UPDATE',
  permiso_administracion_proceso_delete: 'ADMINISTRACION_PROCESO_DELETE',
  permiso_administracion_proceso_view: 'ADMINISTRACION_PROCESO_VIEW',
  permiso_administracion_proceso_list: 'ADMINISTRACION_PROCESO_LIST',
  permiso_administracion_proceso_export: 'ADMINISTRACION_PROCESO_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_PROCESO = {
  actividades: 'Actividades',
  activo: 'Activo',
  descripcion: 'Descripción',
  actividadInicial: 'Actividad inicial',
  id: 'Id',
  nombre: 'Nombre',
  url: 'URL',
  transiciones: 'Transiciones',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
