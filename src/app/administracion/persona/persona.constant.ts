import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_administracion_persona: '/api/administracion/persona/',
  path_administracion_persona_areaUmvId: '/api/administracion/lista/UMV_AREAS/items',
  path_administracion_persona_cargoId: '/api/administracion/lista/UMV_CARGOS/items',
  path_administracion_persona_categoriaPersonaId: '/api/administracion/lista/ADMINISTRACION_PERSONA_CATEGORIA/items',
  path_administracion_persona_estadoPersonaId: '/api/administracion/lista/ADMINISTRACION_PERSONA_ESTADO/items',
  path_administracion_persona_tipoIdentificacionId:
    '/api/administracion/lista/ADMINISTRACION_PERSONA_TIPO_IDENTIFICACION/items',
  path_administracion_persona_tipoRegimenId: '/api/administracion/lista/ADMINISTRACION_PERSONA_TIPO_REGIMEN/items',
  path_administracion_usuario_autocompletar: '/api/usuario/searchAutocomplete',
};


/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_administracion_persona_create: 'ADMINISTRACION_PERSONA_CREATE',
  permiso_administracion_persona_update: 'ADMINISTRACION_PERSONA_UPDATE',
  permiso_administracion_persona_delete: 'ADMINISTRACION_PERSONA_DELETE',
  permiso_administracion_persona_view: 'ADMINISTRACION_PERSONA_VIEW',
  permiso_administracion_persona_list: 'ADMINISTRACION_PERSONA_LIST',
  permiso_administracion_persona_export: 'ADMINISTRACION_PERSONA_EXPORT',
};


/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_ADMINISTRACION_PERSONA = {
  activo: 'Activo',
  estado: 'Estado',
  apellido: 'Apellido',
  apellidos: 'Apellidos',
  areaUmvId: 'Área',
  cargoId: 'Cargo',
  categoriaPersonaId: 'Categoría Persona',
  correo: 'Correo electrónico',
  estadoPersonaId: 'Estado Persona',
  horaFinProgramacion: 'Hora Fin Programación',
  horaInicioProgramacion: 'Hora Inicio Programación',
  id: 'Id',
  identificacion: 'Identificación',
  nombres: 'Nombres',
  personaNovedades: 'Persona Novedades',
  telefono: 'Teléfono',
  tipoIdentificacionId: 'Tipo Identificación',
  tipoRegimenId: 'Tipo Régimen',
  fechaDesde: 'Fecha Desde',
  fechaHasta: 'Fecha Hasta',
  observaciones: 'Observaciones',
  personaId: 'Persona',
  usuario: 'Usuario',
  tipoNovedadPersonaId: 'Tipo Novedad Persona',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS
};
