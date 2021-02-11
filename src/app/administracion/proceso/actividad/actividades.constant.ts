import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_procesoactividad_permisos: '/api/administracion/permiso',
  path_administracion_procesoactividad: '/api/administracion/procesoactividad',
  path_administracion_procesoactividad_procesoId: '/api/administracion/lista/ADMINISTRACION_PROCESO/items',
  path_administracion_procesoactividad_area: '/api/administracion/lista/UMV_AREAS/items',
  path_administracion_procesoactividad_cargo: '/api/administracion/lista/UMV_CARGOS/items',
  path_administracion_procesoactividad_componenteUI: '/api/workflow/componenteUI'
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_procesoactividad_create: 'ADMINISTRACION_PROCESOACTIVIDAD_CREATE',
  permiso_administracion_procesoactividad_update: 'ADMINISTRACION_PROCESOACTIVIDAD_UPDATE',
  permiso_administracion_procesoactividad_delete: 'ADMINISTRACION_PROCESOACTIVIDAD_DELETE',
  permiso_administracion_procesoactividad_view: 'ADMINISTRACION_PROCESOACTIVIDAD_VIEW',
  permiso_administracion_procesoactividad_list: 'ADMINISTRACION_PROCESOACTIVIDAD_LIST',
  permiso_administracion_procesoactividad_export: 'ADMINISTRACION_PROCESOACTIVIDAD_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_PROCESOACTIVIDAD = {
  activo: 'Activo',
  descripcion: 'Descripción',
  id: 'Id',
  nombre: 'Nombre',
  procesoId: 'Proceso',
  permisoId: 'Permiso',
  duracion: 'Duración',
  url: 'URL',
  area: 'Área',
  cargo: 'Cargo',
  componenteUI: 'Componente UI',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
