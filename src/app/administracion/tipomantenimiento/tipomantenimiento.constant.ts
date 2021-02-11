import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_tipomantenimiento: '/api/administracion/tipomantenimiento/',
  path_administracion_tipomantenimiento_claseMantenimientoId: '/api/administracion/lista/ADMINISTRACION_CLASE_MANTENIMIENTO/items',
  path_administracion_tipomantenimiento_tipoEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_TIPO_EQUIPO/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_tipomantenimiento_create: 'ADMINISTRACION_TIPOMANTENIMIENTO_CREATE',
  permiso_administracion_tipomantenimiento_update: 'ADMINISTRACION_TIPOMANTENIMIENTO_UPDATE',
  permiso_administracion_tipomantenimiento_delete: 'ADMINISTRACION_TIPOMANTENIMIENTO_DELETE',
  permiso_administracion_tipomantenimiento_view: 'ADMINISTRACION_TIPOMANTENIMIENTO_VIEW',
  permiso_administracion_tipomantenimiento_list: 'ADMINISTRACION_TIPOMANTENIMIENTO_LIST',
  permiso_administracion_tipomantenimiento_export: 'ADMINISTRACION_TIPOMANTENIMIENTO_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_TIPOMANTENIMIENTO = {
  activo: 'Activo',
  claseMantenimientoId: 'Clase Mantenimiento',
  descripcion: 'Descripción',
  duracion: 'Duración (Días)',
  id: 'Id',
  nombre: 'Nombre',
  procedimiento: 'Procedimiento',
  tipoEquipoId: 'Tipo Equipo',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
