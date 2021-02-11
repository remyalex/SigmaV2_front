import { CONST_SHARED } from 'src/app/shared/constantes-shared';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_produccion_usuario_autocompletar: '/api/usuario/searchAutocomplete',
  path_produccion_persona_tipoEnsayo: '/api/administracion/lista/PRODUCCION_TIPO_ENSAYO/items',
  path_produccion_turno: '/api/administracion/lista/ADMINISTRACION_DISPONIBILIDAD_TURNO/items',
  path_produccion_planta: '/api/administracion/lista/PRODUCCION_PLANTA/items',
  path_produccion_formula: '/api/produccion/formula/lstValor',
  path_produccion_asignar_personal: '/api/usuario/lstValor',
  path_produccion_tipo_material: '/api/administracion/lista/TIPO_MATERIAL/items',
  path_produccion_tipo_vale: '/api/administracion/lista/PRODUCCION_TIPO_VALE/items',
  path_produccion_conductor: '/api/administracion/persona',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_produccion_asignar_conductores_maquinaria_create: 'PRODUCCION_ASIGNAR_CONDUCTORES_MAQUINARIA_CREATE',
  permiso_produccion_asignar_conductores_maquinaria_update: 'PRODUCCION_ASIGNAR_CONDUCTORES_MAQUINARIA_UPDATE',
  permiso_produccion_asignar_conductores_maquinaria_delete: 'PRODUCCION_ASIGNAR_CONDUCTORES_MAQUINARIA_DELETE',
  permiso_produccion_asignar_conductores_maquinaria_view: 'PRODUCCION_ASIGNAR_CONDUCTORES_MAQUINARIA_VIEW',
  permiso_produccion_asignar_conductores_maquinaria_list: 'PRODUCCION_ASIGNAR_CONDUCTORES_MAQUINARIA_LIST',
  permiso_produccion_asignar_conductores_maquinaria_export: 'PRODUCCION_ASIGNAR_CONDUCTORES_MAQUINARIA_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ASIGNAR_CONDUCTORES_MAQUINARIA = {
  numero: 'Número',
  pk: 'pk',
  tipo_ensayo: 'Tipo',  
  fecha_solicitud: 'Fecha solicitud',
  usuario: 'Usuario solicitud',
  fecha_ensayo: 'Fecha ensayo',
  fechaInicio: 'Fecha Inicio',
  fechaFin: 'Fecha Final',
  registrarVale: 'Registrar Vale',
  horaEntrada: 'Hora de Entrada',
  horaSalida: 'Hora de Salida',
  horaLlegada: 'Hora de Llegada',
  detalleVales: 'Detalle Vales',
  maquinariaEquipos: 'Asignar Conductores y Operarios a Maquinaria Programada de la UMV',
  listaPks: 'Lista de Pks seleccionados',
  programarPersonal: 'Programar Personal',
  programarMaquinaria: 'Programar Maquinaria',
  cancelarPersonal: 'Cancelar Personal',
  responsable: 'Responsable',
  cancelacionPersonal: 'Cancelación de Programación de Personal',
  filtro: 'Filtro',
  idConductor: 'No Interno',
  tipoEquipo: 'Tipo',
  claseEquipo: 'Clasificación',
  placaInventario: 'Placa / N. Inventario',
  estadoEquipo: 'Estado',
  marcaEquipo: 'Marca',
  lugar: 'Lugar',
  fechaProgramacionSolicitada: 'Fecha Inicio',
  jornada: 'Jornada',
  nombreCompleto: 'Nombre de Responsable',
  horario: 'Horario',
  pkListar: 0,
  mObject: new WorkflowMantenimientoModel,
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};