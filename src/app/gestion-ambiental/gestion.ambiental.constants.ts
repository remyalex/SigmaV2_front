import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  // path_complemento: '',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_gestion_ambiental_registrar_cierre: 'REGISTRAR_CIERRE_AMBIENTAL',
  permiso_gestion_ambiental_consultar_cierre: 'CONSULTAR_CIERRE_AMBIENTAL',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_GESTION_AMBIENTAL = {
  civ: 'CIV',
  barrio: 'Barrio',
  campoRangoHora: 'El rango de la hora a ingresar no debe estar entre las 08:00 AM y 04:00 PM.',
  destinoEscombros: 'Destino escombros',
  escombros: 'Escombros',
  fechaCierreAmbiental: 'Fecha registro de cierre ambiental',
  fechaNecesidadLLegada: 'Fecha necesidad llegada',
  fechaNecesidadRetiro: 'Fecha necesidad retiro',
  firma: 'Firma',
  horaNecesidadLLegada: 'Hora necesidad llegada',
  horaNecesidadRetiro: 'Hora necesidad retiro',
  libreResiduoZonaVerde: 'Zonas verdes e individuos arbóreos - libre de residuos',
  libreResiduoZonaVerdeFotografico: 'Zonas verdes e individuos arbóreos - registro fotográfico',
  localidad: 'Localidad',
  otroTipoIntervencion: 'Otro tipo intervención',
  pk: 'PK',
  retiroProteccionSenalizacion: 'Señalización - Retiro de protección',
  retiroProteccionSenalizacionFotografico: 'Señalización - registro fotográfico',
  retiroProteccionSumidero: 'Sumidero - Retiro protección',
  retiroProteccionSumideroFotografico: 'Sumidero - registro fotográfico',
  retiroProteccionZonaVerde: 'Zonas verdes e individuos arbóreos - retiro protección',
  retiroProteccionZonaVerdeFotografico: 'Zonas verdes e individuos arbóreos - registro fotográfico',
  vistaGeneralFotografico: 'Vista general - registro fotográfico',
  tipoArchivos: {
    libreResiduo: 'LIBRERESIDUO',
    senalizacion: 'SENALIZACION',
    sumidero: 'SUMIDERO',
    vistaGeneral: 'VISTAGENERAL'
  },
  tipoIntervencion: 'Tipo intervención',
  upla: 'UPZ',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};