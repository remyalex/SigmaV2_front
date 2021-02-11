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
  permiso_gestion_ambiental_registrar_cierre: 'REGISTRAR_CIERRE_AMBIENTAL',
  permiso_gestion_ambiental_consultar_cierre: 'CONSULTAR_CIERRE_AMBIENTAL',
  permiso_registrar_chequeoSST_create: 'WORKFLOW_REGISTRAR_CHEQUEO_SST_CREATE',
  permiso_registrar_chequeoSST_view: 'WORKFLOW_REGISTRAR_CHEQUEO_SST_VIEW',
  permiso_registrar_chequeoAmbiental_create: 'WORKFLOW_REGISTRAR_CHEQUEO_AMBIENTAL_CREATE',
  permiso_registrar_chequeoAmbietnal_view: 'WORKFLOW_REGISTRAR_CHEQUEO_AMBIETAL_VIEW',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_GESTION_AMBIENTAL = {
  chequeoAmbiental: {
    banios: 'Baños',
    cantidadArboles: 'Cantidad de árboles',
    cantidadBanos: 'Cantidad Baños',
    cantidadCerramiento: 'Cantidad de cerramiento',
    cantidadEspacioPublico: 'Cantidad de espacio público',
    cantidadProteccionSumideros: 'Cantidad sumideros',
    cantidadSenderos: 'Cantidad de senderos',
    cerramiento: 'Cerramiento',
    espacioPublico: 'Espacio Público',
    senderos: 'Senderos',
    proteccionArboles: 'Protección árboles',
    proteccionSumideros: 'Protección sumideros'
  },
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
  coi: 'COI',
  consolidadoBanosPortatiles: 'Consolidado de baños portatiles',
  consultarCierreAmbiental: 'Consultar cierre ambiental',
  fechaCoi: 'Fecha COI',
  programarBanosPortatiles: 'Programar baños portatiles',
  registrarCierreAmbiental: 'Registrar Cierre ambiental',
  noCierres: 'No hay cierres ambietales registrados',
  seleccioneListaAmbiental: 'Seleccione de la lista de chequeo Ambiental',
  select: 'Select',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};