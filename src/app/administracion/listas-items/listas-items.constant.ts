import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permisos_administracion_lista_item_create: 'ADMINISTRACION_LISTA_ITEM_CREATE',
  permisos_administracion_lista_item_update: 'ADMINISTRACION_LISTA_ITEM_UPDATE',
  permisos_administracion_lista_item_delete: 'ADMINISTRACION_LISTA_ITEM_DELETE',
  permisos_administracion_lista_item_view: 'ADMINISTRACION_LISTA_ITEM_VIEW',
  permisos_administracion_lista_item_list: 'ADMINISTRACION_LISTA_ITEM_LIST',
  permisos_administracion_lista_item_export: 'ADMINISTRACION_LISTA_ITEM_EXPORT',
};

/** Constantes con valores de URL´s relacionadas con el componente */
export const PATH = {
  path_lista: '/api/administracion/lista',
}

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_LISTAS_ITEM = {
  error: {
    longitud100: 'Campo debe tener una longitud máxima de 100 caracteres.',
    longitud255: 'Campo debe tener una longitud máxima de 255 caracteres.',
    longitud500: 'Campo debe tener una longitud máxima de 500 caracteres.'
  },
  listaItem: 'Lista item',
  ...PATH,
  ...PERMISOS,
  ...CONST_SHARED,
}
