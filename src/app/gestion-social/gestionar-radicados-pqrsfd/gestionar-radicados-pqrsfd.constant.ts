import { CONST_SHARED } from 'src/app/shared/constantes-shared';
import { CONST_ADMINISTRACION_MANTENIMIENTO } from 'src/app/administracion/grupo/mantenimiento/mantenimiento.constant';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_produccion_usuario_autocompletar: '/api/usuario/searchAutocomplete',
  path_produccion_persona_tipoEnsayo: '/api/administracion/lista/PRODUCCION_TIPO_ENSAYO/items',
  path_social_tipo_pieza_divulgar: '/api/administracion/lista/SOCIAL_TIPO_PIEZA_A_DIVULGAR/items'
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_social_radicados_prqsfd_list: 'SOCIAL_GESTIONAR_RADICADOS_PQRSFD_LIST',
  permiso_social_radicados_prqsfd_view: 'SOCIAL_GESTIONAR_RADICADOS_PQRSFD_VIEW',
  permiso_social_radicados_prqsfd_edit: 'SOCIAL_GESTIONAR_RADICADOS_PQRSFD_EDIT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_GESTIONAR_RADICADOS_PQRSFD = {
  activo: 'Activo',
  numeral: 'Numeral Ascendente',
  vincularRadicado: 'vincularRadicado',
  eliminarRadicado: 'eliminarRadicado',
  informacionRadicado: 'Información radicado',
  btnBuscarRadicado: 'Buscar Radicado',
  nroRadicado: 'Nro. Radicado De Salida',
  fechaRadicadoOrfeo: 'Fecha Radicado De Orfeo',

  ...CONST_SHARED,
  ...CONST_ADMINISTRACION_MANTENIMIENTO,
  ...PATHS,
  ...PERMISOS,
};
