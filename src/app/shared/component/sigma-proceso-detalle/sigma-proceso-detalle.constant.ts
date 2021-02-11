import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_procesotransicionobjeto: '/api/administracion/procesotransicionobjeto',
  path_administracion_procesotransicionobjeto_view: '/api/mejoramiento/diagnosticohistorial',
  path_administracion_procesotransicionobjeto_asignadoId: '/api/administracion/usuario/',
  path_administracion_procesotransicionobjeto_procesoTransicionId:
    '/api/administracion/procesotransicion/',
  path_administracion_procesotransicionobjeto_usuarioId: '/api/administracion/usuario/',
  path_administracion_procesoTransicionId: '/api/administracion/procesotransicion/',
  path_administracion_procesoActividadId: '/api/administracion/procesoactividad/',

};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_procesotransicionobjeto_create: 'ADMINISTRACION_PROCESOTRANSICIONOBJETO_CREATE',
  permiso_administracion_procesotransicionobjeto_update: 'ADMINISTRACION_PROCESOTRANSICIONOBJETO_UPDATE',
  permiso_administracion_procesotransicionobjeto_delete: 'ADMINISTRACION_PROCESOTRANSICIONOBJETO_DELETE',
  permiso_administracion_procesotransicionobjeto_view: 'ADMINISTRACION_PROCESOTRANSICIONOBJETO_VIEW',
  permiso_administracion_procesotransicionobjeto_list: 'ADMINISTRACION_PROCESOTRANSICIONOBJETO_LIST',
  permiso_administracion_procesotransicionobjeto_export: 'ADMINISTRACION_PROCESOTRANSICIONOBJETO_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_PROCESOTRANSICIONOBJETO = {
  activo: 'Activo',
  asignadoId: 'Asignado a',
  fechaVisita: 'Fecha',
  fechaAsignacion: 'Fecha Asignación',
  vencimiento: 'Fecha Vencimiento',
  fechaInicio: 'Fecha Inicio',
  fechaFin: 'Fecha Fin',
  documentoId: 'Documento',
  usuarioAsignado: 'Usuario',
  actividad: 'Actividad',
  descripcionActividad: 'Actividad',
  // fecha: 'Fecha',
  id: 'Id',
  objeto: 'Objeto',
  observacion: 'Observación Gestión',
  procesoTransicionId: 'Proceso Transicion',
  responsableActividad: 'Responsable actividad',
  usuarioId: 'Usuario',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
