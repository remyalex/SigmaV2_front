import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_produccion_mantenimientos_programados: '/api/administracion/MantenimientoProgramado',
  path_administracion_equipo: '/api/administracion/equipo',
  path_administracion_talleres: '/api/administracion/lista/UMV_TALLERES/items',
  path_administracion_tipomantenimiento: '/api/administracion/lista/TIPO_MANTENIMIENTO_MAQUINARIA/items',
  path_administracion_equipo_estadoEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_ESTADO_EQUIPO/items',
  path_administracion_equipo_lugarUmvId: '/api/administracion/lugar/',
  path_administracion_equipo_marcaEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_MARCA_EQUIPO/items',
  path_administracion_equipo_claseEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_CLASE_EQUIPO/items',
  path_administracion_equipo_tipoEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_TIPO_EQUIPO/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_produccion_maquinaria_create: 'PRODUCCION_MAQUINARIA_CREATE',
  permiso_produccion_maquinaria_update: 'PRODUCCION_MAQUINARIA_UPDATE',
  permiso_produccion_maquinaria_delete: 'PRODUCCION_MAQUINARIA_DELETE',
  permiso_produccion_maquinaria_view: 'PRODUCCION_MAQUINARIA_VIEW',
  permiso_produccion_maquinaria_list: 'PRODUCCION_MAQUINARIA_LIST',
  permiso_produccion_maquinaria_export: 'PRODUCCION_MAQUINARIA_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_PRODUCCION_MANTENIMIENTOS_PROGRAMADOS = {
  equipo_name: 'Programar maquinaria para mantenimientos correctivos y preventivos',
  tipoMantenimiento: 'Tipo de mantenimiento',
  programar_mantenimiento: 'Programación del mantenimiento',
  cancelar_mantenimiento: 'Cancelar mantenimiento',
  motivo_placeholder: 'Indica la razón por la que se cancela el mantenimiento',
  fechaInicio: 'Fecha de inicio',
  taller: 'Taller',

  tipoEquipoId: 'Tipo Equipo',
  estadoEquipoId: 'Estado',
  marcaEquipoId: 'Marca',
  lugarEquipoId: 'Lugar',
  numeroInterno: 'Número Interno',
  placaInventario: 'Placa Inventario',
  placa: 'Placa',
  movil: 'Móvil',
  claseEquipoId: 'Clase Equipo',
  anioModeloId: 'Año Modelo',
  areaUmvId: 'Area',
  cilindraje: 'Cilindraje',
  color: 'Color',
  fechaDesde: 'Desde',
  fechaHasta: 'Hasta',
  fechaSiguienteMantenimiento: 'Fecha Siguiente Mantenimiento',
  fechaUltimoMantenimiento: 'Fecha Ultimo Mantenimiento',
  horaFinProgramacion: 'Hora Fin Programación',
  horaInicioProgramacion: 'Hora Inicio Programacion',
  horasMantenimiento: 'Horas Mantenimiento',
  id: 'Id',
  kilometrosMantenimiento: 'Kilometros Mantenimiento',
  linea: 'Linea',
  numeroChasis: 'Número Chasis',
  numeroMotor: 'Número Motor',
  origenEquipoId: 'Origen Equipo',
  picoYPlaca: 'Pico y Placa',
  plazoMantenimiento: 'Plazo mantenimiento',
  tipoCombustibleId: 'Tipo Combustible',
  toneladas: 'Toneladas',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
