import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_lugar: '/api/administracion/lugar/',
  path_administracion_lugar_estadoLugarId: '/api/administracion/lista/ADMINISTRACION_LUGAR_ESTADO/items',
  path_administracion_lugar_origenLugarId: '/api/administracion/lista/ADMINISTRACION_LUGAR_ORIGEN/items',
  path_administracion_lugar_tipoLugarId: '/api/administracion/lista/ADMINISTRACION_LUGAR_TIPO/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  administracion_lugar_create: 'ADMINISTRACION_LUGAR_CREATE',
  administracion_lugar_update: 'ADMINISTRACION_LUGAR_UPDATE',
  administracion_lugar_delete: 'ADMINISTRACION_LUGAR_DELETE',
  administracion_lugar_view: 'ADMINISTRACION_LUGAR_VIEW',
  administracion_lugar_list: 'ADMINISTRACION_LUGAR_LIST',
  administracion_lugar_export: 'ADMINISTRACION_LUGAR_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_LUGAR = {
  activo: 'Activo',
  contactoCorreo: 'Contacto Correo',
  contactoNombre: 'Contacto Nombre',
  contactoTelefono: 'Contacto Teléfono',
  descripcion: 'Descripción',
  direccion: 'Dirección',
  estadoLugarId: 'Estado',
  fechaDesde: 'Fecha Desde',
  fechaHasta: 'Fecha Hasta',
  horaFin: 'Hora Fin',
  horaInicio: 'Hora Inicio',
  id: 'Id',
  nombre: 'Nombre',
  origenLugarId: 'Origen',
  tipoLugarId: 'Tipo',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS
};
