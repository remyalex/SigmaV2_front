import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_ver_todos_pks_asignados_sst: 'WORKFLOW_GESTIONAR_RESIDENTE_SST_ALL_PK'
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ASIGNAR_RESIDENTE_SST = {

  residenteSSTl: 'Residente SST',
  personas: 'Asignar Residente SST',
  zona: 'Zona',
  asignacion: 'asignacion',
  edicion: 'edicion',
  guardado: 'guardado',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS

};
