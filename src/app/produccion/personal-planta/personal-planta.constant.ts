import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_produccion_personal_planta_consulta: '/api/produccion/solicitudTipoMaterial',
  path_produccion_personal_planta_consulta_programacion: '/api/administracion/personadisponibilidad',
  path_produccion_personal_planta_save: '/api/produccion/programacionTrabajadores/list',
  path_produccion_turno: '/api/administracion/lista/ADMINISTRACION_DISPONIBILIDAD_TURNO/items',
  path_produccion_tipo_material: '/api/administracion/lista/TIPO_MATERIAL/items',
  path_administracion_equipo_anioModeloId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_ANIO_MODELO/items',
  path_administracion_equipo_areaUmvId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_AREA_UMV/items',
  path_administracion_equipo_claseEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_CLASE_EQUIPO/items',
  path_administracion_equipo_estadoEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_ESTADO_EQUIPO/items',
  path_administracion_equipo_lugarUmvId: '/api/administracion/lugar/',
  path_administracion_equipo_marcaEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_MARCA_EQUIPO/items',
  path_administracion_equipo_origenEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_ORIGEN_EQUIPO/items',
  path_administracion_equipo_tipoCombustibleId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_TIPO_COMBUSTIBLE/items',
  path_administracion_equipo_tipoEquipoId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_TIPO_EQUIPO/items',
  path_produccion_planta_disponibilidad: '/api/administracion/lista/TIPO_DISPONIBILIDAD_PERSONAL_PLANTA/items'

};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_produccion_programar_personal_planta_create: 'PRODUCCION_PROGRAMAR_PERSONAL_PLANTA_CREATE',
  permiso_produccion_programar_personal_planta_update: 'PRODUCCION_PROGRAMAR_PERSONAL_PLANTA_UPDATE',
  permiso_produccion_programar_personal_planta_delete: 'PRODUCCION_PROGRAMAR_PERSONAL_PLANTA_DELETE',
  permiso_produccion_programar_personal_planta_view: 'PRODUCCION_PROGRAMAR_PERSONAL_PLANTA_VIEW',
  permiso_produccion_programar_personal_planta_list: 'PRODUCCION_PROGRAMAR_PERSONAL_PLANTA_LIST',
  permiso_produccion_programar_personal_planta_export: 'PRODUCCION_PROGRAMAR_PERSONAL_PLANTA_EXPORT',
};




/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_REGISTRAR_PLANILLA_OPERACION = {
  consultar: 'Consultar',
  irAtras: 'Ir Atras',
  activo: 'Activo',
  fecha: 'Fecha',
  estado: 'Estado',
  numeroInterno: 'No Interno',
  placa: 'Placa',
  clasificacion: 'Clasificación',
  tipoMaquinaria: 'Tipo Maquinaria y Equipo',
  propio: 'Propio',
  descripcion: 'Descripción',
  tipoTarjeta: 'Tipo Tarjeta',
  actividades:'Actividades',
  programarPersonal: 'Programar Personal de la Planta',
  numeroSolicitud: 'No Solicitud',
  fechaEntrega: 'Fecha Entrega',
  turno: 'Turno',
  tipoMaterial: 'Tipo Material',
  fechaDesde: 'Fecha Desde',
  fechaHasta: 'Fecha Hasta',
  programacionPersonal: 'Programación de Personal de la Planta',
  no: 'No',
  cargo: 'Cargo',
  nombre: 'Nombre',
  disponibilidad: 'Disponibilidad',
  programar: 'Programar',
  observaciones: 'Observaciónes',
  observacion: 'Observación',
  telefono: 'Teléfono',
  placaInventario: 'Placa Inventario',
  plazoMantenimiento: 'Plazo Días Mantenimiento',
  tipoCombustibleId: 'Tipo Combustible',
  tipoEquipoId: 'Tipo Equipo',
  toneladas: 'Toneladas',
  cantidadPasajeros: 'Cantidad Pasajeros',
  error_min: 'Valor mínimo no válido',
  error_max: 'Valor máximo no válido',
  error_fecha_min: 'La programación debe ser en fecha posterior a la actual',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};


