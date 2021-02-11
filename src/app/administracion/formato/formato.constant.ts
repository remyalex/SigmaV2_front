import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_formato: '/api/administracion/formato/',
  path_administracion_formato_tipoDocumentoId: '/api/administracion/lista/ADMINISTRACION_DOCUMENTO_TIPO/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_formato_create: 'ADMINISTRACION_FORMATO_CREATE',
  permiso_administracion_formato_update: 'ADMINISTRACION_FORMATO_UPDATE',
  permiso_administracion_formato_delete: 'ADMINISTRACION_FORMATO_DELETE',
  permiso_administracion_formato_view: 'ADMINISTRACION_FORMATO_VIEW',
  permiso_administracion_formato_list: 'ADMINISTRACION_FORMATO_LIST',
  permiso_administracion_formato_export: 'ADMINISTRACION_FORMATO_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_FORMATO = {
  activo: 'Activo',
  archivo: 'Archivo',
  codigo: 'Código',
  id: 'Id',
  plantilla: 'Plantilla',
  formatoId: 'Formato ID',
  tipoDocumentoId: 'Tipo Documento',
  listSecciones: 'Listado de secciones',
  titulo: 'Formatos',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
