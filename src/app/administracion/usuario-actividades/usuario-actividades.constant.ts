import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permisos_ADMINISTRACION_USUARIO_ACTIVIDADES_view: 'ADMINISTRACION_USUARIO_ACTIVIDADES_VIEW',
  permisos_ADMINISTRACION_USUARIO_ACTIVIDADES_list: 'ADMINISTRACION_USUARIO_ACTIVIDADES_LIST',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_USUARIO_ACTIVIDADES = {
  actividad: 'Actividad',
  programa: 'Programa',
  pendientes: 'Pendientes',
  acciones: 'Acciones',
  ...PERMISOS,
  ...CONST_SHARED,
}
