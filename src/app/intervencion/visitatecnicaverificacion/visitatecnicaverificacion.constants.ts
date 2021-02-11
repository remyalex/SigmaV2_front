import { CONST_SHARED } from '../../shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_intervencion_tipoSuperficie: '/api/administracion/lista/MEJORAMIENTO_TIPO_SUPERFICIE/items',
  path_intervencion_rutasTransporte: '/api/administracion/lista/MEJORAMIENTO_RUTAS_DE_TRANSPORTE/items',
  path_intervencion_tipoFalla: '/api/administracion/tipofalla',
  path_workflow_diagnostico_fallas_tipo_falla:
    '/api/administracion/tipofalla/listByTipoSuperficie/{tipoSuperficieId}',
  path_intervencion_tipoIntervencion: '/api/administracion/lista/TAB_FALLA_ID_TIPO_INTERVENCION/items',
  path_all_tipoIntervencion: '/api/administracion/tipoIntervencion/listBySuperficieIntervencion/{tipoSuperficieId}',
  path_workflow_diagnostico_fallas_tipoIntervencion:
    '/api/administracion/tipoIntervencion/listByReferenciaIntervencion/647374/{tipoSuperficieId}',
  path_workflow_diagnostico_fallas_tipoIntervencionEncabezado:
    '/api/administracion/tipoIntervencion/listByReferenciaIntervencion/647373/{tipoSuperficieId}',
  path_intervencion_tipoEjecucion: '/api/administracion/lista/TAB_MANTENIMIENTO_VIAL_ID_TIPO_EJECUCION/items',
  path_intervencion_clase: '/api/administracion/lista/INTERVENCION_CLASE/items',
  path_intervencion_via_tipoUsoVia: '/api/administracion/lista/MEJORAMIENTO_USO_VIAL/items',
  path_intervencion_tipoVia: '/api/administracion/lista/MEJORAMIENTO_TIPO_VIA/items',
  path_administracion_all_usuarios_director_obra_autocomplete: '/api/usuario/getAllDirObraAutocomplete',
};
/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  mejoramiento_diseino_create: 'MEJORAMIENTO_DISENIO_CREATE',
  mejoramiento_diseino_update: 'MEJORAMIENTO_DISENIO_UPDATE',
  mejoramiento_diseino_view: 'MEJORAMIENTO_DISENIO_VIEW',
};
/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_INTERVENCION_VISITA_VERIFICACION = {
  localidad: 'Localidad',
  upla: 'Upz',
  barrio: 'Barrio',
  nInforme: 'No acta',
  direccion: 'Dirección',
  via: 'Via',
  fechaVisita: 'Fecha visita',
  desde: 'Desde',
  hasta: 'Hasta',
  civ: 'Civ',
  tipoEjecucion: 'Tipo ejecucion',
  pk: 'PK',
  areaPk: 'Area PK',
  tipoVia: 'Tipo Via',
  clase: 'Clase',
  tipo: 'Tipo',
  tipoSuperficie: 'Tipo superficie',
  rutasTransportes: 'Rutas de transporte',
  responsable: 'Responsable visita',
  numero: 'Número',
  distancia: 'Distancia (m)',
  tipoFalla: 'Tipo Falla',
  longitud: 'Longitud',
  ancho: 'Ancho (m)',
  areaFalla: 'Area de falla (m2)',
  espesor: 'Espesor',
  volumen: 'Volumen',
  tipoIntervencion: 'Tipo de intervención',
  observaciones: 'Observaciones',
  actividadDestino: 'Actividad destino',
  listaChequeo: 'Lista de Chequeo',
  directorDeObra: 'Director de Obra',
  estadoProgramacion: 'Estado Programación',
  adicionar: 'Adicionar',
  camara: 'Camara',
  foto: 'Foto',
  capas: 'Capas (diseño)',
  nuevaActa: 'Crear acta',
  guardarSeccion: 'Guardar Seccion',
  guardarTodo: 'Guardar Todo',
  irAtras: 'Ir Atrás',
  consultarDisenio: 'Consultar información de diseño',
  requiereActualizacionDiagnostico: '¿Requiere actualización diagnostico?',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
