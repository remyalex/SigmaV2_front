import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_workflow_diagnostico_encabezado_seccion_vial:
    '/api/administracion/lista/MEJORAMIENTO_SECCION_VIAL/items',
  path_workflow_diagnostico_encabezado_solicitante:
  '/api/administracion/persona',
  path_workflow_diagnostico_origen:
  '/api/administracion/lista/MEJORAMIENTO_TIPO_SOLICITUD/items',
  path_workflow_diagnostico_encabezado_uso_via:
    '/api/administracion/lista/MEJORAMIENTO_USO_VIAL/items',
  path_workflow_diagnostico_encabezado_tipo_malla:
    '/api/administracion/lista/MEJORAMIENTO_TIPO_MALLA/items',
  path_workflow_diagnostico_encabezado_transitabilidad:
    '/api/administracion/lista/MEJORAMIENTO_TRANSITABILIDAD/items',
  path_workflow_diagnostico_encabezado_programa:
    '/api/administracion/lista/TAB_MANTENIMIENTO_VIAL_ID_TIPO_PROGRAMA/items',
  path_workflow_diagnostico_encabezado_tipo_superficie:
    '/api/administracion/lista/MEJORAMIENTO_TIPO_SUPERFICIE/items',
  path_workflow_diagnostico_encabezado_tipo_intervencion:
    '/api/administracion/tipoIntervencion/listByReferenciaIntervencion/647373/0',

  path_workflow_diagnostico_factores_tipo_factor:
    '/api/administracion/lista/MEJORAMIENTO_TIPO_FACTOR/items',
  path_mejoramiento_diagnosticomodeloprioriza_aporteCumplimiento:
    '/api/administracion/lista/MEJORAMIENTO_APORTE_CUMPLIMIENTO/items',
  path_mejoramiento_diagnosticomodeloprioriza_coordinacionInterinst:
    '/api/administracion/lista/MEJORAMIENTO_COORDINACION_INTERINST/items',
  path_mejoramiento_diagnosticomodeloprioriza_determTipoIntervencion:
    '/api/administracion/lista/MEJORAMIENTO_DETERM_TIPO_INTERVENCION/items',
  path_mejoramiento_diagnosticomodeloprioriza_diagnosticoEncabezado:
    '/api/administracion/lista/MEJORAMIENTO_DIAGNOSTICO_ENCABEZADO/items',
  path_mejoramiento_diagnosticomodeloprioriza_impactoSocial:
    '/api/administracion/lista/MEJORAMIENTO_IMPACTO_SOCIAL/items',

  path_workflow_diagnostico_priorizacion_aporte_cumplimiento:
    '/api/administracion/lista/MEJORAMIENTO_APORTE_CUMPLIMIENTO/items',
  path_workflow_diagnostico_priorizacion_coordinacion_interinstitucional:
    '/api/administracion/lista/TAB_MANTENIMIENTO_VIAL_ID_TIPO_COORDINACION_INTERINST/items',
  path_workflow_diagnostico_priorizacion_tipo_intervencion:
    '/api/administracion/lista/TAB_MANTENIMIENTO_VIAL_ID_TIPO_DETERMINACION_INTERV/items',
  path_workflow_diagnostico_priorizacion_impacto_social:
    '/api/administracion/lista/MEJORAMIENTO_IMPACTO_SOCIAL/items',

  path_workflow_diagnostico_fallas_tipo_falla:
    // '/api/administracion/lista/TAB_FALLA_ID_TIPO_FALLA/{acronimotiposuperficie}/items',
    '/api/administracion/tipofalla/listByTipoSuperficie/{tipoSuperficieId}',
  path_workflow_diagnostico_fallas_unidades_muestreo:
    '/api/administracion/lista/TAB_FALLA_ID_TIPO_FALLA/{acronimotiposuperficie}/items',
  path_workflow_diagnostico_fallas_severidad:
    '/api/administracion/lista/MEJORAMIENTO_SEVERIDAD/items',
  path_administracion_equipo_equipoAutocomplete: '/api/administracion/equipo/searchAutocompletar',
  path_administracion_equipo_calendarios: 'api/administracion/equipocalendario/calendarios/search',
  path_administracion_persona_visitaprogramada: '/api/administracion/persona/findAllPersonasVisitaProgramada',
  path_administracion_persona_cargalaboral: '/api/administracion/persona',
  path_mejoramiento_lista_tipoSolicitud: '/api/administracion/lista/MEJORAMIENTO_TIPO_SOLICITUD/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
};



