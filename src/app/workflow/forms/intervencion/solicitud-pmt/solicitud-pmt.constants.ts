import { CONST_SHARED } from '../../../../shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
    path_lista_items_tipoPmt: '/api/administracion/lista/TAB_ELEMENTO_ID_TIPO_PMT/items',
    path_list_items_estado_pmt: '/api/administracion/lista/ESTADO_SOLICITUD_PMT/items',
    path_list_items_tipo_cierre: '/api/administracion/lista/INTERVENCION_SOLICITUD_PMT_TIPO_CIERRE/items',
    path_intervencion_solicitudPmt_autocomplete: '/api/intervencion/solicitudPmt/autocomplete'
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {

};

export const SOLICITUD_PMT_CONSTANTS = {
    tituloRegistar: 'Registro Solicitud PMT',
    tituloEditar: 'Editar Solicitud PMT',
    tituloLectura: 'Solicitud PMT',
    cancelar: 'Cancelar',
    atras: 'Ir Atras',
    iconBack: 'arrow_back',
    iconCancel: 'close',
    fechaRadicadoMovilidad: 'Fecha Radicado en Movilidad',
    tipoPmt: 'Tipo PMT',
    numeroRadicadoPmt: 'Número Radicado PMT',
    numeroRadicadoMovilidad: 'Número Radicado Movilidad',
    tipoCierre: 'Tipo Cierre',
    fechaInicio: 'Fecha Inicio Trabajo',
    fechaFin: 'Fecha Fin Trabajo',
    horaInicioTrabajo: 'Hora Inicio',
    horaFinalTrabajo: 'Hora Fin',
    horaInicioCierre: 'Hora Inicio Cierre',
    horaFinalCierre: 'Hora Fin Cierre',
    coi: 'COI',
    estadoPmt: 'Estado PMT',
    observaciones: 'Observaciones',
    adjuntarPmt: 'Adjuntar PMT',
    guardar: 'Guardar',
    asociar: 'Asociar',
    solicitudPmt: 'Solicitud PMT',
    ...CONST_SHARED,
    ...PATHS,
    ...PERMISOS,

};
