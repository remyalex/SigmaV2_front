import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
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
export const CONST_ASIGNAR_RESIDENTE_SOCIAL = {

  residenteSocial: 'Residente Social',
  personas: 'Asignar Residente Social',
  zona: 'Zona',
  asignacion: 'asignacion',
  edicion: 'edicion',
  guardado: 'guardado',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS

};
