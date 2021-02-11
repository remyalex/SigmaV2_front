import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_workflow_transiciones_usuarios_asignables: '/api/usuario/usuariosTransicion/',
  path_workflow_transiciones_usuario_asignado: '/api/usuario/usuarioAsignado/'
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {

};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_WORKFLOW_SELECCIONAR_TRANSICION = {
  campoRequerido: 'Campo requerido',
  longitud_maxima: 'lONGITUD mAXIMA',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
