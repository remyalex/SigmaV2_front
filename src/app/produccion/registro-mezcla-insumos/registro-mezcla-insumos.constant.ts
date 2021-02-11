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
  path_produccion_jefe_bascula: '/api/usuario/lstValor',
  path_produccion_tipo_material: '/api/administracion/lista/TIPO_MATERIAL/items',
  path_produccion_tipo_vale: '/api/administracion/lista/PRODUCCION_TIPO_VALE/items',
  path_produccion_conductor: '/api/administracion/persona',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_produccion_registrar_mezcla_insumos_create: 'PRODUCCION_REGISTRAR_MEZCLA_INSUMOS_CREATE',
  permiso_produccion_registrar_mezcla_insumos_update: 'PRODUCCION_REGISTRAR_MEZCLA_INSUMOS_UPDATE',
  permiso_produccion_registrar_mezcla_insumos_delete: 'PRODUCCION_REGISTRAR_MEZCLA_INSUMOS_DELETE',
  permiso_produccion_registrar_mezcla_insumos_view: 'PRODUCCION_REGISTRAR_MEZCLA_INSUMOS_VIEW',
  permiso_produccion_registrar_mezcla_insumos_list: 'PRODUCCION_REGISTRAR_MEZCLA_INSUMOS_LIST',
  permiso_produccion_registrar_mezcla_insumos_export: 'PRODUCCION_REGISTRAR_MEZCLA_INSUMOS_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_REGISTRAR_MEZCLA_INSUMOS = {
  numero: 'Número',
  pk: 'pk',
  tipo_ensayo: 'Tipo',  
  fecha_solicitud: 'Fecha solicitud',
  usuario: 'Usuario solicitud',
  fecha_ensayo: 'Fecha ensayo',
  registrarVale: 'Registrar Vale',
  editarVale: 'Editar Vale',
  horaEntrada: 'Hora de Entrada',
  horaSalida: 'Hora de Salida',
  horaLlegada: 'Hora de Llegada',
  detalleVales: 'Detalle Vales',
  fechaDesde: 'Fecha Desde',
  fechaHasta: 'Fecha Hasta',
  turno: 'Turno',
  tipoMaterial: 'Tipo Material',
  listaPks: 'Lista de Pks seleccionados',
  registrarMezclaInsumos: 'Registro de Mezcla e Insumos Producida y Despachada',
  pkListar: 0,
  mObject: new WorkflowMantenimientoModel,
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};