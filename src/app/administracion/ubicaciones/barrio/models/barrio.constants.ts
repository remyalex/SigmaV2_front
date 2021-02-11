import { CONST_SHARED } from 'src/app/shared/constantes-shared';



/** Constantes con valores de URL´s relacionadas con el componente */
export const PATH = {

};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
    permiso_administracion_barrio_list: 'ADMINISTRACION_BARRIO_LIST',
    permiso_administracion_barrio_create: 'ADMINISTRACION_BARRIO_CREATE',
    permiso_administracion_barrio_edit: 'ADMINISTRACION_BARRIO_EDIT',
    permiso_administracion_barrio_detail: 'ADMINISTRACION_BARRIO_VIEW',
    permiso_administracion_barrio_delete: 'ADMINISTRACION_BARRIO_DELETE'
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_BARRIO = {
    crear: 'Crear',
    id: 'Id',
    nombre: 'Nombre',
    valor: 'Valor',
    consultar: 'Consultar',
    ...PATH,
    ...PERMISOS,
    ...CONST_SHARED
};
