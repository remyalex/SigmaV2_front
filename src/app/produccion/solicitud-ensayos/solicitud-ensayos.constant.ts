import { CONST_SHARED } from 'src/app/shared/constantes-shared';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_produccion_usuario_autocompletar: '/api/usuario/searchAutocomplete',
  path_produccion_persona_tipoEnsayo: '/api/administracion/lista/PRODUCCION_TIPO_ENSAYO/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_produccion_ensayos_create: 'PRODUCCION_ENSAYOS_CREATE',
  permiso_produccion_ensayos_update: 'PRODUCCION_ENSAYOS_UPDATE',
  permiso_produccion_ensayos_delete: 'PRODUCCION_ENSAYOS_DELETE',
  permiso_produccion_ensayos_view: 'PRODUCCION_ENSAYOS_VIEW',
  permiso_produccion_ensayos_list: 'PRODUCCION_ENSAYOS_LIST',
  permiso_produccion_ensayos_export: 'PRODUCCION_ENSAYOS_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_PRODUCCION_SOLICITUD_ENSAYOS = {
  numero: 'Número',
  pk: 'pk',
  tipo_ensayo: 'Tipo',  
  fecha_solicitud: 'Fecha solicitud',
  usuario: 'Usuario solicitud',
  fecha_ensayo: 'Fecha ensayo',
  pkListar: 0,
  mObject: new WorkflowMantenimientoModel,
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};