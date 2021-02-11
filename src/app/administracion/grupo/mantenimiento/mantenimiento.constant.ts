import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_mantenimiento: '/api/mejoramiento/mantenimiento/search/grupoList',
  path_administracion_grupo_disponibilidad: '/api/administracion/lista/DISPONIBLE/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_mantenimiento_create: 'ADMINISTRACION_GRUPO_MANTENIMIENTO_CREATE',
  permiso_administracion_mantenimiento_update: 'ADMINISTRACION_GRUPO_MANTENIMIENTO_UPDATE',
  permiso_administracion_mantenimiento_delete: 'ADMINISTRACION_GRUPO_MANTENIMIENTO_DELETE',
  permiso_administracion_mantenimiento_view: 'ADMINISTRACION_GRUPO_MANTENIMIENTO_VIEW',
  permiso_administracion_mantenimiento_list: 'ADMINISTRACION_GRUPO_MANTENIMIENTO_LIST',
  permiso_administracion_mantenimiento_export: 'ADMINISTRACION_GRUPO_MANTENIMIENTO_EXPORTAR',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_MANTENIMIENTO = {
  activo: 'Activo',
  descripcion: 'Descripción',
  pk: 'pk',
  localidad: 'Localidad',
  zona: 'Zona',
  barrio: 'Barrio',
  upla: 'Upz',
  cuadrante: 'Cuadrante',
  civ: 'Civ',
  agregarMantenimiento: 'Agregar',
  observacion: 'Observación',
  estadoRegistro: 'Estado del registro activo',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
