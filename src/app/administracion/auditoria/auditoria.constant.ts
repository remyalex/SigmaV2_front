import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_auditoria: '/api/administracion/auditoria',
  path_administracion_auditoria_usuarioId :'/api/usuario'
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_auditoria_create: 'ADMINISTRACION_AUDITORIA_CREATE',
  permiso_administracion_auditoria_update: 'ADMINISTRACION_AUDITORIA_UPDATE',
  permiso_administracion_auditoria_delete: 'ADMINISTRACION_AUDITORIA_DELETE',
  permiso_administracion_auditoria_view: 'ADMINISTRACION_AUDITORIA_VIEW',
  permiso_administracion_auditoria_list: 'ADMINISTRACION_AUDITORIA_LIST',
  permiso_administracion_auditoria_export: 'ADMINISTRACION_AUDITORIA_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_AUDITORIA = {
  accion: 'Accion',
  data: 'Data',
  fecha: 'Fecha',
  id: 'Id',
  objetoid: 'Objetoid',
  tabla: 'Tabla',
  usuario: 'Usuario',
  usuarioId: 'Nombre de usuario',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
