import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_produccion_usuario_autocompletar: '/api/usuario/searchAutocomplete',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_produccion_importar_archivo_combustible_vehiculo: 'PRODUCCION_IMPORTAR_ARCHIVO_COMBUSTIBLE_VEHICULOS',
  permiso_produccion_importar_archivo_combustible_maquinaria: 'PRODUCCION_IMPORTAR_ARCHIVO_COMBUSTIBLE_MAQUINARIA',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_PRODUCCION_IMPORTAR_COMBUSTIBLE_VEHICULO = {
  tituloCargue: 'Confirmación Cargue',
  mensajeCargue: 'Está seguro que desea continuar con el cargue de la información de Consumo de combustible de Vehículos Automotores?',
  mensajeCargueMaq: 'Está seguro que desea continuar con el cargue de la información de Consumo de combustible de Maquinaria?',
  tituloInconsistencia: 'Reporte Inconsistencias', 
  mensajeInconsistencia: 'Se han presentado inconsistencias durante el cargue del Archivo, favor corregirlas! Descargue el archivo para corregirlas.',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};