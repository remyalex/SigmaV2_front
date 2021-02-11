import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_usuario: '/api/usuario',
  path_administracion_usuario_origenId: '/api/administracion/lista/USUARIO_ORIGEN/items',
  path_administracion_usuario_roles: '/api/administracion/rol/getActivos',
  path_administracion_usuario_roles_incluidos_asignados: '/api/administracion/rol/getRolesUsuario/{usuarioId}',
  path_administracion_usuario_estadoId: '/api/administracion/lista/TAB_USUARIO_ID_TIPO_ESTADO/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_usuario_create: 'ADMINISTRACION_USUARIO_CREATE',
  permiso_administracion_usuario_update: 'ADMINISTRACION_USUARIO_UPDATE',
  permiso_administracion_usuario_delete: 'ADMINISTRACION_USUARIO_DELETE',
  permiso_administracion_usuario_view: 'ADMINISTRACION_USUARIO_VIEW',
  permiso_administracion_usuario_list: 'ADMINISTRACION_USUARIO_LIST',
  permiso_administracion_usuario_export: 'ADMINISTRACION_USUARIO_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_USUARIO = {
  activo: 'Activo',
  apellidos: 'Apellidos',
  clave: 'Clave',
  claveConfirmacion: 'Confirmar Clave',
  correoElectronico: 'Correo Electrónico',
  estado: 'Estado',
  id: 'Id',
  identificacion: 'Identificación',
  nombres: 'Nombres',
  nombre: 'Nombre',
  origenId: 'Origen',
  login: 'Login',
  usuario: 'Usuario',
  usuarioExterno: 'USUARIO EXTERNO', // No cambiar
  usuarioString: 'Usuario',
  changePassword: 'Cambiar contraseña',
  roles: 'Roles',
  zonaAsociada: 'Zona Asociada',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
