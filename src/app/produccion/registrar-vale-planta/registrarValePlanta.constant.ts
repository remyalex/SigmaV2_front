import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_produccion_registrar_vale_planta: '/api/produccion/vale',
  path_produccion_registrar_vale_planta_tipoValeId: '/api/administracion/lista/TIPO_VALE/items',
  path_produccion_registrar_vale_planta_tipoMaterialId: '/api/administracion/lista/CLASE_INSUMO/items',
  path_produccion_registrar_vale_planta_turnoId: '/api/administracion/lista/ADMINISTRACION_DISPONIBILIDAD_TURNO/items',
  path_produccion_registrar_vale_planta_usuarioId: '/api/usuario/searchAutocomplete',
  path_produccion_registrar_vale_planta_personaId: '/api/administracion/persona/searchAutocomplete',
  path_produccion_registrar_vale_planta_equipoAutocomplete: '/api/administracion/equipo/searchAutocompletar',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_produccion_registrar_vale_planta_create: 'PRODUCCION_REGISTRAR_VALE_PLANTA_CREATE',
  permiso_produccion_registrar_vale_planta_update: 'PRODUCCION_REGISTRAR_VALE_PLANTA_UPDATE',
  permiso_produccion_registrar_vale_planta_delete: 'PRODUCCION_REGISTRAR_VALE_PLANTA_DELETE',
  permiso_produccion_registrar_vale_planta_view: 'PRODUCCION_REGISTRAR_VALE_PLANTA_VIEW',
  permiso_produccion_registrar_vale_planta_list: 'PRODUCCION_REGISTRAR_VALE_PLANTA_LIST',
  permiso_produccion_registrar_vale_planta_export: 'PRODUCCION_REGISTRAR_VALE_PLANTA_EXPORT',
  permiso_produccion_registrar_vale_planta_attach: 'PRODUCCION_REGISTRAR_VALE_PLANTA_ATTACH',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_PRODUCCION_REGISTRO_VALE_PLANTA = {
  activo: 'Activo',
  titulo: 'Registrar volumenes materiales ingreso a planta',
  titulo2: 'Registro volumenes materiales ingreso a planta',
  fechaInicio: 'Fecha inicio',
  fachaFin: 'Fecha fin',
  numeroVale: 'Tiquete número',
  horaEntrada: 'Hora entrada',
  horaSalida: 'Hora salida',
  tipoMaterial: 'Clase material',
  turno: 'Turno',
  producto: 'Producto',
  proveedor: 'Proveedor',
  jefeBascula: 'Jefe báscula',
  placaVehiculo: 'Placa',
  pesoBruto: 'Peso bruto',
  pesoTara: 'Peso tara',
  pesoNeto: 'Peso neto',
  nombreRecibe: 'Recibe',
  fecha: 'Fecha',
  rID: 0,
  rObject: null,
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS
};
