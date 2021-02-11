import { CONST_SHARED } from '../../../../shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_INVENTARIO_REGISTRO_AMBIENTAL = {
  civ: 'Civ',
  barrio: 'Barrio',
  localidad: 'Localidad',
  pk: 'Pk',
  tipoIntervencion: 'Tipo intervención',
  upla: 'Upz',
  fecha: 'Fecha',
  zona: 'Zona',
  individuosArboreos: 'Individuos arbóreos',
  sumideros: 'Sumideros',
  espacioPublico: 'Espacio publico',
  banios: 'Baños',
  observaciones: 'Observaciones',
  AmbElemento: 'Elemento',
  fechaRegistroInventario: 'Fecha registro inventario',
  codigoArbol: 'Código árbol',
  nombreEspecie: 'Nombre especie',
  idEspecie: 'ID especie',
  objetoId: 'Object ID',
  estadoRedSumideroDominio: 'Estado Red',
  tipo: 'Tipo',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
