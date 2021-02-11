import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_formato_return: '/administracion/formato/admin',
  path_administracion_formatoId: '/api/administracion/formato',
  path_administracion_formatoseccion: '/api/administracion/formatoseccion'
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_formatoseccion_create: 'ADMINISTRACION_FORMATOSECCION_CREATE',
  permiso_administracion_formatoseccion_update: 'ADMINISTRACION_FORMATOSECCION_UPDATE',
  permiso_administracion_formatoseccion_delete: 'ADMINISTRACION_FORMATOSECCION_DELETE',
  permiso_administracion_formatoseccion_view: 'ADMINISTRACION_FORMATOSECCION_VIEW',
  permiso_administracion_formatoseccion_list: 'ADMINISTRACION_FORMATOSECCION_LIST',
  permiso_administracion_formatoseccion_export: 'ADMINISTRACION_FORMATOSECCION_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_FORMATOSECCION = {
  activo: 'Activo',
  descripcion: 'Descripción',
  errorFormato: 'No se ha indicado el formato para registrar las secciones',
  formatoId: 'Formato ID',
  plantilla: 'Plantilla',
  formatoSeccionId: 'Sección',
  id: 'Id',
  nombre: 'Nombre',
  orden: 'Orden',
  listCampos: 'Listado de campos',
  titulo: 'Formato sección',
  regresarFormato: 'Regresar al formato',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
