import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  // path_administracion_grupo: '/api/administracion/grupo',
  path_administracion_grupo: '/api/administracion/grupo/',
  path_administracion_grupo_origenLugarId: '/api/administracion/lista/MEJORAMIENTO_TIPO_SOLICITUD/items',
  path_administracion_grupo_localidadesGrupoId: '/api/administracion/lista/UMV_LOCALIDADES/items',
  path_administracion_grupo_zonaGrupoId: '/api/administracion/lista/UMV_ZONAS/items',
  path_administracion_grupo_barrioGrupoId: '/api/administracion/lista/UMV_BARRIOS/items',
  path_administracion_grupo_uplaGrupoId: '/api/administracion/lista/UMV_UPZS/items',
  path_administracion_grupo_cuadranteGrupoId: '/api/administracion/lista/UMV_CUADRANTES/items',
  databaseTables: '/api/database',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_grupo_create: 'ADMINISTRACION_GRUPO_CREATE',
  permiso_administracion_grupo_update: 'ADMINISTRACION_GRUPO_UPDATE',
  permiso_administracion_grupo_delete: 'ADMINISTRACION_GRUPO_DELETE',
  permiso_administracion_grupo_view: 'ADMINISTRACION_GRUPO_VIEW',
  permiso_administracion_grupo_list: 'ADMINISTRACION_GRUPO_LIST',
  permiso_administracion_grupo_export: 'ADMINISTRACION_GRUPO_EXPORTAR',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_GRUPO = {
  activo: 'Activo',
  descripcion: 'Descripción',
  nombre: 'Nombre',
  fecha: 'Fecha',
  calzadas: 'Cantidad de calzadas',
  kilometroCarril: 'Total kilómetro carril',
  origenSeleccion: 'Origen Selección',
  estadoSeleccion: 'Estado Selección',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
