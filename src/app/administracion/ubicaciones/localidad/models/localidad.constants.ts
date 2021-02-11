import { CONST_SHARED } from 'src/app/shared/constantes-shared';


/** Constantes con valores de URL´s relacionadas con el componente */
export const PATH = {

};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
    permiso_administracion_localidad_list: 'ADMINISTRACION_LOCALIDAD_LIST',
    permiso_administracion_localidad_create: 'ADMINISTRACION_LOCALIDAD_CREATE',
    permiso_administracion_localidad_edit: 'ADMINISTRACION_LOCALIDAD_EDIT',
    permiso_administracion_localidad_detail: 'ADMINISTRACION_LOCALIDAD_VIEW',
    permiso_administracion_localidad_delete: 'ADMINISTRACION_LOCALIDAD_DELETE'
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_LOCALIDAD = {
    crear: 'Crear',
    id: 'Id',
    nombre: 'Nombre',
    valor: 'Valor',
    consultar: 'Consultar',
    ...PATH,
    ...PERMISOS,
    ...CONST_SHARED
};