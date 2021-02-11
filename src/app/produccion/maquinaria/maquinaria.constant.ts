import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_produccion_maquinaria: '/api/administracion/equipo',
  path_produccion_maquinaria_list: '/api/administracion/equipo/listarMaquinaria',
  path_administracion_tipoMaquinaria: '/api/administracion/lista/ADMINISTRACION_EQUIPO_TIPO_EQUIPO/items',
  path_administracion_lineaMaquinaria: '/api/administracion/lista/PRODUCCION_MAQUINARIA_LINEA/items',
  path_administracion_claseEquipo: '/api/administracion/lista/PRODUCCION_MAQUINARIA_TIPO/items',
  path_administracion_marcaEquipo: '/api/administracion/lista/ADMINISTRACION_EQUIPO_MARCA_EQUIPO/items',
  path_administracion_estadoEquipo: '/api/administracion/lista/ADMINISTRACION_EQUIPO_ESTADO_EQUIPO/items',
  path_administracion_estadoEquipo_activo: '/api/administracion/lista/ADMINISTRACION_EQUIPO_ESTADO_EQUIPO/ACTIVO',
  path_administracion_talleres: '/api/administracion/lista/UMV_TALLERES/items',
  path_administracion_equipo_lugarUmvId: '/api/administracion/lugar/',
  path_administracion_equipo_origenEquipo: '/api/administracion/lista/ADMINISTRACION_EQUIPO_ORIGEN_EQUIPO/items',
  path_administracion_equipo_origenEquipo_alquilado: '/api/administracion/lista/ADMINISTRACION_EQUIPO_ORIGEN_EQUIPO/ALQUILADO',
  path_administracion_equipo_anioModeloId: '/api/administracion/lista/ADMINISTRACION_EQUIPO_ANIO_MODELO/items',
  path_administracion_tipomantenimiento: '/api/administracion/lista/TIPO_MANTENIMIENTO_MAQUINARIA/items'
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  permiso_produccion_maquinaria_create: 'PRODUCCION_CREAR_MAQUINARIA_CREATE',
  permiso_produccion_maquinaria_update: 'PRODUCCION_CREAR_MAQUINARIA_EDIT',
  permiso_produccion_maquinaria_delete: 'PRODUCCION_CREAR_MAQUINARIA_DELETE',
  permiso_produccion_maquinaria_view: 'PRODUCCION_CREAR_MAQUINARIA_VIEW',
  permiso_produccion_maquinaria_list: 'PRODUCCION_CREAR_MAQUINARIA_LIST',
  permiso_produccion_maquinaria_export: 'PRODUCCION_CREAR_MAQUINARIA_EXPORT',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_PRODUCCION_MAQUINARIA = {
  crearNuevo: 'Crear maquinaria o equipo alquilado',
  marca: 'Marca',
  estado: 'Estado',
  lugar: 'Lugar',
  color: 'Color',
  tipoMaquinaria: 'Tipo',
  tipoMantenimiento: 'Tipo de mantenimiento',
  numero: 'No. Interno Contratado',
  movil: 'Móvil',
  claseEquipo: "Clasificación",
  placaInventario: "Placa - No. Inventario",
  origenEquipo: 'Origen',
  numeroContrato: 'No. Contrato',
  contratista: 'Contratista',
  linea: 'Línea',
  modelo: 'Año Modelo',
  programar_mantenimiento: 'Programación del mantenimiento',
  fechaInicio: 'Fecha de inicio',
  taller: 'Taller',
  corregirInformacion: 'Corregir Información',
  placaInventarioExistsError: 'Ya existe esta placa',
  tipoEquipoId: 'Tipo Equipo',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
