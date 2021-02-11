import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_tipocargueestructura: '/api/administracion/tipocargueestructura',
  path_administracion_tipocargue: '/api/administracion/tipocargue',
  path_administracion_tipocargueestructura_listaId: '/api/administracion/lista',
  path_administracion_tipocargueestructura_requeridoId: '/api/administracion/lista/ADMINISTRACION_REQUERIDO/items',
  path_administracion_tipocargueestructura_tipoCargueId: '/api/administracion/lista/ADMINISTRACION_TIPO_CARGUE/items',
  path_administracion_tipocargueestructura_tipoDatoId: '/api/administracion/lista/ADMINISTRACION_TIPO_DATO/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_tipocargueestructura_create: 'ADMINISTRACION_TIPOCARGUEESTRUCTURA_CREATE',
  permiso_administracion_tipocargueestructura_update: 'ADMINISTRACION_TIPOCARGUEESTRUCTURA_UPDATE',
  permiso_administracion_tipocargueestructura_delete: 'ADMINISTRACION_TIPOCARGUEESTRUCTURA_DELETE',
  permiso_administracion_tipocargueestructura_view: 'ADMINISTRACION_TIPOCARGUEESTRUCTURA_VIEW',
  permiso_administracion_tipocargueestructura_list: 'ADMINISTRACION_TIPOCARGUEESTRUCTURA_LIST',
  permiso_administracion_tipocargueestructura_export: 'ADMINISTRACION_TIPOCARGUEESTRUCTURA_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_TIPOCARGUEESTRUCTURA = {
  activo: 'Activo',
  campo: 'Campo',
  descripcion: 'Descripción',
  fechaMaximaLabel: 'Fecha Máxima',
  fechaMinimaLabel: 'Fecha Mínima',
  id: 'Id',
  listaId: 'Lista',
  longitudMaxima: 'Longitud Máxima',
  numeroMaximo: 'Número Máximo',
  numeroMinimo: 'Número Mínimo',
  requeridoId: 'Requerido',
  tipoCargueId: 'Tipo Cargue',
  tipoDatoId: 'Tipo Dato',
  valorMinimo: 'El valor mínimo del campo no puede ser menor a cero (0).',
  valorMaximo: 'El valor máximo del campo no puede ser mayor a 9007199254740991.',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
