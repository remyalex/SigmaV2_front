import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_produccion_planilla_operacion_consulta: '/api/produccion/tarjOperacionActividad',
  path_administracion_tipo_tarjeta: '/api/administracion/lista/ADMINISTRACION_TIPO_TARJETA/items',
  path_administracion_estado_maquinaria: '/api/administracion/lista/ADMINISTRACION_ESTADO_MAQUINARIA/items',
  path_administracion_operador_disponible: '/api/administracion/equipoConductorDisponible',
  path_administracion_equipoconductor_tipoVehiculoContratacion: '/api/administracion/lista/TIPO_VEHICULO_CONTRATADO/items',
  path_administracion_calificacion_disponible: '/api/administracion/lista/ADMINISTRACION_CALIFICACION_ACTIVIDAD/items',
  path_administracion_equipo_tipoEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_TIPO_EQUIPO/items'
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_produccion_registrar_planilla_operacion_create: 'PRODUCCION_REGISTRAR_PLANILLA_OPERACION_CREATE',
  permiso_produccion_registrar_planilla_operacion_update: 'PRODUCCION_REGISTRAR_PLANILLA_OPERACION_UPDATE',
  permiso_produccion_registrar_planilla_operacion_delete: 'PRODUCCION_REGISTRAR_PLANILLA_OPERACION_DELETE',
  permiso_produccion_registrar_planilla_operacion_view: 'PRODUCCION_REGISTRAR_PLANILLA_OPERACION_VIEW',
  permiso_produccion_registrar_planilla_operacion_list: 'PRODUCCION_REGISTRAR_PLANILLA_OPERACION_LIST',
  permiso_produccion_registrar_planilla_operacion_export: 'PRODUCCION_REGISTRAR_PLANILLA_OPERACION_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_REGISTRAR_PLANILLA_OPERACION = {
  consultar: 'Consultar',
  irAtras: 'Ir Atras',
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
  listaActividades: 'Lista de Actividades',
  fecha: 'Fecha',
  estado: 'Estado',
  numeroInterno: 'No Interno',
  placa: 'Placa',
  clasificacion: 'Clasificación',
  tipoMaquinaria: 'Tipo Maquinaria y Equipo',
  propio: 'Propio',
  fechaOperacion: 'Fecha Operación',
  operador: 'Operador',
  operaciones: 'Operaciones',
  item: 'Item',
  descripcion: 'Descripción',
  observacion: 'Observación',
  calificacion: 'Calificación',
  numeroId: 'No',
  tipoTarjeta: 'Tipo Tarjeta',
  actividades:'Actividades',
  crearPlanilla: 'Crear planilla',
  registrarPlanilla: 'Registrar Planilla de Operación',
  crearTarjetaOperacion: 'Registrar Tarjeta de Operación',
  tipoVehiculo: 'Tipo Vehiculo',
  numeroTarjeta: 'Número Tarjeta',
  variableControl: 'Variable Control',
  estadoMaquinaria: 'Estado Maquinaria',
  lecturaInicial: 'Lectura Inicial',
  lecturaFinal: 'Lectura Final',
  kmsInicial: 'Kms Inicial',
  kmsFinal: 'kms Final',
  horaInicial: 'Hora Inicial',
  horaFinal: 'Hora Final',
  totalHoras: 'Total Horas',
  disponibilidad_myeq: 'Consulta de Disponiblidad MyEQ',
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


