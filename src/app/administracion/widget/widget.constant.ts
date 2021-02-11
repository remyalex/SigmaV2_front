import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_widget: '/api/administracion/widget',
  path_administracion_widget_permisoId: '/api/usuario/permisos',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_widget_create: 'ADMINISTRACION_WIDGET_CREATE',
  permiso_administracion_widget_update: 'ADMINISTRACION_WIDGET_UPDATE',
  permiso_administracion_widget_delete: 'ADMINISTRACION_WIDGET_DELETE',
  permiso_administracion_widget_view: 'ADMINISTRACION_WIDGET_VIEW',
  permiso_administracion_widget_list: 'ADMINISTRACION_WIDGET_LIST',
  permiso_administracion_widget_export: 'ADMINISTRACION_WIDGET_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_WIDGET = {
  activo: 'Activo',
  descripcion: 'Descripcion',
  id: 'Id',
  permisoId: 'Permiso',
  titulo: 'Título',
  url: 'Url',
  urlVerMas: 'Url Botón Ver Más',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
