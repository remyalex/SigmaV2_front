import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {

  path_vigencia: '/api/administracion/lista/VIGENCIA/items',
  path_estrategia_prog_intervencion: '/api/administracion/lista/TAB_MANTENIMIENTO_VIAL_ID_TIPO_ESTRATEGIA/items',
  path_periodicidad: '/api/mejoramiento/periodicidad/parents',
  path_periodo: '/api/administracion/lista/PERIODO/items',
  path_dias_laborales: '/api/administracion/lista/NUM_DIAS_LABORALES/items',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_equipo_create: 'ADMINISTRACION_EQUIPO_CREATE',
  permiso_administracion_equipo_update: 'ADMINISTRACION_EQUIPO_UPDATE',
  permiso_administracion_equipo_delete: 'ADMINISTRACION_EQUIPO_DELETE',
  permiso_administracion_equipo_view: 'ADMINISTRACION_EQUIPO_VIEW',
  permiso_administracion_equipo_list: 'ADMINISTRACION_EQUIPO_LIST',
  permiso_administracion_equipo_export: 'ADMINISTRACION_EQUIPO_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_REGISTRAR_PROG_PERIODICA = {
  vigencia: 'Vigencia',
  periodicidad: 'Periodicidad',
  periodo: 'Periodo',
  mensajeCalcularCuadrilla: 'El cálculo de cuadrillas se realiza teniendo en cuenta la duración planeada sobre el número de días laborables seleccionados.',
  num_dias_laborales: 'No dias laborales',
  error_min: 'Valor mínimo no válido',
  error_max: 'Valor máximo no válido',
  tituloAsignar: 'Asignar Programación Periódica de PK',
  meses: {
    febrero: 'FEBRERO',
  },
  periodos: {
    enero: 'ENERO',
    febrero: 'FEBRERO',
    marzo: 'MARZO',
    abril: 'ABRIL',
    mayo: 'MAYO',
    junio: 'JUNIO',
    julio: 'JULIO',
    agosto: 'AGOSTO',
    septiembre: 'SEPTIEMBRE',
    octubre: 'OCTUBRE',
    noviembre: 'NOVIEMBRE',
    diciembre: 'DICIEMBRE',
    enero_febrero: 'ENERO - FEBRERO',
    marzo_abril: 'MARZO - ABRIL',
    mayo_junio: 'MAYO - JUNIO',
    julio_agosto: 'JULIO - AGOSTO',
    septiembre_octubre: 'SEPTIEMBRE - OCTUBRE',
    noviembre_diciembre: 'NOVIEMBRE - DICIEMBRE',
    enero_marzo: 'ENERO - MARZO',
    abril_junio: 'ABRIL - JUNIO',
    julio_septiembre: 'JULIO - SEPTIEMBRE',
    octubre_diciembre: 'OCTUBRE - DICIEMBRE',
    enero_junio: 'ENERO - JUNIO',
    julio_diciembre: 'JULIO - DICIEMBRE'
  },
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};