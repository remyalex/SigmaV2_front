import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  };

  /**
  * Hommologación de las constantes de permisos usados por el componente 
  * con los asignados en la base de datos
  */
  /**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  };

  /**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_PRODUCCION_MEZCLA = {
    title: 'Programar Producción De La Mezcla',
    noResultados: 'No se encuentran resultados.',
    numeroSolicitud: 'N° Solicitud',
    fechaSolicitud: 'Fecha Solicitud',
    tipoMaterial: 'Tipo Material',
    turno: 'Turno',
    cantidad: 'Cantidad',
    formatoFechaDDMMYYYY: 'DD-MM-YYYY',
    barrio: 'Barrio',
    localidad: 'Localidad',
    placaNumeroInterno: 'Placa /No Interno',
    viaDestino: 'Vía Destino',
    unidad: 'Unidad',
    pk: 'PK',
    civ: 'CIV',
    ejeVial: 'Eje Vial',
    ejeVialDesde: 'Eje Vial Desde',
    ejeVialHasta: 'Eje Vial Hasta',
    personasContacto: 'Personas Contacto',
    horaRetiro: 'Hora Retiro',
    fechaRetiro: 'Fecha Retiro',
    quienRecibe: 'Quien Recibe',
    programado: 'Programado',
    reprogramar: 'Reprogramar',
    programadoReprogramar: 'Programado /Reprogramar',
    capacidadDespachar: 'Capacidad Despachar',
    fechaReprogramacion: 'Fecha Reprogramación',
    observaciones: 'Observaciones',
    ...CONST_SHARED,
    ...PATHS,
    ...PERMISOS
  };
