import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_coi: '/api/administracion/lista/COI/items',
  path_administracion_usoEpp: '/api/administracion/lista/USO_EPP/items',
  path_administracion_senalizacionPmt: '/api/administracion/lista/SENALIZACION_PMT/items',

};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_registrar_chequeoSST_create: 'WORKFLOW_REGISTRAR_CHEQUEO_SST_CREATE',
  permiso_registrar_chequeoSST_update: 'WORKFLOW_REGISTRAR_CHEQUEO_SST_UPDATE',
  permiso_registrar_chequeoSST_view: 'WORKFLOW_REGISTRAR_CHEQUEO_SST_VIEW',
  permiso_registrar_chequeoSST_list: 'WORKFLOW_REGISTRAR_CHEQUEO_SST',
  permiso_registrar_chequeoSST_export: 'WORKFLOW_REGISTRAR_CHEQUEO_SST',
  permiso_registrar_chequeoSST_delete: 'WORKFLOW_REGISTRAR_CHEQUEO_SST_DELETE',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_REGISTRAR_CHEQUEOSST = {
  activo: 'Activo',
  chequeoSST: {
    archivoFormato: 'Firma (formato PDF, JPG)',
    auxiliaresTrafico: 'Auxiliares de tráfico',
    botiquin: 'Botiquín',
    camilla: 'Camilla',
    cantidadBotiquin: 'Cantidad de Botiquín',
    cantidadCamilla: 'Cantidad de Camilla',
    cantidadCarpas: 'Cantidad Carpas',
    cantidadInmovilizadores: 'Cantidad de Inmovilizadores',
    cantidadEspacioPublico: 'Cantidad de Espacio Publico',
    cantidadExtintor: 'Cantidad de Extintor',
    cantidadMaquinaria: 'Cantidad de Maquinaría',
    cantidadUsoEpp: 'Cantidad uso Epp',
    cantidadSenalizacionPmt: 'Cantidad señalización PMT',
    cantidadSenalizacionSst: 'Cantidad señalización SST',
    carpas: 'Carpas',
    coi: 'COI',
    extintor: 'Extintor',
    maquinaria: 'Identificación maquinaría',
    inmovilizadores: 'Inmovilizadores',
    usoEpp: 'Uso EPP',
    registroFotografico: 'Registro fotográfico',
    seleccioneChequeoSST: 'Seleccione de la lista de chequeo SST',
    senalizacionPmt: 'Señalizacion PMT',
    senalizacionSST: 'Senalización SST'
  },
  select: 'Select',
  coi: 'COI',
  fechaCoi: 'Fecha Coi',
  datepicker: {
    placeholder: 'Calendario',
    types: {
      calendar: 'calendar',
      timer: 'timer',
      dateTime: 'datetime',
      fullCalendar: 'both'
    }
  },

  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
