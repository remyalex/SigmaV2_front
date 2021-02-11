import { CONST_SHARED } from 'src/app/shared/constantes-shared';


/** Constantes con valores de URL´s relacionadas con el componente */
export const PATH = {

};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
    permiso_administracion_upz_list: 'ADMINISTRACION_UPZ_LIST',
    permiso_administracion_upz_create: 'ADMINISTRACION_UPZ_CREATE',
    permiso_administracion_upz_edit: 'ADMINISTRACION_UPZ_EDIT',
    permiso_administracion_upz_detail: 'ADMINISTRACION_UPZ_VIEW',
    permiso_administracion_upz_delete: 'ADMINISTRACION_UPZ_DELETE'
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_UPZ = {
    crear: 'Crear',
    id: 'Id',
    nombre: 'Nombre',
    valor: 'Valor',
    consultar: 'Consultar',
    ...PATH,
    ...PERMISOS,
    ...CONST_SHARED
};