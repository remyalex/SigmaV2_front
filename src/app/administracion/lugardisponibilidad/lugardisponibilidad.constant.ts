import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_lugardisponibilidad:
    '/api/administracion/lugardisponibilidad/',
  path_administracion_lugardisponibilidad_lugar:
    '/api/administracion/lugar',
  path_administracion_lugardisponibilidad_lugarId:
    '/api/administracion/lugar/searchAutocompletar',
  path_administracion_lugardisponibilidad_tipoAsignacionId:
    '/api/administracion/lista/ADMINISTRACION_DISPONIBILIDAD_TIPOASIGNACION/items',
  path_administracion_lugardisponibilidad_turnoId:
    '/api/administracion/lista/ADMINISTRACION_DISPONIBILIDAD_TURNO/items',
  path_administracion_lugardisponibilidad_tipoLugarId:
    '/api/administracion/lista/ADMINISTRACION_LUGAR_TIPO/items',
  path_administracion_lugardisponibilidad_origenLugarId:
    '/api/administracion/lista/ADMINISTRACION_LUGAR_ORIGEN/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_lugardisponibilidad_create: 'ADMINISTRACION_LUGARDISPONIBILIDAD_CREATE',
  permiso_administracion_lugardisponibilidad_update: 'ADMINISTRACION_LUGARDISPONIBILIDAD_UPDATE',
  permiso_administracion_lugardisponibilidad_delete: 'ADMINISTRACION_LUGARDISPONIBILIDAD_DELETE',
  permiso_administracion_lugardisponibilidad_view: 'ADMINISTRACION_LUGARDISPONIBILIDAD_VIEW',
  permiso_administracion_lugardisponibilidad_list: 'ADMINISTRACION_LUGARDISPONIBILIDAD_LIST',
  permiso_administracion_lugardisponibilidad_export: 'ADMINISTRACION_LUGARDISPONIBILIDAD_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_LUGARDISPONIBILIDAD = {
  activo: 'Activo',
  tipo: 'Tipo',
  origen: 'Origen',
  nombre: 'Nombre',
  descripcion: 'Descripción',
  direccion: 'Dirección',
  fechaDesde: 'Fecha desde',
  fechaHasta: 'Fecha hasta',
  id: 'Id',
  intervalo: 'Intervalo',
  lugarId: 'Lugar',
  lugarNombre: 'Lugar Nombre',
  lugarcalendario: 'Lugar calendario',
  tipoAsignacionId: 'Tipo asignación',
  turnoId: 'Turno',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
