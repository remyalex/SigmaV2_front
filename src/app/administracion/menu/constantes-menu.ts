import { CONST_SHARED } from 'src/app/shared/constantes-shared';

export const PATH_SERVICES = {
    path_menu: '/api/menu',
    path_permisos: '/api/administracion/permiso'
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
    permisos_administracion_menu_create: 'ADMINISTRACION_MENU_CREATE',
    permisos_administracion_menu_update: 'ADMINISTRACION_MENU_UPDATE',
    permisos_administracion_menu_delete: 'ADMINISTRACION_MENU_DELETE',
    permisos_administracion_menu_view: 'ADMINISTRACION_MENU_VIEW',
    permisos_administracion_menu_list: 'ADMINISTRACION_MENU_LIST',
    permisos_administracion_menu_export: 'ADMINISTRACION_MENU_EXPORT',
  };

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_MENU = {
    id: 'Id',
    titulo: 'Título',
    descripcion: 'Descripción',
    tipoEnlace: 'Tipo de enlace',
    orden: 'Órden',
    routerLink: 'Ruta interna',
    href: 'Ruta externa',
    url: 'URL',
    target: 'Modo visualización',
    padre: 'Menú padre',
    permiso: 'Permiso',
    icon: 'Ícono',
    activo: 'Activo',
    menu: 'Menú',
    path_administracion_menu_icon: '/api/administracion/listaItems/autocomplete',
    ...CONST_SHARED,
    ...PATH_SERVICES,
    ...PERMISOS,
};
