import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_workflow_diagnostico_registar_encabezado_seccion_vial: '/api/administracion/lista/MEJORAMIENTO_SECCION_VIAL/items',
  path_workflow_diagnostico_registar_encabezado_solicitante: '/api/administracion/lista/MEJORAMIENTO_TIPO_SOLICITUD/items',
  path_workflow_diagnostico_registar_encabezado_uso_via: '/api/administracion/lista/MEJORAMIENTO_USO_VIAL/items',
  path_workflow_diagnostico_registar_encabezado_tipo_malla: '/api/administracion/lista/MEJORAMIENTO_TIPO_MALLA/items',
  path_workflow_diagnostico_registar_encabezado_transitabilidad: '/api/administracion/lista/MEJORAMIENTO_TRANSITABILIDAD/items',
  path_workflow_diagnostico_registar_encabezado_programa: '/api/administracion/lista/TAB_MANTENIMIENTO_VIAL_ID_TIPO_PROGRAMA/items',
  path_workflow_diagnostico_registar_encabezado_tipo_superficie: '/api/administracion/lista/MEJORAMIENTO_TIPO_SUPERFICIE/items',
  //Filtros
  path_workflow_diagnostico_priorizar_intervencion_localidades_umv: '/api/administracion/lista/UMV_LOCALIDADES/items',
  path_workflow_diagnostico_priorizar_intervencion_barrios_umv: '/api/administracion/lista/UMV_BARRIOS/items',
  path_workflow_diagnostico_priorizar_intervencion_zonas_umv: '/api/administracion/lista/UMV_ZONAS/items',
  path_workflow_diagnostico_priorizar_intervencion_origen: '/api/administracion/lista/MEJORAMIENTO_TIPO_SOLICITUD/items',
  path_workflow_diagnostico_priorizar_intervencion_estado: '/api/administracion/lista/ESTADO_MANTENIMIENTO/items',



};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_workflow_diagnostico_registar_create: 'WORKFLOW_SOLICITUD_GESTIONAR_CREATE',
  permiso_workflow_diagnostico_registar_update: 'WORKFLOW_SOLICITUD_GESTIONAR_UPDATE',
  permiso_workflow_diagnostico_registar_delete: 'WORKFLOW_SOLICITUD_GESTIONAR_DELETE',
  permiso_workflow_diagnostico_registar_view: 'WORKFLOW_SOLICITUD_GESTIONAR_VIEW',
  permiso_workflow_diagnostico_registar_list: 'WORKFLOW_SOLICITUD_GESTIONAR_LIST',
  permiso_workflow_diagnostico_registar_export: 'WORKFLOW_SOLICITUD_GESTIONAR_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_WORKFLOW_OTROS_GESTIONAR = {
  activo: 'Activo',
  radicadoSalida: 'Radicado de salida',
  campoRequerido: 'Campo requerido',
  campoNoValido: 'Campo no válido',
  actividadAgrupada: 'Actividad agrupada',
  ancho: 'Ancho (m)',
  andOr: 'And / Or',
  area: 'Area (m2)',
  autocomplete: 'autocomplete',
  barrio: 'Barrio',
  busquedaAvanzada: 'Busqueda avanzada',
  calificacionPci: 'Calificación Pci',
  capa: 'Capa',
  campo: 'Campo',
  civ: 'CIV',
  contiene: 'Contiene',
  consultaAvanzada: 'Consulta avanzada',
  date: 'date',
  dateRange: 'dateRange',
  diagnosticoId: 'Diagnóstico',
  diferente: 'Diferente',
  enseguimiento: 'En seguimiento',
  estadoPk: 'Estado PK',
  fecha: 'Fecha',
  fechaDesde: 'Fecha desde',
  fechaHasta: 'Fecha hasta',
  fechaFin: 'Fecha fin',
  fechaVisita: 'Fecha visita',
  fechaDiagnostico: 'Fecha diagnóstico',
  finaliza: 'Finaliza',
  igual: 'Igual',
  inicia: 'Inicia',
  indicePriorizacion: 'Indice Priorización',
  list: 'list',
  listLocal: 'listLocal',
  localidad: 'Localidad',
  mayor: 'Mayor',
  mayorIgual: 'Mayor igual',
  menor: 'Menor',
  menorIgual: 'Menor igual',
  notQuery: 'No se ha ingresado una consulta para buscar',
  origen: 'Origen',
  operador: 'Operador',
  pk: 'Pk',
  responsable: 'Responsable',
  segimiento: 'SEGIMIENTO',
  solicitudFecha: 'Solicitud Fecha',
  tipoSolicitud: 'Tipo solicitud',
  text: 'text',
  tieneRutasTransporte: 'Tiene Rutas Transporte',
  tipoIntervencionTotal: 'Tipo Intervención Total',
  tipoMalla: 'Tipo de malla vial',
  tipoSuperficie: 'Tipo Superficie',
  upla: 'UPZ',
  usoVia: 'Uso de la Vía',
  vacio: 'Vacio',
  valor: 'Valor',
  valorUnico: 'Valor único',
  vincularRadicadoSalida: 'Vincular Radicado de Salida',
  vistaDiagnostico: 'Vista Diagnóstico',
  vistaVerificacion: 'Vista Verificación',
  query: 'Query',
  zona: 'Zona',

  aporteCumplimiento: 'Aporte Cumplimiento',
  coordinacionInterinst: 'Coordinacion Interinst',
  determTipoIntervencion: 'Determ Tipo Intervencion',
  diagnosticoEncabezado: 'Diagnostico Encabezado',
  impactoSocial: 'Impacto Social',
  observaciones: 'Observaciones',



  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
