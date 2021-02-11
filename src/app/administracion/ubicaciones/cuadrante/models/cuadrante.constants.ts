import { CONST_SHARED } from 'src/app/shared/constantes-shared';


/** Constantes con valores de URL´s relacionadas con el componente */
export const PATH = {

};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
    permiso_administracion_cuadrante_list: 'ADMINISTRACION_CUADRANTE_LIST',
    permiso_administracion_cuadrante_create: 'ADMINISTRACION_CUADRANTE_CREATE',
    permiso_administracion_cuadrante_edit: 'ADMINISTRACION_CUADRANTE_EDIT',
    permiso_administracion_cuadrante_detail: 'ADMINISTRACION_CUADRANTE_VIEW',
    permiso_administracion_cuadrante_delete: 'ADMINISTRACION_CUADRANTE_DELETE'
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_CUADRANTE = {
    crear: 'Crear',
    id: 'Id',
    nombre: 'Nombre',
    valor: 'Valor',
    consultar: 'Consultar',
    ...PATH,
    ...PERMISOS,
    ...CONST_SHARED
};

