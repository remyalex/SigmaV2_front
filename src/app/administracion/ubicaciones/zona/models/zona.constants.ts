import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** Constantes con valores de URL´s relacionadas con el componente */
export const PATH = {

};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
    permiso_administracion_zona_list: 'ADMINISTRACION_ZONA_LIST',
    permiso_administracion_zona_create: 'ADMINISTRACION_ZONA_CREATE',
    permiso_administracion_zona_edit: 'ADMINISTRACION_ZONA_EDIT',
    permiso_administracion_zona_detail: 'ADMINISTRACION_ZONA_VIEW',
    permiso_administracion_zona_delete: 'ADMINISTRACION_ZONA_DELETE'
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_ZONA = {
    crear: 'Crear',
    id: 'Id',
    nombre: 'Nombre',
    valor: 'Valor',
    consultar: 'Consultar',
    ...PATH,
    ...PERMISOS,
    ...CONST_SHARED
};
