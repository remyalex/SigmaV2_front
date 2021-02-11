import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_personas_con_usuarios_y_rol_ingeniero_disenio: '/api/administracion/persona/findAllPersonasIngenierosDisenio',
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
export const CONST_ASIGNAR_VISITA_PREDISENIO = {

  ingenieroDisenio: 'Ingeniero de Diseño',
  // tslint:disable-next-line: max-line-length
  mensajeConfirmacion: '¿Desea continuar?, La busqueda realizada no arrojo resultados, sin embargo, tiene seleccionados los siguientes PK: ',

  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
