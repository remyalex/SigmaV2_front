import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_lista_tipo_mezcla: '/api/administracion/lista/TIPO_MEZCLA/items/',
  path_produccion_insumo_existencia: '/api/administracion/insumoExistencia/',
  path_produccion_insumo_existencia_insumoId: '/api/administracion/insumo/',
  path_produccion_insumo_existencia_contratoId: '/api/administracion/Contrato/',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_produccion_insumo_existencia_create: 'PRODUCCION_INSUMO_EXISTENCIA_CREATE',
  permiso_produccion_insumo_existencia_update: 'PRODUCCION_INSUMO_EXISTENCIA_UPDATE',
  permiso_produccion_insumo_existencia_delete: 'PRODUCCION_INSUMO_EXISTENCIA_DELETE',
  permiso_produccion_insumo_existencia_view: 'PRODUCCION_INSUMO_EXISTENCIA_VIEW',
  permiso_produccion_insumo_existencia_list: 'PRODUCCION_INSUMO_EXISTENCIA_LIST',
  permiso_produccion_insumo_existencia_export: 'PRODUCCION_INSUMO_EXISTENCIA_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_PRODUCCION_REGISTRO_INSUMO_EXISTENCIA = {
  activo: 'Activo',
  titulo: 'Generación reporte de existencia materiales',
  fechaInicial: 'Fecha inicial',
  fechaFinal: 'Fecha final',
  inventarioInicial: 'Inventario inicial',
  inventarioFinal: 'Inventario final',
  cantidadEntrada: 'Cantidad entrada',
  cantidadSalida: 'Cantidad salida',
  producto: 'Producto',
  insumo: 'Insumo',
  codigoInsumo: 'Código',
  contrato: 'Contrato',
  unidadMedida: 'Unidad',
  tipoMezcla: 'Tipo Mezcla',
  noSolicitud: 'N° Solicitud',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS
};
