import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_produccion_equipo: '/api/produccion/tarjetaOperacion/',
  path_produccion_numero_tarjeta: '/api/produccion/tarjetaOperacion/last',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_produccion_tarjeta_operacion_create: 'PRODUCCION_TARJETA_OPERACION_CREATE',
  permiso_produccion_tarjeta_operacion_update: 'PRODUCCION_TARJETA_OPERACION_UPDATE',
  permiso_produccion_tarjeta_operacion_delete: 'PRODUCCION_TARJETA_OPERACION_DELETE',
  permiso_produccion_tarjeta_operacion_view: 'PRODUCCION_TARJETA_OPERACION_VIEW',
  permiso_produccion_tarjeta_operacion_list: 'PRODUCCION_TARJETA_OPERACION_LIST',
  permiso_produccion_tarjeta_operacion_export: 'PRODUCCION_TARJETA_OPERACION_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_PRODUCCION_TARJETA_OPERACION = {
  listarTarjetaOperacion: 'Consulta de Tarjetas de Operación',
  registarTarjetaOperacion: 'Registrar Tarjeta de Operación',
  numeroTarjeta: 'No Tarjeta',
  quienDespacha: 'Quien Despacha',
  direccionSalida: 'Dirección Salida',
  horaSalida: 'Hora de Salida',
  kilometrajeSalida: 'Kilometraje Salida',
  tipoCarga: 'Tipo Carga',
  cantidad: 'Cantidad',
  direccionLlegada: 'Dirección Llegada',
  horaLlegada: 'Hora Llegada',
  kilometrajeLlegada: 'Kilometraje Llegada',
  quienRecibe: 'Quien Recibe',
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


