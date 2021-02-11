import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_equipoconductor: '/api/administracion/equipoconductor/',
  path_administracion_equipoconductorcargue: '/api/administracion/equipoconductorcargue',
  path_administracion_equipoconductor_conductorPersAutocomplete: '/api/administracion/persona/searchAutocompleteNyA',
  path_administracion_equipoconductor_equipoAutocomplete: '/api/administracion/equipo/searchAutocompletar',

  path_administracion_equipoconductor_equipo: '/api/administracion/equipo',
  path_administracion_equipoconductor_equipoId: '/api/administracion/equipo/search',
  path_administracion_equipoconductor_diaSemanaId: '/api/administracion/lista/DIA_SEMANA_CARGUE_VEHICULO/items',
  path_administracion_equipoconductor_tipoVehiculoContratacion: '/api/administracion/lista/TIPO_VEHICULO_CONTRATADO/items',
  // path_administracion_equipoconductor_turnoId: '/api/administracion/lista/ADMINISTRACION_DISPONIBILIDAD_TURNO/items',
  // path_administracion_equipoconductor_claseEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_CLASE_EQUIPO/items',
  // path_administracion_equipoconductor_tipoEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_TIPO_EQUIPO/items',
  // path_administracion_equipoconductor_marcaEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_MARCA_EQUIPO/items',
  // path_administracion_equipoconductor_tipoCombustibleEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_TIPO_COMBUSTIBLE/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_equipoconductor_create: 'ADMINISTRACION_EQUIPOCONDUCTOR_CREATE',
  permiso_administracion_equipoconductor_update: 'ADMINISTRACION_EQUIPOCONDUCTOR_UPDATE',
  permiso_administracion_equipoconductor_delete: 'ADMINISTRACION_EQUIPOCONDUCTOR_DELETE',
  permiso_administracion_equipoconductor_view: 'ADMINISTRACION_EQUIPOCONDUCTOR_VIEW',
  permiso_administracion_equipoconductor_list: 'ADMINISTRACION_EQUIPOCONDUCTOR_LIST',
  permiso_administracion_equipoconductor_export: 'ADMINISTRACION_EQUIPOCONDUCTOR_EXPORT',
};


/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_EQUIPOCONDUCTOR = {
  titulo: 'Información de vehículo por semana',
  activo: 'Activo',
  vehiculo: 'Vehículo',
  numeroVehiculo: 'Número del vehículo',
  conductor: 'Conductor',
  equipo: 'Móvil',
  placa: 'Placa',
  movil: 'N° Móvil',
  numeroInterno: 'Número Interno',
  celular: 'Celular',
  dias: 'Dias',
  tipoVehiculoContratado: 'Tipo de vehículo',
  desde: 'Fecha de utilización del vehículo desde',
  hasta: 'Fecha de utilización del vehículo hasta',
  desdeColumn: 'Fecha desde',
  hastaColumn: 'Fecha hasta',
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo',
  id: 'Id',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
