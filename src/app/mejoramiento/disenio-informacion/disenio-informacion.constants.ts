import { CONST_SHARED } from '../../shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_disenio_informacion_tipo_superficie:
    '/api/administracion/lista/DISENIO_INFORMACION_TIPO_SUPERFICIE_DISENIO/items',
  path_disenio_informacion_tipo_intervencion_final:
    '/api/administracion/lista/DISENIO_INFORMACION_TIPO_INTERVENCION_FINAL/items',
  path_disenio_informacion_metodologia_disenio:
    '/api/administracion/lista/DISENIO_INFORMACION_METODOLOGIA_DISENIO/items',
  path_disenio_informacion_material_granular:
    '/api/administracion/lista/DISENIO_INFORMACION_MATERIAL_GRANULAR/items',
  path_disenio_parametro_clasificacion_subrasante:
    '/api/administracion/lista/DISENIO_PARAMETRO_CLASIFICACION_SUBRASANTE/items',
  path_disenio_informacion_complementaria_geosinteticos:
    '/api/administracion/lista/DISENIO_INFORMACION_COMPLEMENTARIA_GEOSINTETICOS/items',
  path_disenio_informacion_complementaria_sistema_drenaje:
    '/api/administracion/lista/DISENIO_INFORMACION_COMPLEMENTARIA_SISTEMA_DRENAJE/items',
  path_disenio_capas_tipo:
    '/api/administracion/lista/DISENIO_CAPA_TIPO/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  mejoramiento_disenio_edit: 'ADMINISTRACION_TRANSICIONCONDICIONES_EDIT',
  mejoramiento_disenio_view: 'ADMINISTRACION_TRANSICIONCONDICIONES_VIEW',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_MEJORAMIENTO_DISENIO_INFORMACION = {
  tipoSuperficie: 'Tipo de Superficie de Diseño',
  tipoIntervencionFinal: 'Tipo de Intervención Final',
  metodologia: 'Metodología',
  materialGranular: 'Material Granular',
  espesor: 'Espesor(m)',
  cbrInicial: 'CBR Inicial(%)',
  observaciones: 'Observaciones',
  errorFormatoNumero: 'Solo se permiten valores numéricos.',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_MEJORAMIENTO_DISENIO_PARAMETRO = {
  clasificacionSubrasante: 'Clasificación Subrasante',
  cbrDisenio: 'CBR Diseño(%)',
  ks: 'Ks(Mpa/m)',
  nee: 'NEE',
  tpdvc: 'TPDvc',
  numeroEstructuralEfectivo: 'Número Estructural Efectivo(SNe)',
  errorValorMinimoNee: 'El valor mínimo permitido es 50000.',
  errorValorMinimoTpdvc: 'El valor mínimo permitido es 1.',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_MEJORAMIENTO_DISENIO_CAPA = {
  tipo: 'Tipo',
  espesor: 'Espesor(m)',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_MEJORAMIENTO_DISENIO_INFORMACION_COMPLEMENTARIA = {
  geosinteticos: 'Geosintéticos',
  sistemaDrenaje: 'Sistema de Drenaje',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};