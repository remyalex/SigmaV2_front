import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_procesotransicion_permisos: '/api/administracion/permiso',
  path_administracion_procesotransicion_procesos: '/api/administracion/proceso',
  path_administracion_procesotransicion_procesoinfolist: '/api/administracion/proceso/list',
  path_administracion_procesotransicion_actividadfinallist: '/api/administracion/proceso/info/',
  path_administracion_procesotransicion_estadoMantenimiento: '/api/administracion/lista/ESTADO_MANTENIMIENTO/items',
  path_administracion_procesotransicion_estadoPk: '/api/administracion/lista/ESTADO_PK/items',
  path_administracion_procesotransicion_tipoasignacion: '/api/administracion/lista/TAB_ACTIVIDAD_TRANSICION_ID_TIPO_ASIGNACION/items',
  path_administracion_procesotransicion_condicionList: '/api/administracion/condicion'
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_procesotransicion_create: 'ADMINISTRACION_PROCESOTRANSICION_CREATE',
  permiso_administracion_procesotransicion_update: 'ADMINISTRACION_PROCESOTRANSICION_UPDATE',
  permiso_administracion_procesotransicion_delete: 'ADMINISTRACION_PROCESOTRANSICION_DELETE',
  permiso_administracion_procesotransicion_view: 'ADMINISTRACION_PROCESOTRANSICION_VIEW',
  permiso_administracion_procesotransicion_list: 'ADMINISTRACION_PROCESOTRANSICION_LIST',
  permiso_administracion_procesotransicion_export: 'ADMINISTRACION_PROCESOTRANSICION_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_PROCESOTRANSICION = {
  permiso: 'Permiso',
  estadoPk: 'Estado PK',
  actividadFinId: 'Actividad Fin',
  actividadInicioId: 'Actividad Inicio',
  actividad: 'Actividad',
  activo: 'Activo',
  condicion: 'Condición',
  termino: 'Término',
  descripcionCondicion: 'Descripción condición',
  disponibleLista: 'DISPONIBLE',
  indicadorAsignacionId: 'Indicador de asignación',
  requiereResponsable: 'Requiere responsable',
  requiereDocumentos: 'Requiere documentos',
  requiereObservacion: 'Requiere observación',
  esMasiva: 'Masiva',
  reasignable: 'Reasignable',
  descripcion: 'Descripción',
  id: 'Id',
  nombre: 'Nombre',
  procesoId: 'Proceso',
  permisoId: 'Permiso',
  tipoAsignacionId: 'Tipo de asignación',
  tipoAsignacionLista: 'TAB_ACTIVIDAD_TRANSICION_ID_TIPO_ASIGNACION',
  estadoId: 'Estado pk',
  estadoMantenimiento: 'Estado mantenimiento',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
