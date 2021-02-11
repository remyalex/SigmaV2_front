import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_tipofalla: '/api/administracion/tipofalla',
  path_administracion_tipofalla_tipoSuperficieId: '/api/administracion/lista/MEJORAMIENTO_TIPO_SUPERFICIE/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_tipofalla_create: 'ADMINISTRACION_TIPOFALLA_CREATE',
  permiso_administracion_tipofalla_update: 'ADMINISTRACION_TIPOFALLA_UPDATE',
  permiso_administracion_tipofalla_delete: 'ADMINISTRACION_TIPOFALLA_DELETE',
  permiso_administracion_tipofalla_view: 'ADMINISTRACION_TIPOFALLA_VIEW',
  permiso_administracion_tipofalla_list: 'ADMINISTRACION_TIPOFALLA_LIST',
  permiso_administracion_tipofalla_export: 'ADMINISTRACION_TIPOFALLA_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_TIPOFALLA = {
  activo: 'Activo',
  descripcion: 'Descripción',
  id: 'Id',
  tipoSuperficieId: 'Tipo Superficie',
  valor: 'Valor',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
