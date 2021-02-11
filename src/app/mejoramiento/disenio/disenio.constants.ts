import { CONST_SHARED } from '../../shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {};
/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  mejoramiento_diseino_create: 'MEJORAMIENTO_DISENIO_CREATE',
  mejoramiento_diseino_update: 'MEJORAMIENTO_DISENIO_UPDATE',
  mejoramiento_diseino_view: 'MEJORAMIENTO_DISENIO_VIEW',
};
/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_MEJORAMIENTO_DISEINO = {
  apiques: 'Apiques',
  aforos: 'Aforos',
  consultaRedes: 'Operador Lógico',
  modulacionLosas: 'Atributo',
  levantamientoTopografico: 'Operador',
  fichaEvaluacion: 'Valor',
  informacionDiseño: 'Valor',
  otrosDocumentos: 'Valor',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
