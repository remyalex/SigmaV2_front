import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_equipo: '/api/administracion/equipo/',
  path_administracion_equipo_tipoEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_ESTADO_EQUIPO/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_produccion_estado_maquinaria_propio_create: 'PRODUCCION_ESTADO_MAQUINARIA_PROPIO_CREATE',
  permiso_produccion_estado_maquinaria_propio_update: 'PRODUCCION_ESTADO_MAQUINARIA_PROPIO_UPDATE',
  permiso_produccion_estado_maquinaria_propio_delete: 'PRODUCCION_ESTADO_MAQUINARIA_PROPIO_DELETE',
  permiso_produccion_estado_maquinaria_propio_view: 'PRODUCCION_ESTADO_MAQUINARIA_PROPIO_VIEW',
  permiso_produccion_estado_maquinaria_propio_list: 'PRODUCCION_ESTADO_MAQUINARIA_PROPIO_LIST',
  permiso_produccion_estado_maquinaria_propio_export: 'PRODUCCION_ESTADO_MAQUINARIA_PROPIO_EXPORT',
};


/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_CONSULTA_ESTADO_MAQUINARIA = {
  equipo_name: 'Equipos',
  consultar: 'Consultar',
  irAtras: 'Ir Atras',
  activo: 'Activo',
  anioModeloId: 'Año Modelo',
  areaUmvId: 'Área Umv',
  cilindraje: 'Cilindraje',
  claseEquipoId: 'Clasificación',
  color: 'Color',
  conductor: 'Conductor',
  estadoEquipoId: 'Estado',
  fechaDesde: 'Fecha Desde',
  fechaHasta: 'Fecha Hasta',
  fecha: 'Fecha',
  estado: 'Estado',
  numeroInterno: 'No Interno',
  placa: 'Placa',
  clasificacion: 'Clasificación',
  equipoTipoId: 'Tipo Maquinaria y Equipo',
  tipoMaquinaria: 'Tipo Maquinaria y Equipo',
  propio: 'Propio',
  disponibilidad_myeq: 'Consulta de Disponibilidad de Maquinaria y Equipo',
  fechaSiguienteMantenimiento: 'Fecha Siguiente Mantenimiento',
  fechaUltimoMantenimiento: 'Fecha Último Mantenimiento',
  horaFinProgramacion: 'Hora Fin Programación',
  horaInicioProgramacion: 'Hora Inicio Programación',
  horasMantenimiento: 'Horas de Mantenimiento',
  id: 'Id',
  kilometrosMantenimiento: 'Kilometros Mantenimiento',
  linea: 'Línea',
  lugarUmvId: 'Lugar Umv',
  marcaEquipoId: 'Marca Equipo',
  movil: 'Móvil',
  numeroChasis: 'Número Chasis',
  numeroMotor: 'Número Motor',
  origenEquipoId: 'Origen Equipo',
  picoYPlaca: 'Pico y Placa',
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


