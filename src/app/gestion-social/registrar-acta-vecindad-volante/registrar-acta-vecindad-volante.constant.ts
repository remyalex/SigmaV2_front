import { CONST_SHARED } from 'src/app/shared/constantes-shared';
import { CONST_ADMINISTRACION_MANTENIMIENTO } from 'src/app/administracion/grupo/mantenimiento/mantenimiento.constant';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_produccion_usuario_autocompletar: '/api/usuario/searchAutocomplete',
  path_produccion_persona_tipoEnsayo: '/api/administracion/lista/PRODUCCION_TIPO_ENSAYO/items',
  path_social_tipo_pieza_divulgar: '/api/administracion/lista/SOCIAL_TIPO_PIEZA_A_DIVULGAR/items'
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_social_actas_list: 'SOCIAL_REGISTRAR_ACTAS_VECINDAD_LIST',
  permiso_social_actas_view: 'SOCIAL_REGISTRAR_ACTAS_VECINDAD_VIEW',
  permiso_social_actas_create: 'SOCIAL_REGISTRAR_ACTAS_VECINDAD_CREATE',
  permiso_social_actas_update: 'SOCIAL_REGISTRAR_ACTAS_VECINDAD_UPDATE',
  permiso_social_actas_export: 'SOCIAL_REGISTRAR_ACTAS_VECINDAD_EXPORT',
  permiso_social_actas_export_pdf: 'SOCIAL_REGISTRAR_ACTAS_VECINDAD_EXPORT_PDF',
  permiso_social_actas_export_excel: 'SOCIAL_REGISTRAR_ACTAS_VECINDAD_EXPORT_EXCEL',
  permiso_social_actas_btn_list_volantes: 'SOCIAL_REGISTRAR_ACTAS_VECINDAD_LIST_VOLANTES',
  permiso_social_actas_btn_consulta_social_volante: 'SOCIAL_REGISTRAR_ACTAS_VECINDAD_CONSULTA_SOCIAL_VOLANTE',
  permiso_social_actas_btn_afiche_volante: 'SOCIAL_REGISTRAR_ACTAS_VECINDAD_AFICHE_VOLANTE',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE = {
  activo: 'Activo',
  propietario: 'Nombre del Propietario o habitante',
  direccion: 'Dirección',
  telefono: 'Teléfono',
  fechaRegistro: 'Fecha',
  volanteEntregado: 'Volante entregado',
  pkListar: '',
  numeral: 'Numeral Ascendente',
  tipoIntervencion: 'Tipo Intervención',
  otroTipoIntervencion: 'Otro Tipo Intervención',
  nombreEstablecimiento: 'Nombre del Establecimiento y/o espacio',
  personaContacto: 'Persona Contacto',
  tipoPiezaDivulgar: 'Tipo de Pieza a divulgar',
  cantidad: 'Cantidad',
  observaciones: 'Observaciones',
  archivo: 'Archivo',
  excel: 'excel',
  pdf: 'pdf',
  ...CONST_SHARED,
  ...CONST_ADMINISTRACION_MANTENIMIENTO,
  ...PATHS,
  ...PERMISOS,
};
