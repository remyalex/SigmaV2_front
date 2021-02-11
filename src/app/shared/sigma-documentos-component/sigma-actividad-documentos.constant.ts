import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_documento_permisos: '/api/administracion/permiso',
  path_administracion_documento_procesoId: '/api/administracion/lista/ADMINISTRACION_PROCESO/items',
  path_administracion_documento_tipoasignacion: '/api/administracion/lista/TAB_ACTIVIDAD_TRANSICION_ID_TIPO_ASIGNACION/items',
  path_administracion_documento_tipoDocumento: '/api/administracion/lista/ADMINISTRACION_DOCUMENTO_TIPO/items',
  path_administracion_documento_estadoDocumento: '/api/administracion/lista/ADMINISTRACION_DOCUMENTO_ESTADO/items',
  path_administracion_documento: '/api/administracion/documento',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_documento_create: 'ADMINISTRACION_DOCUMENTO_CREATE',
  permiso_administracion_documento_update: 'ADMINISTRACION_DOCUMENTO_UPDATE',
  permiso_administracion_documento_delete: 'ADMINISTRACION_DOCUMENTO_DELETE',
  permiso_administracion_documento_view: 'ADMINISTRACION_DOCUMENTO_VIEW',
  permiso_administracion_documento_list: 'ADMINISTRACION_DOCUMENTO_LIST',
  permiso_administracion_documento_export: 'ADMINISTRACION_DOCUMENTO_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_DOCUMENTOS_COMPONENTE = {
  activo: 'Activo',
  descripcion: 'Descripción',
  id: 'Id',
  nombre: 'Nombre',
  procesoId: 'Proceso',
  permisoId: 'Permiso',
  duracion: 'Duración',
  url: 'Url',
  componenteUI: 'Componente UI',
  actividad: 'Actividad',
  estado: 'Estado',
  tipoDocumento: 'Tipo Documento',
  estadoDocumento: 'Estado Documento',
  pk: 'PK',
  archivo: 'Archivo',
  agregar: 'Agregar',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
