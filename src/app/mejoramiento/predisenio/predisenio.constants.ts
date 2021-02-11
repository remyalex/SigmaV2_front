import { CONST_SHARED } from '../../shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_grupo_tipoSolicitudApiqueId: '/api/administracion/lista/MEJORAMIENTO_TIPO_SOLICITUD_APIQUE/items',
};
/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  mejoramiento_prediseino_create: 'MEJORAMIENTO_PREDISENIO_CREATE',
  mejoramiento_prediseino_update: 'MEJORAMIENTO_PREDISENIO_UPDATE',
  mejoramiento_prediseino_view: 'MEJORAMIENTO_PREDISENIO_VIEW',
  mejoramiento_predisenio_ubicar_apique_view: 'MEJORAMIENTO_PREDISENIO_UBICAR_APIQUE_VIEW',
  mejoramiento_predisenio_ubicar_apique_update: 'MEJORAMIENTO_PREDISENIO_UBICAR_APIQUE_UPDATE',
  mejoramiento_predisenio_ubicar_apique_create: 'MEJORAMIENTO_PREDISENIO_UBICAR_APIQUE_CREATE',
};
/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_MEJORAMIENTO_PREDISENIO = {
  apiques: 'Requiere apiques?', 
  aforos: 'Requiere aforos?',
  solicitud: 'Solicitudes adicionales',
  observacionSolicitud: 'Observación Solicitud',
  viableIntervencion: 'El segmento es viable para intervención?',
  observacionIntervencion: 'Observación',
  observacionGestion: 'Observación gestión',
  actividades: 'Selección de actividades',
  ubicarApique: 'Ubicar apique',
  nomenclatura: 'Nomenclatura',
  observacion: 'Observación',
  cantidadApiques: 'Cantidad Apiques',
  tipoSolicitud: 'Tipo Solicitud Apique',
  fechaCreacion: 'Fecha de Creación',
  levantamientoTopografico: 'Requiere levantamiento topografico?',
  modulacionLosas: 'Requiere modulación de losas?',
  campoRequerido: 'Campo requerido',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
