import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_equipodisponibilidad: '/api/administracion/equipoDisponibilidad/',
  path_administracion_equipodisponibilidad_equipo: '/api/administracion/equipo',
  path_administracion_equipodisponibilidad_equipoId: '/api/administracion/equipo/search',
  path_administracion_equipodisponibilidad_tipoAsignacionId: '/api/administracion/lista/ADMINISTRACION_DISPONIBILIDAD_TIPOASIGNACION/items',
  path_administracion_equipodisponibilidad_turnoId: '/api/administracion/lista/ADMINISTRACION_DISPONIBILIDAD_TURNO/items',
  path_administracion_equipodisponibilidad_claseEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_CLASE_EQUIPO/items',
  path_administracion_equipodisponibilidad_tipoEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_TIPO_EQUIPO/items',
  path_administracion_equipodisponibilidad_marcaEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_MARCA_EQUIPO/items',
  path_administracion_equipodisponibilidad_tipoCombustibleEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_TIPO_COMBUSTIBLE/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_equipodisponibilidad_create: 'ADMINISTRACION_EQUIPODISPONIBILIDAD_CREATE',
  permiso_administracion_equipodisponibilidad_update: 'ADMINISTRACION_EQUIPODISPONIBILIDAD_UPDATE',
  permiso_administracion_equipodisponibilidad_delete: 'ADMINISTRACION_EQUIPODISPONIBILIDAD_DELETE',
  permiso_administracion_equipodisponibilidad_view: 'ADMINISTRACION_EQUIPODISPONIBILIDAD_VIEW',
  permiso_administracion_equipodisponibilidad_list: 'ADMINISTRACION_EQUIPODISPONIBILIDAD_LIST',
  permiso_administracion_equipodisponibilidad_export: 'ADMINISTRACION_EQUIPODISPONIBILIDAD_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_EQUIPODISPONIBILIDAD = {
  activo: 'Activo',
  equipoId: 'Autocomplete Equipo',
  calendarios: 'Calendarios',
  claseEquipoId: 'Clase',
  tipoEquipoId: 'Tipo',
  marcaEquipoId: 'Marca',
  lineaEquipo: 'Linea',
  placaEquipo: 'Placa',
  placaInventarioEquipo: 'Placa inventario',
  picoYplacaEquipoId: 'Pico y placa',
  tipoCombustibleEquipoId: 'Tipo combustible',
  equipocalendario: 'Equipocalendario',
  fechaDesde: 'Fecha Desde',
  fechaHasta: 'Fecha Hasta',
  id: 'Id',
  intervalo: 'Intervalo',
  tipoAsignacionId: 'Tipo Asignacion',
  turnoId: 'Turno',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
