import { CONST_SHARED } from 'src/app/shared/constantes-shared';

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
  permiso_produccion_resultados_densidades_create: 'PRODUCCION_ENSAYOS_CREATE',
  permiso_produccion_resultados_densidades_update: 'PRODUCCION_ENSAYOS_UPDATE',
  permiso_produccion_resultados_densidades_delete: 'PRODUCCION_ENSAYOS_DELETE',
  permiso_produccion_resultados_densidades_view: 'PRODUCCION_ENSAYOS_VIEW',
  permiso_produccion_resultados_densidades_list: 'PRODUCCION_ENSAYOS_LIST',
  permiso_produccion_resultados_densidades_export: 'PRODUCCION_ENSAYOS_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_PRODUCCION_RESULTADOS_DENSIDADES = {
  numero: 'Número',
  pk: 'pk',
  tipo_ensayo: 'Tipo',
  fecha_solicitud: 'Fecha solicitud',
  usuario: 'Usuario solicitud',
  fecha_ensayo: 'Fecha ensayo',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