/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_WORKFLOW_GESTIONAR_PK_VINCULADOS = {
  activo: 'Activo',
  seccionVial: 'Sección vial',
  solicitante: 'Solicitante',
  uso_via: 'Uso vía',
  tipo_malla: 'Tipo malla',
  transitabilidad: 'Transitabilidad',
  programa: 'Programa',
  tipo_superficie: 'Tipo superficie',
  tipo_intervencion_total: 'Tipo intervención total',
  eje_vial: 'Eje vial',
  desde: 'Desde',
  hasta: 'Hasta',
  uplaNombre: 'UPZ',
  localidadNombre: 'Nombre de la localidad',
  barrioNombre: 'Nombre del sector',
  aporte_cumplimiento: 'Aporte cumplimiento',
  coordinacion_interinstucional: 'Coordinación interinstitucional',
  tipo_intervencion: 'Tipo intervención',
  impacto_social: 'Impacto Social',
  tipo_factor: 'Tipo factor',
  campoRequerido: 'Campo requerido',
  campoNoValido: 'Campo no válido',
  cuadrante: 'Cuadrante',
  actividadAgrupada: 'Actividad agrupada',
  ancho: 'Ancho (m)',
  andOr: 'And / Or',
  area: 'Area (m2)',
  autocomplete: 'autocomplete',
  barrio: 'Barrio',
  busquedaAvanzada: 'Busqueda avanzada',
  calendariosEquipo: 'Calendarios equipos',
  calendariosPersona: 'Calendarios personas',
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
  estadosPk: {
    pendiente_programacion: 'PENDIENTE_PROGRAMACION_VISITA_TECNICA'
  },
  equipo: 'Equipo',
  equipos: 'Equipos',
  fecha: 'Fecha',
  fechaDesde: 'Fecha desde',
  fechaHasta: 'Fecha hasta',
  fechaFin: 'Fecha fin',
  fechaSolicitudProgramacion: 'Fecha solicitud programación',
  fechaVisita: 'Fecha visita',
  fechaDiagnostico: 'Fecha diagnóstico',
  finaliza: 'Finaliza',
  fotos: 'Fotos',
  igual: 'Igual',
  inicia: 'Inicia',
  indicePriorizacion: 'Índice Priorización',
  list: 'list',
  listLocal: 'listLocal',
  localidad: 'Localidad',
  mantenimientos: 'Mantenimientos',
  mantenimiento:  'Mantenimiento',
  mayor: 'Mayor',
  mayorIgual: 'Mayor igual',
  menor: 'Menor',
  menorIgual: 'Menor igual',
  notQuery: 'No se ha ingresado una consulta para buscar',
  origen: 'Origen',
  operador: 'Operador',
  persona: 'Persona',
  personas: 'Personas',
  pk: 'Pk',
  responsable: 'Responsable',
  asignacion: 'Asignación',
  segimiento: 'SEGIMIENTO',
  solicitudFecha: 'Solicitud Fecha',
  tipoSolicitud: 'Tipo solicitud',
  text: 'text',
  tieneRutasTransporte: 'Tiene Rutas Transporte',
  tipoIntervencionTotal: 'Tipo Intervención Total',
  tipoMalla: 'Tipo de malla vial',
  tipoSuperficie: 'Tipo Superficie',
  usoVia: 'Uso de la Vía',
  vacio: 'Vacio',
  valor: 'Valor',
  valorUnico: 'Valor único',
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

  unidadMuestreo: 'Unidad muestreo',
  abscisaInicial: 'Abscisa inicial',
  abscisaFinal: 'Abscisa Final',

  tipo_falla: 'Tipo falla',
  severidad: 'Severidad',
  longitud: 'Longitud',
  longitudLosa: 'Longitud losa',
  anchoLosa: 'Ancho losa',
  numeroLosas: 'Número de losas',
  tipoIntervencion: 'Tipo de intervención',

  'radicadoEntrada': 'Radicado Entada',
  'radicadoSalida': 'Radicado Salida',
  fechaAsignacion: 'Fecha Asignación',
  'vencimiento': 'Vencimiento',
  'kmCarrilImpacto': 'KM Carril del PK',
  'radicadoSolicitudReserva': 'Radicado Solicitud Reserva',
  'radicadoRespuestaReserva': 'Radicado Respuesta de Reserva',
  tipoActividad: 'Tipo de actividad',
  mantenimientoSinDiagnostico: 'El mantenimiento no posee un diagnostico',

  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
