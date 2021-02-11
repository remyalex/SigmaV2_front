import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_workflow_gestionar_reserva_respuesta_reserva: '/api/administracion/lista/ESTADO_TIPO_RADICADO/items',
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
export const CONST_GESTIONAR_RESERVA = {
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
  vincularRadicadoSalida:'Vincular Radicado de Salida',
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
