import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_orfeo: '/api/orfeo',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_orfeo_update: 'ADMINISTRACION_ORFEO_UPDATE',
  permiso_administracion_orfeo_view: 'ADMINISTRACION_ORFEO_VIEW',
  permiso_administracion_orfeo_list: 'ADMINISTRACION_ORFEO_LIST',
  permiso_administracion_orfeo_export: 'ADMINISTRACION_ORFEO_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_ORFEO = {
  activo: 'Activo',
  id: 'Id',
  tipo: 'Tipo',
  fechaRadicado: 'Fecha radicado',
  fechaVencimiento: 'Fecha vencimiento',
  fechaGeneracionDocumento: 'Fecha generación documento',
  requiereRespuesta: 'Requiere respuesta',
  numeroRadicado: 'Número radicado',
  entidadRemitente: 'Entidad remitente',
  asunto: 'Asunto de la solicitud',
  dependenciaAsignada: 'Dependencia asignada',
  resumen: 'Resumen',
  estado: 'Estado',
  nombresUsuario: 'Nombre del remitente',
  apellidosUsuario: 'Apellidos del remitente',
  tipoDocumentoIdentidad: 'Tipo documento identidad',
  numeroDocumentoIdentidad: 'Número documento identidad',
  tipoPersona: 'Tipo persona',
  nombres: 'Nombres del remitente',
  apellidos: 'Apellidos del remitente',
  tipoDocumentoIdentidadRemitente: 'Tipo documento identidad remitente',
  numeroDocumentoIdentidadRemitente: 'Número documento identidad remitente',
  Nombre: 'Nombre del archivo',
  URLDescarga: 'URL descarga',
  tipoDocumento: 'Tipo documento',
  identificacionUsuario: 'Número Identificación del remitente',
  identificacionSolicitante: 'Número Identificación Solicitante',
  nombresFirmante: 'Nombre Firmante',
  direccionFirmante: 'Dirección',
  telefonoFirmante: 'Teléfono',
  emailFirmante: 'Email',
  formatoDDMMYYYY: 'DD-MM-YYYY',

  formato: 'Formato',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
