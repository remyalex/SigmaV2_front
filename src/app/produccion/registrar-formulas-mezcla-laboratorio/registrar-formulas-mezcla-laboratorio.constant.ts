import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_lista_tipo_mezcla: '/api/administracion/lista/TIPO_MEZCLA/items',
  path_lista_especificacion: '/api/administracion/lista/FORMULA_MEZCLA_ESPECIFICACION/items',
  path_produccion_registrar_formulas: '/api/produccion/formula',

};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_produccion_registrar_formulas_create: 'PRODUCCION_REGISTRAR_FORMULAS_CREATE',
  permiso_produccion_registrar_formulas_update: 'PRODUCCION_REGISTRAR_FORMULAS_UPDATE',
  permiso_produccion_registrar_formulas_delete: 'PRODUCCION_REGISTRAR_FORMULAS_DELETE',
  permiso_produccion_registrar_formulas_view: 'PRODUCCION_REGISTRAR_FORMULAS_VIEW',
  permiso_produccion_registrar_formulas_list: 'PRODUCCION_REGISTRAR_FORMULAS_LIST'
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_PRODUCCION_REGISTRAR_FORMULAS_MEZCLAS = {
  consultarFormula: 'Registrar formulas mezcla laboratorio',
  id: 'Id',
  tipoMezcla: 'Tipo Mezcla',
  especificacion: 'Especificacón',
  masaUnitaria: 'Masa Unitaria',
  fechaInicial: 'Fecha Inicial',
  fechaFinal: 'Fecha Final',
  soporte: 'Soporte',
  registrarInsumo: 'Registrar Insumo',
  consultar: 'Consultar',
  existeFormulaVigente: 'Existe una formula vigente para el tipo de mezcla seleccionado',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS
};
