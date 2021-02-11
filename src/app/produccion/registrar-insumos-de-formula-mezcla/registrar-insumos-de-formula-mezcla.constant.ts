import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_formula_mezcla_tipo_mezcla:
    '/api/administracion/lista/TIPO_MEZCLA/items',
  path_formula_mezcla_especificacion:
    '/api/administracion/lista/FORMULA_MEZCLA_ESPECIFICACION/items',
    path_formula_mezcla_materia_prima:
    '/api/administracion/lista/FORMULA_MEZCLA_MATERIA_PRIMA/items',
    path_formula_mezcla_unidad_medida:
    '/api/administracion/lista/FORMULA_MEZCLA_UNIDAD_MEDIDA/items',
    path_produccion_formula_save:
    '/api/produccion/formula',
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
export const CONST_PRODUCCION_INSUMOS_FORMULA_MEZCLA = {
  tituloEditar: 'Registro de materias primas',
  tituloConsultar: 'Consulta de materias primas',
  tipoMezcla: 'Tipo mezcla',
  especificacion: 'Especificación',
  fechaInicial: 'Fecha inicial',
  fechaFinal: 'Fecha final',
  masaUnitaria: 'Masa unitaria',
  materiaPrima: 'Materia prima',
  formulaId: 'Id',
  consecutivo: 'Id',
  formulaMateriaPrimaId: 'Id',
  valor: 'Valor',
  unidadMedida: 'Unidad',
  errorFormatoNumero: 'Solo se permiten valores numéricos.',
  errorValorMinimo: 'El valor mínimo permitido es 0.',
  errorValorMaximo: 'El valor máximo permitido es 100.',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
