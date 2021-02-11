import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_planillaoperaciones: '/api/administracion/planillaItem/',
  path_administracion_unidades_medida: '/api/administracion/lista/UNIDADES_MEDIDA/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_planillaoperaciones_create: 'ADMINISTRACION_PLANILLAOPERACIONES_CREATE',
  permiso_administracion_planillaoperaciones_update: 'ADMINISTRACION_PLANILLAOPERACIONES_UPDATE',
  permiso_administracion_planillaoperaciones_delete: 'ADMINISTRACION_PLANILLAOPERACIONES_DELETE',
  permiso_administracion_planillaoperaciones_view: 'ADMINISTRACION_PLANILLAOPERACIONES_VIEW',
  permiso_administracion_planillaoperaciones_list: 'ADMINISTRACION_PLANILLAOPERACIONES_LIST'
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_PLANILLAOPERACIONES = {
    crearItem: 'Crear Item',
    tipoTarjeta: 'Tipo Tarjeta',
    itemName: 'Item',
    unidadMedida: 'Unidad',
    actividadName: 'Actividad',
    activoName: 'Activo',
    operaciones: 'Operaciones',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
