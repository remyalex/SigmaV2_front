import { CONST_SHARED } from 'src/app/shared/constantes-shared';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  // path_actas_vecindad_SiNo: '/api/administracion/lista/ACTAS_VECINDAD_SI_NO/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  aprobar_actas_view: 'APROBAR_ACTAS_VIEW',
  aprobar_actas_list: 'APROBAR_ACTAS_LIST',
  aprobar_actas_aprove: 'APROBAR_ACTAS_APROVE',
  aprobar_actas_save_all: 'APROBAR_ACTAS_SAVE_ALL',
  aprobar_actas_export: 'APROBAR_ACTAS_EXPORT',
  actas_vecindad_update: 'ACTAS_VECINDAD_UPDATE'
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_APROBAR_ACTAS = {
  rutaBaseGestionSocial: '/gestion-social/aprobar-actas/',
  rutaBaseGestionSocialWorkflow: '/workflow/social/',
  aID: 0,
  mID: 0,
  mPK: 0,
  mObject: new WorkflowMantenimientoModel,
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
