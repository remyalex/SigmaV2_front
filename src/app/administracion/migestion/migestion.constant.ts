import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_migestion: '/api/administracion/migestion',
  path_administracion_migestion_permisoId: '/api/usuario/permisos',
  path_administracion_migestion_actividadId: '/api/administracion/actividad',
  path_administracion_migestion_estadoPk: '/api/administracion/lista/ESTADO_PK/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_migestion_list: 'ADMINISTRACION_MIGESTION_LIST'
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_MIGESTION = {
  pk: 'Pk',
  actividadActual: 'Tipo',
  fecha: 'Fecha',
  estadoPk: 'Estado',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
