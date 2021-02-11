import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
    path_mejoramiento_historial_mantenimiento: '/api/mejoramiento/mantenimientoHistorial',
    path_mejoramiento_historial_mentenimiento_permisoId: '/api/usuario/permisos',
    path_mejoramiento_lista_tipoSolicitud: '/api/administracion/lista/MEJORAMIENTO_TIPO_SOLICITUD/items',
    path_mejoramiento_lista_estadopk: '/api/administracion/lista/ESTADO_PK/items',
    path_mejoramiento_lista_upla: '/api/administracion/ubicaciones/upla',
    path_mejoramiento_lista_upz: '/api/administracion/ubicaciones/upla',
    path_mejoramiento_lista_tipoIntervencion: '/api/administracion/tipoIntervencion/listByReferenciaIntervencion/647373/0',
//    path_mejoramiento_lista_localidades: '/api/administracion/lista/UMV_LOCALIDADES/items',
    path_mejoramiento_lista_localidades: '/api/administracion/ubicaciones/localidad',
//    path_mejoramiento_lista_zonas: '/api/administracion/lista/UMV_ZONAS/items',
    path_mejoramiento_lista_zonas: '/api/administracion/ubicaciones/zona',
//    path_mejoramiento_lista_barrios: '/api/administracion/lista/UMV_BARRIOS/items',
    path_mejoramiento_lista_barrios: '/api/administracion/ubicaciones/barrio',
    path_mejoramiento_tipo_malla: '/api/administracion/lista/MEJORAMIENTO_TIPO_MALLA/items'
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {

};

export const COSNT_MEJORAMIENTO_HISTORIAL_MANTENIMIENTO = {
    actividadAgrupada: 'Actividad agrupada',
    activarBusquedaAvanzada: 'Activar Búsqueda Avanzada',
    activarBusquedaPorFiltros: 'Activar Búsqueda Con Filtros',
    andOr: 'And / Or',
    campo: 'Campo',
    origen: 'Origen',
    enSeguimiento: 'En seguimiento',
    estadoPk: 'Estado PK',
    estadoDoc: 'Estado Documento',
    localidad: 'Localidad',
    fecha: 'Fecha',
    fechaInicio: 'Fecha de inicio',
    zona: 'Zona',
    barrio: 'Barrio',
    upla: 'UPZ',
    tipoIntervencionTotalId: 'Tipo Intervención Total',
    fechaFin: 'Fecha fin',
    historialMantenimiento: 'Historial Mantenimiento',
    responsable: 'Responsable',
    pk: 'Pk',
    civ: 'CIV',
    tipoMallaId: 'Tipo de malla vial',
    indicePriorizacion: 'Indice Priorización',
    tieneRutasTransporte: 'Tiene Rutas Transporte',
    usoViaId: 'Uso de la Vía',
    operador: 'Operador',
    igual: 'Igual',
    mayor: 'Mayor',
    mayorIgual: 'Mayor igual',
    menor: 'Menor',
    menorIgual: 'Menor igual',
    contiene: 'Contiene',
    inicia: 'Inicia',
    finaliza: 'Finaliza',
    diferente: 'Diferente',
    vistaDiagnostico: 'Vista diagnostico',
    vistaVerificacion: 'Vista verificación',
    historialDocumento: 'Historial Documentos',
    text: 'text',
    tipoMalla: 'Tipo malla',
    list: 'list',
    date: 'date',
    number: 'number',
    valor: 'Valor *',
    where: 'WHERE',
    id: 'Id',
    version: 'Versión',
    autor: 'Autor',
    ...CONST_SHARED,
    ...PATHS,
    ...PERMISOS
};
