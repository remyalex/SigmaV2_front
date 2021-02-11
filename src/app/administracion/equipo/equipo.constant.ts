import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/**
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_equipo: '/api/administracion/equipo/',
  path_administracion_equipo_anioModeloId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_ANIO_MODELO/items',
  path_administracion_equipo_areaUmvId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_AREA_UMV/items',
  path_administracion_equipo_claseEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_CLASE_EQUIPO/items',
  path_administracion_equipo_estadoEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_ESTADO_EQUIPO/items',
  path_administracion_equipo_lugarUmvId: '/api/administracion/lugar/',
  path_administracion_equipo_marcaEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_MARCA_EQUIPO/items',
  path_administracion_equipo_origenEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_ORIGEN_EQUIPO/items',
  path_administracion_equipo_tipoCombustibleId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_TIPO_COMBUSTIBLE/items',
  path_administracion_equipo_tipoEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_TIPO_EQUIPO/items',
  path_administracion_equipo_tipoMaquinariaId: '/api/administracion/lista/TIPO_MAQUINARIA/items'
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_equipo_create: 'ADMINISTRACION_EQUIPO_CREATE',
  permiso_administracion_equipo_update: 'ADMINISTRACION_EQUIPO_UPDATE',
  permiso_administracion_equipo_delete: 'ADMINISTRACION_EQUIPO_DELETE',
  permiso_administracion_equipo_view: 'ADMINISTRACION_EQUIPO_VIEW',
  permiso_administracion_equipo_list: 'ADMINISTRACION_EQUIPO_LIST',
  permiso_administracion_equipo_export: 'ADMINISTRACION_EQUIPO_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_EQUIPO = {
  equipo_name: 'Equipos',
  activo: 'Activo',
  anioModeloId: 'Año Modelo',
  areaUmvId: 'Área Umv',
  cilindraje: 'Cilindraje',
  claseEquipoId: 'Clase Equipo',
  color: 'Color',
  conductor: 'Conductor',
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
  picoYPlaca: 'Pico y Placa',
  placa: 'Placa',
  telefono: 'Teléfono',
  placaInventario: 'Placa Inventario',
  plazoMantenimiento: 'Plazo Días Mantenimiento',
  tipoCombustibleId: 'Tipo Combustible',
  tipoEquipoId: 'Tipo Equipo',
  toneladas: 'Toneladas',
  cantidadPasajeros: 'Cantidad Pasajeros',
  error_min: 'Valor mínimo no válido',
  error_max: 'Valor máximo no válido',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
