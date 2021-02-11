import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  // path_administracion_gestionarprocesos: '/api/administracion/gestionarprocesos',
  path_administracion_gestionarprocesos: '/api/mejoramiento/mantenimiento',
  path_administracion_gestionarprocesos_records: '/api/workflow/mantenimiento-registro',
  //Paths reasignaciones
  path_administracion_gestionarprocesos_reasignarusuarios: '/api/usuario',
  path_administracion_gestionarprocesos_reasignaractividades: '/api/usuario',
  path_administracion_gestionarprocesos_reasignarestadopk: '/api/administracion/lista/ESTADO_PK/items',
  path_administracion_gestionarprocesos_acciones_request: '/api/mejoramiento/mantenimiento',
  // PROCESO Y ACTIVIDAD
  path_administracion_gestionarprocesos_procesoinfolist: '/api/administracion/proceso/list',
  path_administracion_gestionarprocesos_actividadfinallist: '/api/administracion/proceso/info/',
  //database
  databaseTables: '/api/database',
  // Documeno
  path_administracion_documento: '/api/administracion/documento',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_gestionarprocesos_update: 'ADMINISTRACION_GESTIONARPROCESOS_UPDATE',
  permiso_administracion_gestionarprocesos_delete: 'ADMINISTRACION_GESTIONARPROCESOS_DELETE',
  permiso_administracion_gestionarprocesos_view: 'ADMINISTRACION_GESTIONARPROCESOS_VIEW',
  permiso_administracion_gestionarprocesos_list: 'ADMINISTRACION_GESTIONARPROCESOS_LIST',
  permiso_administracion_gestionarprocesos_export: 'ADMINISTRACION_GESTIONARPROCESOS_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_GESTIONARPROCESOS = {
  //MANTENIMIENTO
  activo: 'Activo',
  pkIdCalzadas: 'PK Id Calzadas',
  idMantenimiento: 'Id Mantenimiento',
  civ: 'CIV',
  estadoPk: 'Estado PK',
  descripcionOrigen: 'Origen',
  fechaVisita: 'Fecha Visita',
  localidad: 'Localidad',
  barrio: 'Barrio',
  zona: 'Zona',
  ejeVial: 'EjeVial',
  desde: 'Desde',
  hasta: 'Hasta',
  responsable: 'Responsable',
  actividadActual: 'Actividad Actual',
  programa: 'Programa',
  estrategia: 'Estrategia',
  administracion: 'Administración',
  diagnosticoObservaciones: 'Observación Diagnóstico',
  observacionesPriorizacion: 'Observación Priorización',
  //GESTION
  idGestion: 'Gestion ID',
  actividad: 'Actividad',
  usuario: 'Usuario',
  estado: 'Estado',
  fecha: 'Fecha',
  fechaAsignacion: 'FechaAsignacion',
  fechaInicio: 'FechaInicio',
  fechaFin: 'FechaFin',
  observaciones: 'Observaciones',
  tipoDocumento: 'Tipo Documento',
  idTipoDocumento: 'ID Documento',
  archivo: 'Archivo',
  // GENERALES
  seleccionarGestionProcesos: 'Seleccionar Gestión Procesos',
  descripcion: 'Descripción',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
