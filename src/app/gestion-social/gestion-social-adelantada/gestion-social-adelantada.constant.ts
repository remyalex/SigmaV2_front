import { GestionSocialAdelantadaModel } from './models/gestion-social-adelantada.model';
import { CONST_SHARED } from 'src/app/shared/constantes-shared';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';

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
  encuesta_satisfaccion_view: 'SOCIAL_REGISTRAR_GESTION_ADELANTADA_VIEW',
  encuesta_satisfaccion_list: 'SOCIAL_REGISTRAR_GESTION_ADELANTADA_LIST',
  encuesta_satisfaccion_create: 'SOCIAL_REGISTRAR_GESTION_ADELANTADA_CREATE',
  encuesta_satisfaccion_update: 'SOCIAL_REGISTRAR_GESTION_ADELANTADA_UPDATE',
  encuesta_satisfaccion_saveall: 'SOCIAL_REGISTRAR_GESTION_ADELANTADA_SAVE_ALL',
  encuesta_satisfaccion_export: 'SOCIAL_REGISTRAR_GESTION_ADELANTADA_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_SOCIAL_REGISTRAR_GESTION_ADELANTADA = {
  aID: 0,
  mID: 0,
  mPK: 0,
  mObject: new WorkflowMantenimientoModel,
  gObject: new GestionSocialAdelantadaModel,
  currentActionString: null,
  accionesAdelantadas: 'Acciones adelantadas',
  tipoIntervencion: 'Tipo intervención',
  otroTipoIntervencion: 'Otro tipo intervención',
  localidadad: 'Localidad',
  upla: 'Upz',
  barrio: 'Barrio',
  nomenclatura: 'Nomenclatura',
  frenteObra: 'Frente obra',
  pk: 'Pk',
  civ: 'CIV',
  mTurno: '',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};