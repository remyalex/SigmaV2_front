import { CONST_SHARED } from '../../shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
  path_lista_items_tipo_material: '/api/administracion/lista/TIPO_MATERIAL/items',
  path_lista_items_clase_material: '/api/administracion/lista/getClaseMaterialesByTipo/{tipomaterialId}',
  path_lista_items_clima_maniana: '/api/administracion/lista/UMV_CUADRILLA_INT_CLIMA_MANIANA/items',
  path_lista_items_clima_tarde: '/api/administracion/lista/UMV_CUADRILLA_INT_CLIMA_TARDE/items',
  path_lista_items_clima_noche: '/api/administracion/lista/UMV_CUADRILLA_INT_CLIMA_NOCHE/items',
  path_lista_items_vigilancia: '/api/administracion/lista/UMV_CUADRILLA_INT_VIGILANCIA/items',
  path_lista_items_vigilancia_horas: '/api/administracion/lista/UMV_CUADRILLA_INT_VIGILANCIA_HORAS/items',
  path_lista_items_estadoObra: '/api/administracion/lista/UMV_CUADRILLA_INT_ESTADO_OBRA/items',
  path_lista_items_registroDiarioCuadrilla: '/api/administracion/lista/UMV_CUADRILLA_INT_REGISTRO_DIARIO_CUADRILLA/items',
  path_administracion_persona: '/api/administracion/persona/searchAutocomplete/identificacion',
  path_workflow_diagnostico_encabezado_programa: '/api/administracion/lista/TAB_MANTENIMIENTO_VIAL_ID_TIPO_PROGRAMA/items',
  origenMezclaUrl: '/api/administracion/lista/PRODUCCION_ORIGEN_MEZCLA/items',
  equipoUrl: '/api/administracion/lista/ADMINISTRACION_EQUIPO_TIPO_EQUIPO/items',
  path_lista_items_unidad: '/api/administracion/lista/UMV_CUADRILLA_INT_MAQUINARIA_UNIDAD/items',
  path_lista_items_destino: '/api/administracion/lista/UMV_CUADRILLA_INT_RETIRO_DESTINO/items',
  path_lista_items_ensayo: '/api/administracion/lista/UMV_CUADRILLA_INT_CALIDAD_ENSAYO/items',
  path_lista_items_clase_material_all: '/api/administracion/lista/CLASE_MATERIAL/items'
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
  registro_diario_cuadrilla_list_trabajar: 'REGISTRO_DIARIO_CUADRILLA_LIST_TRABAJAR',
  registro_diario_cuadrilla_list_consultar: 'REGISTRO_DIARIO_CUADRILLA_LIST_CONSULTAR',
  registro_diario_cuadrilla_resumen_crear: 'REGISTRO_DIARIO_CUADRILLA_RESUMEN_CREAR',
  registro_diario_cuadrilla_resumen_aprobar: 'REGISTRO_DIARIO_CUADRILLA_RESUMEN_APROBAR',
  registro_diario_cuadrilla_resumen_editar: 'REGISTRO_DIARIO_CUADRILLA_RESUMEN_EDITAR',
  registro_diario_cuadrilla_general: 'REGISTRO_DIARIO_CUADRILLA_GENERAL',
  registro_diario_cuadrilla_obra: 'REGISTRO_DIARIO_CUADRILLA_OBRA',
  registro_diario_cuadrilla_personal_nuevo: 'REGISTRO_DIARIO_CUADRILLA_PERSONAL_NUEVO',
  registro_diario_cuadrilla_personal_editar: 'REGISTRO_DIARIO_CUADRILLA_PERSONAL_EDITAR',
  registro_diario_cuadrilla_personal_delete: 'REGISTRO_DIARIO_CUADRILLA_PERSONAL_DELETE',
  registro_diario_cuadrilla_personal_save_seccion: 'REGISTRO_DIARIO_CUADRILLA_PERSONAL_SAVE_SECCION',
  registro_diario_cuadrilla_material_nuevo: 'REGISTRO_DIARIO_CUADRILLA_MATERIAL_NUEVO',
  registro_diario_cuadrilla_material_editar: 'REGISTRO_DIARIO_CUADRILLA_MATERIAL_EDITAR',
  registro_diario_cuadrilla_material_delete: 'REGISTRO_DIARIO_CUADRILLA_MATERIAL_DELETE',
  registro_diario_cuadrilla_material_save_seccion: 'REGISTRO_DIARIO_CUADRILLA_MATERIAL_SAVE_SECCION',
  registro_diario_cuadrilla_petreos_nuevo: 'REGISTRO_DIARIO_CUADRILLA_PETREOS_NUEVO',
  registro_diario_cuadrilla_petreos_editar: 'REGISTRO_DIARIO_CUADRILLA_PETREOS_EDITAR',
  registro_diario_cuadrilla_petreos_delete: 'REGISTRO_DIARIO_CUADRILLA_PETREOS_DELETE',
  registro_diario_cuadrilla_petreos_save_seccion: 'REGISTRO_DIARIO_CUADRILLA_PETREOS_SAVE_SECCION',
  registro_diario_cuadrilla_maquinaria_nuevo: 'REGISTRO_DIARIO_CUADRILLA_MAQUINARIA_NUEVO',
  registro_diario_cuadrilla_maquinaria_editar: 'REGISTRO_DIARIO_CUADRILLA_MAQUINARIA_EDITAR',
  registro_diario_cuadrilla_maquinaria_delete: 'REGISTRO_DIARIO_CUADRILLA_MAQUINARIA_DELETE',
  registro_diario_cuadrilla_maquinaria_save_seccion: 'REGISTRO_DIARIO_CUADRILLA_MAQUINARIA_SAVE_SECCION',
  registro_diario_cuadrilla_retiro_nuevo: 'REGISTRO_DIARIO_CUADRILLA_RETIRO_NUEVO',
  registro_diario_cuadrilla_retiro_editar: 'REGISTRO_DIARIO_CUADRILLA_RETIRO_EDITAR',
  registro_diario_cuadrilla_retiro_delete: 'REGISTRO_DIARIO_CUADRILLA_RETIRO_DELETE',
  registro_diario_cuadrilla_retiro_save_seccion: 'REGISTRO_DIARIO_CUADRILLA_RETIRO_SAVE_SECCION',
  registro_diario_cuadrilla_calidad_nuevo: 'REGISTRO_DIARIO_CUADRILLA_CALIDAD_NUEVO',
  registro_diario_cuadrilla_calidad_editar: 'REGISTRO_DIARIO_CUADRILLA_CALIDAD_EDITAR',
  registro_diario_cuadrilla_calidad_delete: 'REGISTRO_DIARIO_CUADRILLA_CALIDAD_DELETE',
  registro_diario_cuadrilla_calidad_save_seccion: 'REGISTRO_DIARIO_CUADRILLA_CALIDAD_SAVE_SECCION',
  registro_diario_cuadrilla_observaciones_nuevo: 'REGISTRO_DIARIO_CUADRILLA_OBSERVACIONES_NUEVO',
  registro_diario_cuadrilla_observaciones_editar: 'REGISTRO_DIARIO_CUADRILLA_OBSERVACIONES_EDITAR',
  registro_diario_cuadrilla_observaciones_delete: 'REGISTRO_DIARIO_CUADRILLA_OBSERVACIONES_DELETE',
  registro_diario_cuadrilla_observaciones_save_seccion: 'REGISTRO_DIARIO_CUADRILLA_OBSERVACIONES_SAVE_SECCION',
  registro_diario_cuadrilla_aprobacion: 'REGISTRO_DIARIO_CUADRILLA_APROBACION'
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_REGISTRO_DIARIO_CUADRILLA = {
  areaTotal: 'Area Total',
  longitudTotal: 'Longitud Total',
  civ: 'CIV',
  barrio: 'Barrio',
  localidad: 'Localidad',
  pk: 'PK',
  tipoIntervencion: 'Tipo intervención',
  upz: 'UPZ',
  fecha: 'Fecha',
  zona: 'Zona',
  individuosArboreos: 'Individuos arboreos',
  sumideros: 'Sumideros',
  espacioPublico: 'Espacio publico',
  banios: 'Baños',
  observaciones: 'Observaciones',
  AmbElemento: 'Elemento',
  fechaRegistroInventario: 'Fecha registro inventario',
  codigoArbol: 'Código arbol',
  nombreEspecie: 'Nombre especie',
  idEspecie: 'ID especie',
  objetoId: 'Object ID',
  claseSumidero: 'Clase sumidero',
  tipo: 'Tipo',
  nuevo: 'Nuevo',
  ejeVial: 'Eje vial',
  ejeVialDesde: 'Eje vial(Desde)',
  ejeVialHasta: 'Eje vial(Hasta)',
  logitudCiv: 'Longitud CIV(M)',
  anchoCiv: 'Ancho CIV(M)',
  areaCiv: 'Área CIV(M2)',
  ProgramaIntervencion: 'Progama de intervención',
  areaIntervencion: 'Área total intervenida',
  longitudTotalIntervenida: 'Longitud total intervenida(ML)',
  climaManiana: 'Clima|Mañana',
  climaTarde: 'Clima|Tarde',
  climaNoche: 'Clima|Noche',
  tipoPmt: 'Tipo de PMT',
  coi: 'COI N°',
  fechaDesde: 'Fecha desde',
  fechaHasta: 'Fecha hasta',
  serviceVigilancia: 'Servicio de vigilancia',
  serviceVigilanciaHoras: 'Servicio de vigilancia horas',
  fechaCreacionInforme: 'Fecha creación del informe',
  fechaInforme: 'Fecha de informe',
  jornada: 'Jornada',
  noInforme: 'N° del informe',
  avanceDiarioObra: 'Avance porcentaje diario de obra',
  avanceAcumuladObra: 'Avance porcentaje acumulado de obra',
  estadoObra: 'Estado de la obra',
  registroDiarioCuadrilla: 'Estado registro diario de cuadrilla',
  fotoTerminacionObra: 'Foto termincacion obra',
  avanceDiarioErrorMsj: 'El porcentaje de avance debe estar entre 0 y 100%',
  rangoTemperatura: 'La temperatura debe estar entre el rango de 100 a 200.',
  numeroIdentificacion: 'Número de identificación / unidad ejecutora',
  nombreApellidos: 'Nombre y apellidos',
  horarioLlegada: 'Horario llegada',
  horarioSalida: 'Horario salida',
  porcentajeJornada: 'Porcentaje jornada',
  personalCantidadRegistrosErrorMsj: 'Máximo de registros permitidos (5)',
  duplicidadPersonalErrorMsj: 'Registro duplicado de unidad ejecutora',
  claseMaterial: 'Clase de material',
  origenMezcla: 'Origen mezcla',
  noVale: 'No. de vale',
  placa: 'Placa',
  cantidad: 'Cantidad',
  horaEntrada: 'Hora entrada',
  horaInstalacion: 'Hora instalación',
  temperaturaRecibo: 'Temperatura recibo',
  temperaturaLlegada: 'Temperatura llegada',
  temperaturaExtendido: 'Temperatura extendido',
  temperaturaCompactacion: 'Temperatura compactación',
  archivoId: 'Nombre del documento',
  nombreDocumento: 'Visualizar',
  valeEntrada: 'Vale entrada',
  valeSalida: 'Vale salida',
  volumenEntrada: 'Volumen entrada(M3)',
  volumenSalida: 'Volumen salida(M3)',
  volumenUtilizado: 'Volumen utilizado',
  volumenAcopio: 'Volumen acopio',
  destino: 'Destino',
  movil: 'Movil',
  origen: 'Origen',
  unidad: 'Unidad',
  dia: 'Día',
  horometroInicial: 'Horometro inicial',
  horometroFinal: 'Horometro final',
  horasTrabajadas: 'Horas trabajadas',
  standBy: 'StandBy',
  numeroViaje: 'Número viaje',
  tipoMaquinaria: 'Tipo maquinaria',
  tipoMaterial: 'Tipo material',
  volumen: 'Volumen(M3)',
  posicion: 'Posicion',
  porcentajeAcumuladoObra: 'Porcentaje acumulado obra',
  numeroMuestras: 'Número de muestras tomadas',
  tipoEnsayo: 'Tipo ensayo',
  resultado: 'Resultado',
  directorObra: 'Director de obra',
  apruebaTrabajoDiarioCuadrilla: '¿Aprueba registro diario de trabajo diario de cuadrilla?',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_REGISTRO_DIARIO_CUADRILLA_ESTADO_PETICION = {
  iniciando: 'INICIANDO CASO DE USO',
  enviando: 'ENVIANDO PETICIÓN',
  ok: 'PETICIÓN EXITOSA',
  error: 'ERROR',
  ...CONST_SHARED,
  ...PATHS,
  ...PERMISOS,
};
