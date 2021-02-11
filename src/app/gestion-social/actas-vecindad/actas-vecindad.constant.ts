import { CONST_SHARED } from 'src/app/shared/constantes-shared';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_actas_vecindad_SiNo: '/api/administracion/lista/ACTAS_VECINDAD_SI_NO/items',
  path_actas_vecindad_estrato: '/api/administracion/lista/ACTAS_VECINDAD_ESTRATO/items',
  path_actas_vecindad_serviciosPublicos: '/api/administracion/lista/ACTAS_VECINDAD_SERVICIOS_PUBLICOS/items',
  path_actas_vecindad_usoActual: '/api/administracion/lista/ACTAS_VECINDAD_USO_ACTUAL/items',
  path_actas_vecindad_afectacion: '/api/administracion/lista/ACTAS_VECINDAD_AFECTACION/items',
  path_actas_vecindad_firmas: '/api/administracion/lista/ACTAS_VECINDAD_FIRMAS/items',
  path_actas_vecindad_tipoIntervencion: '/api/administracion/lista/TAB_ELEMENTO_ID_TIPO_INTERVENCION/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  actas_vecindad_view: 'ACTAS_VECINDAD_VIEW',
  actas_vecindad_list: 'ACTAS_VECINDAD_LIST',
  actas_vecindad_create: 'ACTAS_VECINDAD_CREATE',
  actas_vecindad_update: 'ACTAS_VECINDAD_UPDATE',
  actas_vecindad_delete: 'ACTAS_VECINDAD_DELETE',
  actas_vecindad_export: 'ACTAS_VECINDAD_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ACTAS_VECINDAD = {
  aID: 0,
  mID: 0,
  mPK: 0,
  mObject: new WorkflowMantenimientoModel,
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};