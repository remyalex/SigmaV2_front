import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_formatoseccion_return: '/administracion/formatoseccion/admin',
  path_administracion_formatoseccioncampo: '/api/administracion/formatoseccioncampo',
  path_administracion_formatoseccioncampo_formatoSeccionId: '/api/administracion/formatoseccion',
  path_administracion_formatoseccioncampo_listaId: '/api/administracion/lista',
  path_administracion_formatoseccioncampo_tipoCampoFormatoId: '/api/administracion/lista/ADMINISTRACION_TIPO_CAMPO_FORMATO/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_formatoseccioncampo_create: 'ADMINISTRACION_FORMATOSECCIONCAMPO_CREATE',
  permiso_administracion_formatoseccioncampo_update: 'ADMINISTRACION_FORMATOSECCIONCAMPO_UPDATE',
  permiso_administracion_formatoseccioncampo_delete: 'ADMINISTRACION_FORMATOSECCIONCAMPO_DELETE',
  permiso_administracion_formatoseccioncampo_view: 'ADMINISTRACION_FORMATOSECCIONCAMPO_VIEW',
  permiso_administracion_formatoseccioncampo_list: 'ADMINISTRACION_FORMATOSECCIONCAMPO_LIST',
  permiso_administracion_formatoseccioncampo_export: 'ADMINISTRACION_FORMATOSECCIONCAMPO_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_FORMATOSECCIONCAMPO = {
  activo: 'Activo',
  descripcion: 'Descripción',
  errorFormatoseccion: 'No se ha indicado el formato o sección para registrar los campos',
  formatoSeccionId: 'Formato Sección',
  id: 'Id',
  listaId: 'Lista',
  nombre: 'Nombre',
  orden: 'Orden',
  titulo: 'Formato sección campo',
  regresarSeccion: 'Regresar a la sección',
  tipoCampoFormatoId: 'Tipo Campo',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
