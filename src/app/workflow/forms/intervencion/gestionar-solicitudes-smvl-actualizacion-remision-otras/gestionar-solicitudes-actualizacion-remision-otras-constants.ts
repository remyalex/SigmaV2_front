import { CONST_SHARED } from 'src/app/shared/constantes-shared';


/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_lista_chequeo_definicion_solicitud_actualizacion:
  '/api/administracion/lista/LISTA_CHEQUEO_DEFINICION_SOLICITUD_ACTUALIZACION_DIAGNOSTICO/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_GESTIONAR_SOLICITUDES_ACTUALIZACION_REMISION_OTRAS = {
  activo: 'Activo',
  lista_chequeo: 'Lista de chequeo',
  fechaRadicadoSolicitud: 'Fecha radicado solicitud',
  numeroRadicadoSolicitud: 'Número radicado solicitud',
  verDiagnosticoMejoramiento: 'verDiagnosticoMejoramiento',
  VerDiagnosticoIntervencion: 'VerDiagnosticoIntervencion',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
