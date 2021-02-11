import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_tipointervencion: '/api/administracion/tipoIntervencion',
  path_administracion_tipointervencion_tipoSuperficieId: '/api/administracion/lista/MEJORAMIENTO_TIPO_SUPERFICIE/items',
  path_administracion_tipointervencion_referenciaIntervencionId:
    '/api/administracion/lista/MEJORAMIENTO_REFERENCIA_TIPO_INTERVENCION/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_tipointervencion_create: 'ADMINISTRACION_TIPOINTERVENCION_CREATE',
  permiso_administracion_tipointervencion_update: 'ADMINISTRACION_TIPOINTERVENCION_UPDATE',
  permiso_administracion_tipointervencion_delete: 'ADMINISTRACION_TIPOINTERVENCION_DELETE',
  permiso_administracion_tipointervencion_view: 'ADMINISTRACION_TIPOINTERVENCION_VIEW',
  permiso_administracion_tipointervencion_list: 'ADMINISTRACION_TIPOINTERVENCION_LIST',
  permiso_administracion_tipointervencion_export: 'ADMINISTRACION_TIPOINTERVENCION_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_TIPOINTERVENCION = {
  activo: 'Activo',
  descripcion: 'Descripción',
  id: 'Id',
  tipoSuperficieId: 'Tipo Superficie',
  referenciaIntervencionId: 'Elemento Tipo Intervención',
  valor: 'Valor',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
