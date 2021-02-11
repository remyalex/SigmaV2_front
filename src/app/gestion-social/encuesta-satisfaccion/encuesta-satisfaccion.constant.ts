import { CONST_SHARED } from 'src/app/shared/constantes-shared';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_encuesta_satisfaccion_SiNo: '/api/administracion/lista/ENCUESTA_SATISFACCION_SI_NO/items',
  path_encuesta_satisfaccion_beneficios: '/api/administracion/lista/ENCUESTA_SATISFACCION_BENEFICIOS/items',
  path_encuesta_satisfaccion_calificacion: '/api/administracion/lista/ENCUESTA_SATISFACCION_CALIFICACION/items',
  path_encuesta_satisfaccion_pqrs: '/api/administracion/lista/ENCUESTA_SATISFACCION_PQRS/items',
  path_encuesta_satisfaccion_tipoId: '/api/administracion/lista/ENCUESTA_SATISFACCION_TIPO_ID/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  encuesta_satisfaccion_view: 'ENCUESTA_SATISFACCION_VIEW',
  encuesta_satisfaccion_list: 'ENCUESTA_SATISFACCION_LIST',
  encuesta_satisfaccion_create: 'ENCUESTA_SATISFACCION_CREATE',
  encuesta_satisfaccion_update: 'ENCUESTA_SATISFACCION_EDIT',
  encuesta_satisfaccion_saveall: 'ENCUESTA_SATISFACCION_SAVE_ALL',
  encuesta_satisfaccion_export: 'ENCUESTA_SATISFACCION_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ENCUESTA_SATISFACCION = {
  aID: 0,
  mID: 0,
  mPK: 0,
  mObject: new WorkflowMantenimientoModel,
  mTurno: '',
  turnoDiurno: 'DIURNA',
  turnoNocturno: 'NOCTURNA',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};