import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_equipoFalla: '/api/produccion/equipoFalla',
  path_administracion_equipo_anioModeloId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_ANIO_MODELO/items',
  path_administracion_tipoFallaEquipo: '/api/administracion/lista/TIPO_FALLA_EQUIPO/items',
  path_administracion_equipo_list: '/api/administracion/equipo',
  path_administracion_equipo_propio_list: '/api/administracion/equipo/listarEquiposPropios/'
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_produccion_equipo_falla_create: 'PRODUCCION_EQUIPO_FALLA_CREATE',
  permiso_produccion_equipo_falla_update: 'PRODUCCION_EQUIPO_FALLA_UPDATE',
  permiso_produccion_equipo_falla_delete: 'PRODUCCION_EQUIPO_FALLA_DELETE',
  permiso_produccion_equipo_falla_view: 'PRODUCCION_EQUIPO_FALLA_VIEW',
  permiso_produccion_equipo_falla_list: 'PRODUCCION_EQUIPO_FALLA_LIST'
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_PRODUCCION_EQUIPOFALLA = {
  aceptar: 'Aceptar',
  cancelar: 'Cancelar',
  titleEquipoFallaCreate: 'Confirmación Programación Falla',
  bodyEquipoFallaCreate: '¿Está seguro de reportar la falla?, para reportarla presione Si, de lo contrario presione No.',
  titleEquipoFallaCancel: 'Confirmación Cancelación',
  // tslint:disable-next-line: max-line-length
  bodyEquipoFallaCancel: '¿Está seguro de eliminar el mantenimiento definitivamente del sistema?, para eliminarlo presione Si, de lo contrario presione No.',
  titleEquipoFallaMotivo: 'Cancelación de Reporte de Falla',
  bodyEquipoFallaMotivo: 'Motivo de cancelación',
  tipoFalla: 'Tipo Falla',
  equipo_name: 'Equipos',
  activo: 'Activo',
  anioModeloId: 'Año Modelo',
  areaUmvId: 'Área Umv',
  cilindraje: 'Cilindraje',
  claseEquipoId: 'Clase Equipo',
  color: 'Color',
  estadoEquipoId: 'Estado',
  fechaDesde: 'Fecha Desde',
  fechaHasta: 'Fecha Hasta',
  fechaSiguienteMantenimiento: 'Fecha Siguiente Mantenimiento',
  fechaUltimoMantenimiento: 'Fecha Último Mantenimiento',
  horaFinProgramacion: 'Hora Fin Programación',
  horaInicioProgramacion: 'Hora Inicio Programación',
  horasMantenimiento: 'Horas de Mantenimiento',
  id: 'Id',
  kilometrosMantenimiento: 'Kilometros Mantenimiento',
  linea: 'Línea',
  lugarUmvId: 'Lugar Umv',
  lugar: 'Lugar',
  marcaEquipoId: 'Marca Equipo',
  movil: 'Móvil',
  numeroChasis: 'Número Chasis',
  numeroInterno: 'Número Interno',
  numeroMotor: 'Número Motor',
  origenEquipoId: 'Origen Equipo',
  picoYPlaca: 'Pico Placa',
  placa: 'Placa',
  placaInventario: 'Placa Inventario',

  tipoEquipoId: 'Tipo Equipo',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
