import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permisos_administracion_listas_create: 'ADMINISTRACION_LISTA_CREATE',
  permisos_administracion_listas_update: 'ADMINISTRACION_LISTA_UPDATE',
  permisos_administracion_listas_delete: 'ADMINISTRACION_LISTA_DELETE',
  permisos_administracion_listas_view: 'ADMINISTRACION_LISTA_VIEW',
  permisos_administracion_listas_list: 'ADMINISTRACION_LISTA_LIST',
  permisos_administracion_listas_export: 'ADMINISTRACION_LISTA_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_LISTAS = {
  descripcion: 'Descripción',
  deseaEliminar: '¿Desea eliminar la Lista?',
  activo: 'Activo',
  error: {
    longitud100: 'Campo debe tener una longitud máxima de 100 caracteres.',
    longitud255: 'Campo debe tener una longitud máxima de 255 caracteres.',
    longitud500: 'Campo debe tener una longitud máxima de 500 caracteres.'
  },
  listas: 'Listas',
  lista: 'Lista',
  nombre: 'Nombre',
  valor: 'Valor',
  deSistema: 'Sistema',
  ...PERMISOS,
  ...CONST_SHARED,
}
