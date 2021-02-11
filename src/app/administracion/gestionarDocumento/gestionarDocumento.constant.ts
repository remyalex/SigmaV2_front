import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_gestionarDocumento: '/api/administracion/documento',
  path_administracion_gestionarDocumento_tipoDocumentoId: '/api/administracion/lista/ADMINISTRACION_DOCUMENTO_TIPO/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_gestionarDocumento_view: 'ADMINISTRACION_DOCUMENTO_VIEW',
  permiso_administracion_gestionarDocumento_list: 'ADMINISTRACION_DOCUMENTO_LIST',
  permiso_administracion_gestionarDocumento_export: 'ADMINISTRACION_DOCUMENTO_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_GESTIONAR_DOCUMENTO = {
  tipo: 'Tipo de Documento',
  numero: 'Radicado',
  descripcion: 'Descripción',
  fecha: 'Fecha',
  autor: 'Usuario',
  activo: 'Activo',
  archivo: 'Archivo',
  id: 'Id',
  nombre: 'Nombre',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
