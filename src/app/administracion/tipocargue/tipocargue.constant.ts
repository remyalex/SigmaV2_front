import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_tipocargue: '/api/administracion/tipocargue/',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_tipocargue_create: 'ADMINISTRACION_TIPOCARGUE_CREATE',
  permiso_administracion_tipocargue_update: 'ADMINISTRACION_TIPOCARGUE_UPDATE',
  permiso_administracion_tipocargue_delete: 'ADMINISTRACION_TIPOCARGUE_DELETE',
  permiso_administracion_tipocargue_view: 'ADMINISTRACION_TIPOCARGUE_VIEW',
  permiso_administracion_tipocargue_list: 'ADMINISTRACION_TIPOCARGUE_LIST',
  permiso_administracion_tipocargue_export: 'ADMINISTRACION_TIPOCARGUE_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_TIPOCARGUE = {
  activo: 'Activo',
  descripcion: 'Descripción',
  estructuras: 'Estructuras',
  id: 'Id',
  nombre: 'Nombre',
  programaSql: 'Programa Sql',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
