import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_recurso: '/api/administracion/recurso',
  path_administracion_recurso_frontend: '/administracion/recurso/admin',
  path_administracion_recurso_equipoId: '',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_recurso_create: 'ADMINISTRACION_RECURSO_CREATE',
  permiso_administracion_recurso_update: 'ADMINISTRACION_RECURSO_UPDATE',
  permiso_administracion_recurso_delete: 'ADMINISTRACION_RECURSO_DELETE',
  permiso_administracion_recurso_view: 'ADMINISTRACION_RECURSO_VIEW',
  permiso_administracion_recurso_list: 'ADMINISTRACION_RECURSO_LIST',
  permiso_administracion_recurso_export: 'ADMINISTRACION_RECURSO_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_RECURSO = {
  activo: 'Activo',
  disponibilidad: {
    personas: 'Disponibilidad personas',
    equipos: 'Disponibilidad equipos',
    lugares: 'Disponibilidad lugares',
  },
  equipoId: 'Equipo',
  equipocalendario: 'Equipocalendario',
  fechaDesde: 'Fecha Desde',
  fechaHasta: 'Fecha Hasta',
  id: 'Id',
  intervalo: 'Intervalo',
  tipoAsignacionId: 'Tipo Asignacion',
  tipoDisponibilidadId: 'Tipo Disponibilidad',
  turnoId: 'Turno',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
