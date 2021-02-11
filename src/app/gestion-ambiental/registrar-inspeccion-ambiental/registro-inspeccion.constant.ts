import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
    path_lista_items_zonas: '/api/administracion/lista/UMV_ZONAS/items',
    path_lista_items_localidades: '/api/administracion/lista/UMV_LOCALIDADES/items',
    path_lista_items_uplas: '/api/administracion/lista/UMV_UPZS/items',
    path_lista_items_barrios: '/api/administracion/lista/UMV_BARRIOS/items',
    path_lista_items_situacion: '/api/administracion/lista/UMV_INSPECCION_AMB_SITUACION/items',
    path_lista_items_elemento: '/api/administracion/lista/UMV_INSPECCION_AMB_ELEMENTO/items',
    path_lista_items_estado: '/api/administracion/lista/UMV_INSPECCION_AMB_ESTADO/items'
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
    ambiental_inspeccion_create: 'AMBIENTAL_INSPECCION_CREATE',
    ambiental_inspeccion_update: 'AMBIENTAL_INSPECCION_UPDATE',
    ambiental_inspeccion_list: 'AMBIENTAL_INSPECCION_LIST',
    ambiental_inspeccion_list_search: 'AMBIENTAL_INSPECCION_LIST_SEARCH',
  };

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_INSPECCION_REGISTRO_AMBIENTAL = {
    civ: 'Civ',
    barrio: 'Barrio',
    campoRangoHora: 'El rango de la hora a ingresar debe ser entre las 08:00 AM y 04:00 PM.',
    fechaNecesidadLLegada: 'Fecha necesidad llegada',
    fechaNecesidadRetiro: 'Fecha necesidad retiro',
    firma: 'Firma',
    horaNecesidadLLegada: 'Hora necesidad llegada',
    horaNecesidadRetiro: 'Hora necesidad retiro',
    localidad: 'Localidad',
    pk: 'Pk',
    tipoIntervencion: 'Tipo intervención',
    upla: 'Upz',
    fecha: 'Fecha',
    zona: 'Zona',
    situacion: 'Situacion',
    individuosArboreos: 'Individuos arboreos',
    proteccionArbolesCant: 'Proteccion arboles cantidad',
    sumideros: 'Sumideros',
    proteccionSumiderosCant: 'Proteccion sumideros cantidad',
    espacioPublico: 'Espacio publico',
    proteccionEspacioPublicoCant: 'Proteccion espacio publico cantidad',
    banios: 'Baños',
    baniosMantenimientoCant: 'Baños mantenimiento cantidad',
    accionImplementada: 'Accion implementada',
    estado: 'Estado',
    registroFotografico: 'Registro fotografico',
    observaciones: 'Observaciones',
    AmbElemento: 'Elemento',
    ...CONST_SHARED,
    ...PATHS,
    ...PERMISOS,
};
