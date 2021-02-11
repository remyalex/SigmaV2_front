import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_insumo: '/api/administracion/insumo/',
  path_administracion_insumo_claseInsumoId: '/api/administracion/lista/CLASE_INSUMO/items',
  path_administracion_insumo_unidadMedidaId: '/api/administracion/lista/UNIDAD_MEDIDA_INSUMO/items'
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_insumo_create: 'ADMINISTRACION_INSUMO_CREATE',
  permiso_administracion_insumo_update: 'ADMINISTRACION_INSUMO_UPDATE',
  permiso_administracion_insumo_delete: 'ADMINISTRACION_INSUMO_DELETE',
  permiso_administracion_insumo_view: 'ADMINISTRACION_INSUMO_VIEW',
  permiso_administracion_insumo_list: 'ADMINISTRACION_INSUMO_LIST',
  permiso_administracion_insumo_export: 'ADMINISTRACION_INSUMO_EXPORT'
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_INSUMO = {
  activo: 'Activo',
  claseInsumoId: 'Clase Insumo',
  codigo: 'Código',
  descripcion: 'Descripción',
  id: 'Id',
  nombre: 'Nombre',
  unidadMedidaId: 'Unidad Medida',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS
};
