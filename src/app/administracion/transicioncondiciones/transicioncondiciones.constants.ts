import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_condicion: '/api/database/condicion',
  path_administracion_condicion_crud: '/api/administracion/condicion',
  path_administracion_terminos_condicion: '/api/administracion/termino/findbycondicion'
};
/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  administracion_transicioncondiciones_create: 'ADMINISTRACION_TRANSICIONCONDICIONES_CREATE',
  administracion_transicioncondiciones_update: 'ADMINISTRACION_TRANSICIONCONDICIONES_UPDATE',
  administracion_transicioncondiciones_delete: 'ADMINISTRACION_TRANSICIONCONDICIONES_DELETE',
  administracion_transicioncondiciones_view: 'ADMINISTRACION_TRANSICIONCONDICIONES_VIEW',
  administracion_transicioncondiciones_list: 'ADMINISTRACION_TRANSICIONCONDICIONES_LIST',
  administracion_transicioncondiciones_export: 'ADMINISTRACION_TRANSICIONCONDICIONES_EXPORT',
};
/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_TRANSICIONCONDICIONES = {
  descripcion: 'Descripción',
  activo: 'Activo',
  consecutivo: 'Consecutivo',
  operadorLogico: 'Operador Lógico',
  atributo: 'Atributo',
  operador: 'Operador',
  valor: 'Valor',
  descripcionValor: 'Valor',
  valorIn : 'valor',
  descripcionValorIn: 'Valor',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};


export const OPERADORES_LOGICOS = [
  'AND',
  'OR',
  'AND NOT',
  'OR NOT',
  'AND (',
  'OR (',
  'AND NOT (',
  'OR NOT (',
  ')'
];

export const OPERADORES_BASICOS = [
  '=',
  '<>',
  'NULL',
  'NOT NULL',
  'IN',
  'NOT IN'
];

export const OPERADORES_ALL = [
  '=',
  '>=',
  '<=',
  '>',
  '<',
  '<>',
  'NULL',
  'NOT NULL',
  'IN',
  'NOT IN'
];
