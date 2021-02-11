/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_VISOR_MAPA = {
  errorEncountered: 'Error encountered',
  requestOK: 'Request OK',
  mapa: {
    zoom: 16,
    center: [-74.1014, 4.6455]
  },
  puntoInicial: 'Punto Inicial',
  puntoFinal: 'Punto Final',
  titulos: {
    ruteo: {
      titulo_layer: 'Ruta',
      boton_calcular_ruta: 'Calcular ruta'
    }
  },
  calculos: {
    velocidad_promedio_para_ruteo: 24
  },
  popup_template: {
    title: 'Información PK',
    actions: [],
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'PK_ID_CALZADA', label: 'Elemento PK', visible: true },
        { fieldName: 'CIV', label: 'CIV', visible: true },
        { fieldName: 'DESCRIPCION_ELEMENTO', label: 'Elemento', visible: true },
        { fieldName: 'ANCHOCALZADA', label: 'Ancho Calzada', visible: true, format: { digitSeparator: true, places: 2 } },
        { fieldName: 'AREACALZADA', label: 'Area Calzada', visible: true, format: { digitSeparator: true, places: 2 } },
        { fieldName: 'LONGITUDHORIZONTAL', label: 'Longitud', visible: true, format: { digitSeparator: true, places: 0 } },
        { fieldName: 'ESTADO_MANTENIMIENTO', label: 'Estado Mantenimiento', visible: true, },
        { fieldName: 'ACTIVIDAD_MANTENIMIENTO', label: 'Actividad Mantenimiento', visible: true, },
        { fieldName: 'RESPONSABLE_MANTENIMIENTO', label: 'Responsable Mantenimiento', visible: true, },
        { fieldName: 'NOMBRE_DIRECTOR_OBRA', label: 'Director de Obra', visible: true, },
        { fieldName: 'DESCRIPCION_TIPO_SUPERFICIE', label: 'Tipo de Superficie', visible: true, },
        { fieldName: 'NOM_LOCALIDAD', label: 'Localidad', visible: true, },
        { fieldName: 'NOM_SECTOR', label: 'Barrio', visible: true, },
        { fieldName: 'NOM_UPL', label: 'Upz', visible: true, },
        { fieldName: 'NOM_ZONA', label: 'Zona', visible: true, },
        { fieldName: 'NOM_CUADRANTE', label: 'Cuadrante', visible: true, },
        { fieldName: 'SECCION_VIAL', label: 'Sección vial', visible: true, },
        { fieldName: 'EJE_VIAL', label: 'Eje Vial', visible: true },
        { fieldName: 'DESDE', label: 'Desde', visible: true },
        { fieldName: 'HASTA', label: 'Hasta', visible: true },
        { fieldName: 'ACTIVIDAD', label: 'Actividad', visible: true, },
        { fieldName: 'ACTIVIDAD_AGRUPADA', label: 'Actividad Agrupada', visible: true, },
        { fieldName: 'DESCRIPCION_ORIGEN', label: 'Origen', visible: true, },
        { fieldName: 'TIPO_USO_VIA', label: 'Uso de la Vía', visible: true, },
        { fieldName: 'NUMERO_RADICADO_ENTRADA', label: 'Radicado de Entrada de Solicitud', visible: true, },
        { fieldName: 'SOLICITUD_RADICADO_SALIDA', label: 'Radicado de Salida de Solicitud', visible: true, },
        { fieldName: 'RADICADO_INTERVENCION', label: 'Radicado de Intervención', visible: true, },
        { fieldName: 'RADICADO_SOLICITUD_RESERVA', label: 'Radicado de Solicitud de Reseva', visible: true, },
        { fieldName: 'RADICADO_RESPUESTA_RESERVA', label: 'Radicado de Respuesta de Reseva', visible: true, },
        { fieldName: 'RADICADO_PMT', label: 'Radicado PMT', visible: true, },
        { fieldName: 'NOMBRE_RESPONSABLE_VISITA', label: 'Responsable Visita', visible: true },
        { fieldName: 'DESCRIPCION_ESTADO_PK', label: 'Estado', visible: true },
        { fieldName: 'TIPOMALLA', label: 'Tipo de Malla', visible: true },
        { fieldName: 'INDICE_PRIORIZACION', label: 'Indice de Priorización', visible: true },
        { fieldName: 'RUTAS_TRANSPORTE', label: 'Rutas de Transporte', visible: true },
        { fieldName: 'FECHA_VISITA_TECNICA', label: 'Fecha de Visita', visible: true, format: { dateFormat: 'short-date' }  },
        { fieldName: 'EN_SEGUIMIENTO', label: 'En Seguimiento', visible: true, },
        { fieldName: 'OBSERVACIONES_DIAGNOSTICO', label: 'Observaciones', visible: true, },
        { fieldName: 'INTERVENCION_TOTAL', label: 'Intervención Total', visible: true, },
        { fieldName: 'PCI', label: 'PCI', visible: true, },
        { fieldName: 'FICHA', label: 'Ficha', visible: true, },
        { fieldName: 'ADJUNTOS', label: 'Adjuntos', visible: true, },
        /// PORCENTAJE_AVANCE_EJECUCION
        { fieldName: 'PORCENTAJE_AVANCE_EJECUCION', label: 'Porcentaje de Avance', visible: true, },
        /// TIPO_PROGRAMA_ID
        { fieldName: 'TIPO_PROGRAMA_ID', label: 'Tipo de Programa', visible: true, }
      ]
    }]
  },
  popup_template_IDULicenExcavacionPredios: {
    title: 'Licencias de Excavación Frente a Predios',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'FECHA_INICIO', label: 'Fecha de Inicio', visible: true },
        { fieldName: 'FECHA_TERMINA', label: 'Fecha de Terminación', visible: true },
        { fieldName: 'CIV', label: 'CIV', visible: true },
        { fieldName: 'N_LICENCIA', label: 'Licencia', visible: true },
        { fieldName: 'CONCEPTO_IDU_DTAI', label: 'Consepto IDU (DTAI)', visible: true },
        { fieldName: 'ESPECIFICACION_IDU_DTAI', label: 'Especificación', visible: true, },
        { fieldName: 'CONTRATO', label: 'Contrato', visible: true, },
        { fieldName: 'ESTADO', label: 'Estado', visible: true, },
      ]
    }]
  },
  popup_template_IDULicenExcavacionTramos: {
    title: 'Licencias de Excavación por Tramos',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'FECHA_INICIO', label: 'Fecha de Inicio', visible: true },
        { fieldName: 'FECHA_TERMINA', label: 'Fecha de Terminación', visible: true },
        { fieldName: 'CIV', label: 'CIV', visible: true },
        { fieldName: 'N_LICENCIA', label: 'Licencia', visible: true },
        { fieldName: 'CONCEPTO_IDU_DTAI', label: 'Consepto IDU (DTAI)', visible: true },
        { fieldName: 'ESPECIFICACION_IDU_DTAI', label: 'Especificación', visible: true, },
        { fieldName: 'CONTRATO', label: 'Contrato', visible: true, },
        { fieldName: 'ESTADO', label: 'Estado', visible: true, },
      ]
    }]
  },
  popup_template_IDULicenciaExcavacionPG: {
    title: 'Licencias de Excavación PG',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'FECHA_INICIO', label: 'Fecha de Inicio', visible: true },
        { fieldName: 'FECHA_TERMINA', label: 'Fecha de Terminación', visible: true },
        { fieldName: 'CIV', label: 'CIV', visible: true },
        { fieldName: 'N_LICENCIA', label: 'Licencia', visible: true },
        { fieldName: 'CONCEPTO_IDU_DTAI', label: 'Consepto IDU (DTAI)', visible: true },
        { fieldName: 'ESPECIFICACION_IDU_DTAI', label: 'Especificación', visible: true, },
        { fieldName: 'CONTRATO', label: 'Contrato', visible: true, },
        { fieldName: 'ESTADO', label: 'Estado', visible: true, },
      ]
    }]
  },
  popup_template_IDUPolizasContratosArea: {
    title: 'Seguimiento de Pólizas a Contratos en Áreas',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'TIPO_ELEMENTO', label: 'Elemento', visible: true },
        { fieldName: 'VENCIMIENTO', label: 'Vencimiento', visible: true },
        { fieldName: 'CIV', label: 'CIV', visible: true },
        { fieldName: 'N_POLIZA', label: 'Poliza', visible: true },
        { fieldName: 'ESTADO_POLIZA', label: 'Estado Poliza', visible: true },
        { fieldName: 'TIPO_OBRA', label: 'Tipo de Obra', visible: true, },
        { fieldName: 'INGRESPONSABLE', label: 'Ing. Responzable', visible: true, },
        { fieldName: 'COSTADO', label: 'Costado', visible: true},
      ]
    }]
  },
  popup_template_IDUPolizasContratosTramos: {
    title: 'Seguimiento de Pólizas a Contratos por Tramos',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'TIPO_ELEMENTO', label: 'Elemento', visible: true },
        { fieldName: 'VENCIMIENTO', label: 'Vencimiento', visible: true },
        { fieldName: 'CIV', label: 'CIV', visible: true },
        { fieldName: 'N_POLIZA', label: 'Poliza', visible: true },
        { fieldName: 'ESTADO_POLIZA', label: 'Estado Poliza', visible: true },
        { fieldName: 'TIPO_OBRA', label: 'Tipo de Obra', visible: true, },
        { fieldName: 'INGRESPONSABLE', label: 'Ing. Responzable', visible: true, },
      ]
    }]
  },
  popup_template_IDUPolizasUrbanizadoresTramos: {
    title: 'Seguimiento de Pólizas a Urbanizadores por Tramos',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'TIPO_ELEMENTO', label: 'Elemento', visible: true },
        { fieldName: 'VENCIMIENTO', label: 'Vencimiento', visible: true },
        { fieldName: 'CIV', label: 'CIV', visible: true },
        { fieldName: 'N_POLIZA', label: 'Poliza', visible: true },
        { fieldName: 'ESTADO_POLIZA', label: 'Estado Poliza', visible: true },
        { fieldName: 'N_RESOLUCION', label: 'Resolución', visible: true, },
      ]
    }]
  },
  popup_template_IDUReportes: {
    title: 'Reportes SIGIDU',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'PK_ELEMENTO', label: 'Elemento', visible: true },
        { fieldName: 'CONTRATO', label: 'Contrato', visible: true },
        { fieldName: 'CIV', label: 'CIV', visible: true },
        { fieldName: 'UNIDADPLANEAMIENTO', label: 'Unidad de Planeamiento', visible: true },
        { fieldName: 'ESTADO', label: 'Estado', visible: true },
        { fieldName: 'ENTIDAD', label: 'Entidad', visible: true, },
        { fieldName: 'PROGRAMA', label: 'Programa', visible: true, },
        { fieldName: 'FECHAREPORTE', label: 'Fecha de Reporte', visible: true, },
      ]
    }]
  },
  popup_template_PMTObrasInfraestructura: {
    title: 'Comite de Obra de Infraestructura',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'DINI', label: 'Direccion  Inicial', visible: true },
        { fieldName: 'CONT', label: 'Contrato', visible: true },
        { fieldName: 'CID', label: 'CID', visible: true },
        { fieldName: 'OBSE', label: 'Observación', visible: true },
      ]
    }]
  },
  popup_template_PMTObrasServiciosPublicosPunto: {
    title: 'Comite de Obra de Servicios Publicos',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'DINI', label: 'Dirección Inicial', visible: true },
        { fieldName: 'CONT', label: 'Contrato', visible: true },
        { fieldName: 'CID', label: 'CID', visible: true },
        { fieldName: 'OBSE', label: 'Observación', visible: true },
        { fieldName: 'HTRA', label: 'Horario Trabajo', visible: true },
        { fieldName: 'HCIE', label: 'Horario Cierre', visible: true },
      ]
    }]
  },
  popup_template_PMTObrasPublicosTramoVia: {
    title: 'Comite de Obra de Servicios Publicos en Tramo de Via',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'DINI', label: 'Dirección Inicial', visible: true },
        { fieldName: 'CONT', label: 'Contrato', visible: true },
        { fieldName: 'CID', label: 'CID', visible: true },
        { fieldName: 'OBSE', label: 'Observación', visible: true },
        { fieldName: 'HTRA', label: 'Horario Trabajo', visible: true },
        { fieldName: 'HCIE', label: 'Horario Cierre', visible: true },
      ]
    }]
  },
  popup_template_PMTObrasInfraestructuraTramoVia: {
    title: 'Comite de Obra de Infraestructura en Tramo Vial',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'DINI', label: 'Dirección Inicial', visible: true },
        { fieldName: 'CONT', label: 'Contrato', visible: true },
        { fieldName: 'CID', label: 'CID', visible: true },
        { fieldName: 'OBSE', label: 'Observación', visible: true },
        { fieldName: 'HTRA', label: 'Horario Trabajo', visible: true },
        { fieldName: 'HCIE', label: 'Horario Cierre', visible: true },
      ]
    }]
  },
  popup_template_PMTObrasInfraestructuraParques: {
    title: 'Comite de Obra de Infraestructura en Parques',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'DINI', label: 'Dirección Inicial', visible: true },
        { fieldName: 'CONT', label: 'Contrato', visible: true },
        { fieldName: 'CID', label: 'CID', visible: true },
        { fieldName: 'OBSE', label: 'Observación', visible: true },
        { fieldName: 'HTRA', label: 'Horario Trabajo', visible: true },
        { fieldName: 'HCIE', label: 'Horario Cierre', visible: true },
      ]
    }]
  },
  popup_template_PMTEvento: {
    title: 'Comite de Obra de Infraestructura en Parques',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'NEVENTO', label: 'Nombre Evento', visible: true },
        { fieldName: 'ORGEVENT', label: 'Organizador del Evento', visible: true },
        { fieldName: 'FINI', label: 'Fecha Inicio', visible: true },
        { fieldName: 'FFIN', label: 'Fecha Fin', visible: true },
        { fieldName: 'TEVENTO', label: 'Tipo Evento', visible: true },
        { fieldName: 'CID', label: 'CID', visible: true },
        { fieldName: 'CIERRE', label: 'Cierre', visible: true },
        { fieldName: 'HINICIO', label: 'Hora Inicio', visible: true },
        { fieldName: 'HFIN', label: 'Hora Fin', visible: true },
      ]
    }]
  },
  popup_template_PMTDesvio: {
    title: 'Comite de Obra de Infraestructura en Parques',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'CID', label: 'CID', visible: true },
        { fieldName: 'FINI', label: 'Fecha Inicio', visible: true },
        { fieldName: 'FFIN', label: 'Fecha Fin', visible: true },
        { fieldName: 'SDESVIO', label: 'Sentido Vial Desvío', visible: true },
        { fieldName: 'NEVENTO', label: 'Nombre Evento', visible: true },
        { fieldName: 'HINICIO', label: 'Hora Inicio', visible: true },
        { fieldName: 'HFIN', label: 'Hora Fin', visible: true },
      ]
    }]
  },
  popup_template_SITPRutasHabilesZonales: {
    title: 'Rutas habiles Zonales',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'route_id_ruta_zonal', label: 'Ruta ID', visible: true },
        { fieldName: 'route_name_ruta_zonal', label: 'Nombre Ruta', visible: true },
        { fieldName: 'codigo_definitivo_ruta_zonal', label: 'Código Definitivo', visible: true },
        { fieldName: 'denominacion_ruta_zonal', label: 'Denominación', visible: true },
        { fieldName: 'origen_ruta_zonal', label: 'Origen Ruta', visible: true },
        { fieldName: 'destino_ruta_zonal', label: 'Destino Ruta', visible: true },
        { fieldName: 'tipo_ruta_zonal', label: 'Tipo Ruta', visible: true },
        { fieldName: 'longitud_ruta_zonal', label: 'Longitud', visible: true, format: { digitSeparator: true, places: 2 } },
        { fieldName: 'tipo_servicio_ruta_zonal', label: 'Tipo de Servicio', visible: true },
        { fieldName: 'delega_ruta_zonal', label: 'Delega', visible: true },
        { fieldName: 'zona_origen_ruta_zonal', label: 'Zona Origen', visible: true },
        { fieldName: 'zona_destino_ruta_zonal', label: 'Zona Destino', visible: true },
        { fieldName: 'localidad_origen_ruta_zonal', label: 'Localidad Origen', visible: true },
        { fieldName: 'localidad_destino_ruta_zonal', label: 'Localidad Destino', visible: true },
        { fieldName: 'fecha_implementacion_ruta_zonal', label: 'Fecha Implementación', visible: true },
        { fieldName: 'operador_ruta_zonal', label: 'Operador Ruta', visible: true },
      ]
    }]
  },
  popup_template_SITPRutasZonalesProvisional: {
    title: 'Rutas Zonales Provisional',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'route_id_ruta_provisional', label: 'Ruta Provisional ID', visible: true },
        { fieldName: 'route_name_ruta_provisional', label: 'Nombre Ruta Provisional', visible: true },
        { fieldName: 'cod_def_ruta_provisional', label: 'Código Definitivo', visible: true },
        { fieldName: 'distancia_ruta_provisional', label: 'Distancia', visible: true, format: { digitSeparator: true, places: 2 } },
        { fieldName: 'denominacion_ruta_provisional', label: 'Denominación', visible: true },
        { fieldName: 'tipo_ruta_ruta_provisional', label: 'Tipo Ruta', visible: true },
        { fieldName: 'zona_origen_ruta_provisional', label: 'Zona Origen Ruta', visible: true },
        { fieldName: 'zona_destino_ruta_provisional', label: 'Zona Destino Ruta', visible: true },
        { fieldName: 'localidad_origen_ruta_provision', label: 'Localidad Origen', visible: true },
        { fieldName: 'localidad_destino_ruta_provisio', label: 'Localidad Destino', visible: true },
      ]
    }]
  },
  popup_template_CensoArbolado: {
    title: 'Censo Arbolado',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'Codigo_Arbol', label: 'Código Arbol', visible: true },
        { fieldName: 'Con_Especie_ID', label: 'Especie', visible: true },
        { fieldName: 'Nombre_Esp', label: 'Nombre Especie', visible: true },
        { fieldName: 'Altura_Total', label: 'Altura Total', visible: true, format: { digitSeparator: true, places: 2 } },
        { fieldName: 'Tipo_Emplazamiento', label: 'Emplazamiento', visible: true },
        { fieldName: 'Fecha_Actualizacion', label: 'Actualización', visible: true, format: { dateFormat: 'short-date' } },
        { fieldName: 'X', label: 'Coordenada X', visible: true },
        { fieldName: 'Y', label: 'Coordenada Y', visible: true },
      ]
    }]
  },
  popup_template_CensoSumideros: {
    title: 'Censo sumideros alcantarillado',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'COD_SUMIDERO', label: 'Código', visible: true },
        { fieldName: 'SUBTIPO', label: 'Subtipo', visible: true },
        { fieldName: 'DOMTIPOSISTEMA', label: 'Sistema', visible: true },
        { fieldName: 'COTARASANTE', label: 'Cota Rasante', visible: true },
        { fieldName: 'CONTENEDOR_RAIZ', label: 'Contenedor Raíz', visible: true },
        { fieldName: 'DOMMATERIAL', label: 'Materiales', visible: true },
        { fieldName: 'FECHAINSTALACION', label: 'Fecha Instalación', visible: true, format: { dateFormat: 'short-date' } },
        { fieldName: 'DOMESTADOENRED', label: 'Estado Red', visible: true },
        { fieldName: 'DOMCALIDADDATO', label: 'Calidad Dato', visible: true },
        { fieldName: 'FECHACARGUE ', label: 'Fecha Cargue', visible: true, format: { dateFormat: 'short-date' } },
        { fieldName: 'OBSERVACIONES', label: 'Observaciones', visible: true },

      ]
    }]
  },
  popup_template_CensoSumiderosPluvial: {
    title: 'Censo sumideros pluvial',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'COD_SUMIDERO', label: 'Código', visible: true },
        { fieldName: 'SUBTIPO', label: 'Subtipo', visible: true },
        { fieldName: 'DOMTIPOSISTEMA', label: 'Sistema', visible: true },
        { fieldName: 'COTARASANTE', label: 'Cota Rasante', visible: true },
        { fieldName: 'CONTENEDOR_RAIZ', label: 'Contenedor Raíz', visible: true },
        { fieldName: 'DOMMATERIAL', label: 'Materiales', visible: true },
        { fieldName: 'FECHAINSTALACION', label: 'Fecha Instalación', visible: true, format: { dateFormat: 'short-date' } },
        { fieldName: 'DOMESTADOENRED', label: 'Estado Red', visible: true },
        { fieldName: 'DOMCALIDADDATO', label: 'Calidad Dato', visible: true },
        { fieldName: 'FECHACARGUE ', label: 'Fecha Cargue', visible: true, format: { dateFormat: 'short-date' } },
        { fieldName: 'OBSERVACIONES', label: 'Observaciones', visible: true },

      ]
    }]
  },
  popup_template_CensoEP_IDUPompeyano: {
    title: 'Censo Pompeyano',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'PK_ID_POMPEYANO ', label: 'Código Pompeyano', visible: true },
        { fieldName: 'CIV', label: 'CIV', visible: true },
        { fieldName: 'TIPOMATERIALPOMPEYANO ', label: 'Tipo Material', visible: true },
        { fieldName: 'ANCHOPOMPEYANO ', label: 'Ancho', visible: true },
        { fieldName: 'LONGITUDPOMPEYANO ', label: 'Longitud', visible: true },
      ]
    }]
  },
  popup_template_CensoEP_IDUPlazas: {
    title: 'Censo Espacio publico Plazas',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'PK_ID_PLAZA', label: 'Código Plaza', visible: true },
        { fieldName: 'CIV', label: 'CIV', visible: true },
        { fieldName: 'NOMBRE', label: 'Nombre Plaza', visible: true },
        { fieldName: 'ARBORIZACION', label: 'Arborización', visible: true },
        { fieldName: 'CONTENEDOR_RAIZ', label: 'Contenedor Raíz', visible: true },
        { fieldName: 'RAMPAS', label: 'Rampas', visible: true },
        { fieldName: 'FECHAREGISTRO', label: 'Fecha Registro', visible: true, format: { dateFormat: 'short-date' } },
        { fieldName: 'AREAPLAZA ', label: 'Area', visible: true, format: { digitSeparator: true, places: 2 } },
        { fieldName: 'HOMOGENEIDAD', label: 'Homogeniedad', visible: true },
      ]
    }]
  },
  popup_template_Zona: {
    title: 'Zona',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'LOCCODIGO', label: 'Código' },
        { fieldName: 'LOCNOMBRE', label: 'Nombre' }
      ]
    }]
  },
  popup_template_Zona1: {
    title: 'Zona',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'COD_ZONA', label: 'Código' }
      ]
    }]
  },
  popup_template_UPLA: {
    title: 'UPZ',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'codigo_upz', label: 'Código' },
        { fieldName: 'nombre', label: 'Nombre' },
        { fieldName: 'decreto', label: 'Decreto' }
      ]
    }]
  },
  popup_template_UPLA2: {
    title: 'UPZ',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'UPLCODIGO', label: 'Código' },
        { fieldName: 'UPLNOMBRE', label: 'Nombre' },
        { fieldName: 'UPLAADMINI', label: 'Decreto' }
      ]
    }]
  },
  popup_template_Localidad: {
    title: 'Localidad',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'LOCCODIGO', label: 'Código' },
        { fieldName: 'LOCNOMBRE', label: 'Nombre', },
        { fieldName: 'LOCAADMINI', label: 'Acto Admin.' },
        { fieldName: 'LOCAREA', label: 'Área', }
      ]
    }]
  },
  popup_template_Barrio: {
    title: 'Barrio',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'SCACODIGO', label: 'Código' },
        { fieldName: 'SCANOMBRE', label: 'Nombre', },
        { fieldName: 'SCATIPO', label: 'Tipo' }
      ]
    }]
  },
  popup_template_Cuadrantes: {
    title: 'Cuadrantes',
    content: [{
      type: 'fields',
      fieldInfos: [
        { fieldName: 'ID', label: 'Id' },
        /// { fieldName: 'CUADRANTE', label: 'Cuadrante', },
        { fieldName: 'PCUNCUADRA', label: 'Cuadrante'}
      ]
    }]
  },
  content_popup_template_Localidad: {
      type: 'fields',
      fieldInfos: [{
        fieldName: 'LOCCODIGO',
        label: 'Código',
      }, {
        fieldName: 'LOCAADMINI',
        label: 'Acto admin.',
      }, {
        fieldName: 'LOCAREA',
        label: 'Área',
      }]
  },
  content_popup_template_Barrio: {
    type: 'fields',
    fieldInfos: [{
      fieldName: 'SCACODIGO',
      label: 'Código',
      visible: true
    }, {
      fieldName: 'SCATIPO',
      label: 'Tipo sector',
      visible: true
    }]
  },
  STYLE_SIG: {
    rendererPk3: {
      type: 'unique-value',  // autocasts as new UniqueValueRenderer()
      field: 'DESCRIPCION_ESTADO_PK',
      defaultLabel: 'Activo para Gestionar',
      legendOptions: {
        title: 'ACTIVO PARA GESTIONAR'
      },
      defaultSymbol: { type: 'simple-fill', color: [20, 20, 20, 255], outline: { color: [20, 20, 20], width: '6px' },
       /* style: 'none' */},
      uniqueValueInfos: [
        {
          value: 'Prediagnostico',
          symbol: { type: 'simple-fill', color: [255, 170, 0, 255], outline: { color: [10, 10, 10], width: '6px' },  },
          label: 'Prediagnostico'
        },
        {
          value: 'Diagnosticado',
          symbol: { type: 'simple-fill', color: [255, 0, 0, 255], outline: { color: [10, 10, 10], width: '6px' },  },
          label: 'Diagnosticado'
        },
        {
          value: 'Seguimiento',
          symbol: { type: 'simple-fill', color: [115, 255, 223, 255], outline: { color: [10, 10, 10], width: '6px' },  },
          label: 'Seguimiento'
        },
        {
          value: 'Reservado',
          symbol: { type: 'simple-fill', color: [255, 235, 175, 255], outline: { color: [10, 10, 10], width: '6px' }, },
          label: 'Reservado'
        },
        {
          value: 'Priorizado',
          symbol: { type: 'simple-fill', color: [122, 142, 245, 255], outline: { color: [10, 10, 10], width: '6px' },  },
          label: 'Priorizado'
        },
        {
          value: 'Viable priorizacion',
          symbol: { type: 'simple-fill', color: [190, 210, 255, 255], outline: { color: [10, 10, 10], width: '6px' },  },
          label: 'Viable priorizacion'
        },
        {
          value: 'Verificado',
          symbol: { type: 'simple-fill', color: [255, 208, 217, 255], outline: { color: [20, 20, 20], width: '6px' }, },
          label: 'Verificado'
        },
        {
          value: 'Por ejecutar',
          symbol: { type: 'simple-fill', color: [10, 107, 111, 255], outline: { color: [10, 10, 10], width: '6px' },  },
          label: 'Por ejecutar'
        },
        {
          value: 'En ejecución',
          symbol: { type: 'simple-fill', color: [168, 112, 0, 255], outline: { color: [10, 10, 10], width: '6px' },  },
          label: 'En ejecución'
        },
        {
          value: 'Terminado (Excluido)',
          symbol: { type: 'simple-fill', color: [209, 255, 115, 255], outline: { color: [10, 10, 10], width: '6px' },  },
          label: 'Terminado (Excluido)'
        },
        {
          value: 'Terminado',
          symbol: { type: 'simple-fill', color: [38, 115, 0, 255], outline: { color: [10, 10, 10], width: '6px' },  },
          label: 'Terminado'
        },
        {
          value: 'Suspendido',
          symbol: { type: 'simple-fill', color: [168, 0, 0, 255], outline: { color: [10, 10, 10], width: '6px' },  },
          label: 'Suspendido'
        },
        {
          value: 'Terminado (No viable)',
          symbol: { type: 'simple-fill', color: [163, 255, 115, 255], outline: { color: [10, 10, 10], width: '6px' },  },
          label: 'Terminado (No viable)'
        },
        {
          value: 'Terminado (Reserva rechazada)',
          symbol: { type: 'simple-fill', color: [233, 255, 190, 255], outline: { color: [10, 10, 10], width: '6px' },  },
          label: 'Terminado (Reserva rechazada)'
        },
        {
          value: 'Terminado (Buen estado)',
          symbol: { type: 'simple-fill', color: [76, 230, 0, 255], outline: { color: [10, 10, 10], width: '6px' },  },
          label: 'Terminado (Buen estado)'
        },
        {
          value: 'Terminado (Vigencia diagnóstico)',
          symbol: { type: 'simple-fill', color: [211, 255, 190, 255], outline: { color: [10, 10, 10], width: '6px' },  },
          label: 'Terminado (Vigencia diagnóstico)'
        },
        {
          value: 'Terminado (Buen estado - seguimiento)',
          symbol: { type: 'simple-fill', color: [85, 255, 0, 255], outline: { color: [10, 10, 10], width: '6px' },  },
          label: 'Terminado (Buen estado - seguimiento)'
        },
        {
          value: 'Terminado (Sin Intervención)',
          symbol: { type: 'simple-fill', color: [56, 168, 0, 255], outline: { color: [10, 10, 10], width: '6px' },  },
          label: 'Terminado (Sin Intervención)'
        },

      ]
    },
    rendererPk2: {
      type: 'unique-value',  // autocasts as new UniqueValueRenderer()
      field: 'DESCRIPCION_ESTADO_PK',
      defaultLabel: 'Activo para Gestionar',
      legendOptions: {
        title: 'ACTIVO PARA GESTIONAR'
      },
      defaultSymbol: { type: 'simple-fill', color: [20, 20, 20, 0.2], outline: { color: [20, 20, 20], width: '2px' },
       /* style: 'none' */},
      uniqueValueInfos: [
        {
          value: 'Prediagnostico',
          symbol: { type: 'simple-fill', color: [255, 170, 0, 255], outline: { color: [10, 10, 10], width: '2px' },  },
          label: 'Prediagnostico'
        },
        {
          value: 'Diagnosticado',
          symbol: { type: 'simple-fill', color: [255, 0, 0, 255], outline: { color: [10, 10, 10], width: '2px' },  },
          label: 'Diagnosticado'
        },
        {
          value: 'Seguimiento',
          symbol: { type: 'simple-fill', color: [115, 255, 223, 255], outline: { color: [10, 10, 10], width: '2px' },  },
          label: 'Seguimiento'
        },
        {
          value: 'Reservado',
          symbol: { type: 'simple-fill', color: [255, 235, 175, 255], outline: { color: [10, 10, 10], width: '2px' }, },
          label: 'Reservado'
        },
        {
          value: 'Priorizado',
          symbol: { type: 'simple-fill', color: [122, 142, 245, 255], outline: { color: [10, 10, 10], width: '2px' },  },
          label: 'Priorizado'
        },
        {
          value: 'Viable priorizacion',
          symbol: { type: 'simple-fill', color: [190, 210, 255, 255], outline: { color: [10, 10, 10], width: '2px' },  },
          label: 'Viable priorizacion'
        },
        {
          value: 'Verificado',
          symbol: { type: 'simple-fill', color: [255, 208, 217, 255], outline: { color: [20, 20, 20], width: '2px' }, },
          label: 'Verificado'
        },
        {
          value: 'Por ejecutar',
          symbol: { type: 'simple-fill', color: [10, 107, 111, 255], outline: { color: [10, 10, 10], width: '2px' },  },
          label: 'Por ejecutar'
        },
        {
          value: 'En ejecución',
          symbol: { type: 'simple-fill', color: [168, 112, 0, 255], outline: { color: [10, 10, 10], width: '2px' },  },
          label: 'En ejecución'
        },
        {
          value: 'Terminado (Excluido)',
          symbol: { type: 'simple-fill', color: [209, 255, 115, 255], outline: { color: [10, 10, 10], width: '2px' },  },
          label: 'Terminado (Excluido)'
        },
        {
          value: 'Terminado',
          symbol: { type: 'simple-fill', color: [38, 115, 0, 255], outline: { color: [10, 10, 10], width: '2px' },  },
          label: 'Terminado'
        },
        {
          value: 'Suspendido',
          symbol: { type: 'simple-fill', color: [168, 0, 0, 255], outline: { color: [10, 10, 10], width: '2px' },  },
          label: 'Suspendido'
        },
        {
          value: 'Terminado (No viable)',
          symbol: { type: 'simple-fill', color: [163, 255, 115, 255], outline: { color: [10, 10, 10], width: '2px' },  },
          label: 'Terminado (No viable)'
        },
        {
          value: 'Terminado (Reserva rechazada)',
          symbol: { type: 'simple-fill', color: [233, 255, 190, 255], outline: { color: [10, 10, 10], width: '2px' },  },
          label: 'Terminado (Reserva rechazada)'
        },
        {
          value: 'Terminado (Buen estado)',
          symbol: { type: 'simple-fill', color: [76, 230, 0, 255], outline: { color: [10, 10, 10], width: '2px' },  },
          label: 'Terminado (Buen estado)'
        },
        {
          value: 'Terminado (Vigencia diagnóstico)',
          symbol: { type: 'simple-fill', color: [211, 255, 190, 255], outline: { color: [10, 10, 10], width: '2px' },  },
          label: 'Terminado (Vigencia diagnóstico)'
        },
        {
          value: 'Terminado (Buen estado - seguimiento)',
          symbol: { type: 'simple-fill', color: [85, 255, 0, 255], outline: { color: [10, 10, 10], width: '2px' },  },
          label: 'Terminado (Buen estado - seguimiento)'
        },
        {
          value: 'Terminado (Sin Intervención)',
          symbol: { type: 'simple-fill', color: [56, 168, 0, 255], outline: { color: [10, 10, 10], width: '2px' },  },
          label: 'Terminado (Sin Intervención)'
        },

      ]
    },
    rendererPk: {
      type: 'unique-value',
      field: 'DESCRIPCION_ESTADO_PK',
      legendOptions: {
        title: 'ESTADO PK'
      },
      defaultSymbol: { type: 'simple-fill', outline: { color: [60, 60, 60], width: '1px' }, color: '#B2B2B2', },
      uniqueValueInfos: [
        {
          value: 'Prediagnostico',
          symbol: { type: 'simple-fill', color: [255, 170, 0, 255] },
          label: 'Prediagnostico'
        },
        {
          value: 'Diagnosticado',
          symbol: { type: 'simple-fill', color: [255, 0, 0, 255] },
          label: 'Diagnosticado'
        },
        {
          value: 'Seguimiento',
          symbol: { type: 'simple-fill', color: [115, 255, 223, 255] },
          label: 'Seguimiento'
        },
        {
          value: 'Reservado',
          symbol: { type: 'simple-fill', color: [255, 235, 175, 255] },
          label: 'Reservado'
        },
        {
          value: 'Priorizado',
          symbol: { type: 'simple-fill', color: [122, 142, 245, 255] },
          label: 'Priorizado'
        },
        {
          value: 'Viable priorizacion',
          symbol: { type: 'simple-fill', color: [190, 210, 255, 255] },
          label: 'Viable priorizacion'
        },
        {
          value: 'Verificado',
          symbol: { type: 'simple-fill', color: [255, 208, 217, 255] },
          label: 'Verificado'
        },
        {
          value: 'Por ejecutar',
          symbol: { type: 'simple-fill', color: [10, 107, 111, 255] },
          label: 'Por ejecutar'
        },
        {
          value: 'En ejecución',
          symbol: { type: 'simple-fill', color: [168, 112, 0, 255] },
          label: 'En ejecución'
        },
        {
          value: 'Terminado (Excluido)',
          symbol: { type: 'simple-fill', color: [209, 255, 115, 255] },
          label: 'Terminado (Excluido)'
        },
        {
          value: 'Terminado',
          symbol: { type: 'simple-fill', color: [38, 115, 0, 255] },
          label: 'Terminado'
        },
        {
          value: 'Suspendido',
          symbol: { type: 'simple-fill', color: [168, 0, 0, 255] },
          label: 'Suspendido'
        },
        {
          value: 'Terminado (No viable)',
          symbol: { type: 'simple-fill', color: [163, 255, 115, 255] },
          label: 'Terminado (No viable)'
        },
        {
          value: 'Terminado (Reserva rechazada)',
          symbol: { type: 'simple-fill', color: [233, 255, 190, 255] },
          label: 'Terminado (Reserva rechazada)'
        },
        {
          value: 'Terminado (Buen estado)',
          symbol: { type: 'simple-fill', color: [76, 230, 0, 255] },
          label: 'Terminado (Buen estado)'
        },
        {
          value: 'Terminado (Vigencia diagnóstico)',
          symbol: { type: 'simple-fill', color: [211, 255, 190, 255] },
          label: 'Terminado (Vigencia diagnóstico)'
        },
        {
          value: 'Terminado (Buen estado - seguimiento)',
          symbol: { type: 'simple-fill', color: [85, 255, 0, 255] },
          label: 'Terminado (Buen estado - seguimiento)'
        },
        {
          value: 'Terminado (Sin Intervención)',
          symbol: { type: 'simple-fill', color: [56, 168, 0, 255] },
          label: 'Terminado (Sin Intervención)'
        },

      ]
    },
    rendererRampaPk: {
      type: 'simple',
      symbol: { type: 'simple-fill', outline: { color: [60, 60, 60], width: '1px' }, color: '#B2B2B2', },
      label: 'Sin Gestión',
      visualVariables: [{
        /// type: 'color', field: 'ESTADO_MANTENIMIENTO_ID',
        type: 'color', field: 'SECCION_VIAL',
        legendOptions: { title: 'Estado PK' },
        stops: [{ value: 1, color: '#FFFF73', label: '1' },
        { value: 2, color: '#FFAA00', label: '2' },
        { value: 5, color: '#FF0000', label: '5' },
        { value: 8, color: '#7E2E74', label: '8' },
        { value: 11, color: '#C1C1C1', label: '11' }, // gris
        { value: 14, color: '#005CE6', label: '14' },
        { value: 17, color: '#42B800', label: '17' },
        { value: 18, color: '#00F391', label: '18' }]
      }]
    },
    rendererBarrio: {
      type: 'simple', // autocasts as new SimpleRenderer()
      symbol: {
        type: 'simple-fill', // autocasts as new SimpleFillSymbol()
        outline: { color: [90, 90, 90], width: '4px' }
      },
      label: 'Barrios',
      visualVariables: [{
        type: 'color', field: 'OBJECTID', legendOptions: { title: 'Barrios' },
        stops: [{ value: 1, color: '#FFFCD4', label: '1' }, { value: 1300, color: '#CB1AF8', label: '1300' },
        { value: 2500, color: '#1FC2A7', label: '2500' }]
      }]
    },
    rendererLocalidad: {
      type: 'simple', //  autocasts as new SimpleRenderer()
      symbol: { type: 'simple-fill', style: 'solid', outline: { color: [0, 70, 70, 1.0], width: '8px' } },
      label: 'Localidad',
      visualVariables: [{
        type: 'color', field: 'OBJECTID', legendOptions: { title: 'Localidad' },
        stops: [{ value: 1, color: '#38627A', label: '1' }, { value: 20, color: '#CB1AF8', label: '20' }]
      }]
    },
    rendererCuadrantes: {
      type: 'simple', //  autocasts as new SimpleRenderer()
      symbol: { type: 'simple-fill', style: 'solid', outline: { color: [30, 30, 30, 1.0], width: '8px' } },
      label: 'Cuadrantes',
      visualVariables: [{
        type: 'color', field: 'OBJECTID', legendOptions: { title: 'Cuadrantes' },
        stops: [{ value: 1, color: '#38627A', label: '1' },
        {value: 25, color: '#A8C912', label: '25' },
        { value: 50, color: '#CB1AF8', label: '50' }]
      }]
    },
    rendererUPLA: {
      type: 'simple', //  autocasts as new SimpleRenderer()
      symbol: { type: 'simple-fill', style: 'solid', outline: { color: [30, 30, 30, 1.0], width: '8px' } },
      label: 'UPZ',
      visualVariables: [{
        type: 'color', field: 'OBJECTID', legendOptions: { title: 'UPZ' },
        stops: [{ value: 1, color: '#00A6EB', label: '1' },
        {value: 25, color: '#E50083', label: '25' },
        { value: 50, color: '#FFED00', label: '50' },
        { value: 75, color: '#009836', label: '75' },
        { value: 100, color: '#E60004', label: '100' },
        { value: 125, color: '#7DB713', label: '125' },
        { value: 150, color: '#940084', label: '150' },
        { value: 175, color: '#765338', label: '175' },
        { value: 200, color: '#EA5B38', label: '200' }]
      }]
    },
    rendererUPLA2: {
      type: 'simple', //  autocasts as new SimpleRenderer()
      symbol: { type: 'simple-fill', style: 'solid', outline: { color: [30, 30, 30, 1.0], width: '8px' } },
      label: 'UPZ',
      visualVariables: [{
        type: 'color', field: 'OBJECTID', legendOptions: { title: 'UPZ' },
        stops: [{ value: 1, color: '#00A6EB', label: '1' },
        {value: 960, color: '#E50083', label: '25' },
        { value: 985, color: '#FFED00', label: '50' },
        { value: 1010, color: '#009836', label: '75' },
        { value: 1035, color: '#E60004', label: '100' },
        { value: 1060, color: '#7DB713', label: '125' },
        { value: 1085, color: '#940084', label: '150' },
        { value: 1110, color: '#765338', label: '175' },
        { value: 1135, color: '#EA5B38', label: '200' }]
      }]
    },
    rendererZona: {
      type: 'simple',
      symbol: { type: 'simple-fill', style: 'solid', outline: { color: [70, 70, 70, 1.0], width: '8px' } },
      label: 'Zona',
      visualVariables: [{
        type: 'color', field: 'OBJECTID', legendOptions: { title: 'Zona' },
        stops: [{ value: 1, color: '#38627A', label: '1' }, { value: 6, color: '#CDA434', label: '6' }]
      }]
    },
    rendererOrigen: {
      type: 'unique-value',
      field: 'DESCRIPCION_ORIGEN',
      legendOptions: {
        title: 'ORIGEN PK'
      },
      defaultSymbol: { type: 'simple-fill' },
      uniqueValueInfos: [
        { value: 'MISIONAL', symbol: { type: 'simple-fill', color: '#967200' } },
        { value: 'OTRO', symbol: { type: 'simple-fill', color: 'red' } },
        { value: 'PETICIONARIO', symbol: { type: 'simple-fill', color: 'blue' } },
        { value: 'SEGUIMIENTO', symbol: { type: 'simple-fill', color: '#2D5E01' } }
      ]
    },
    rendererPompeyano: {
      type: 'simple',
      symbol: { type: 'simple-fill', style: 'solid', color: '#ff6207', outline: { color: [10, 10, 10, 1.0], width: '2px' } },
      label: 'Pompeyano',
    },
    labelClassCuadrantes: {
      symbol: { type: 'text', color: '#4A003D', haloColor: 'white', haloSize: '1px',
      font: {  size: 16, family: 'Josefin Slab', weight: 'bold'}},
      labelExpressionInfo: { expression: '$feature.CUADRANTE' }
    },
    labelUPLA: {
      symbol: { type: 'text', color: '#4A003D', haloColor: 'white', haloSize: '1px',
      font: {  size: 16, family: 'Josefin Slab', weight: 'bold'}},
      labelExpressionInfo: { expression: '$feature.nombre' }
    },
    labelUPLA2: {
      symbol: { type: 'text', color: '#4A003D', haloColor: 'white', haloSize: '1px',
      font: {  size: 16, family: 'Josefin Slab', weight: 'bold'}},
      labelExpressionInfo: { expression: '$feature.UPLNOMBRE' }
    },
    stopStartSymbol: {
      type: 'simple-marker', style: 'cross', size: 15, outline: { color: 'black', width: 4 }
    },
    stopEndSymbol: {
      type: 'simple-marker', style: 'cross', size: 15, outline: { color: 'blue', width: 4 }
    },
    pkPointSymbol: {
      type: 'simple-marker', style: 'square', size: 6, color: 'black', outline: { color: 'black', width: 1 }
    },
    rendererStopFeatureLayer: {
      type: 'unique-value',
      field: 'typeStartEnd',
      uniqueValueInfos: [
        { value: 'Inicio', symbol: { type: 'simple-marker', style: 'cross', size: 15, outline: { color: 'black', width: 4 }} },
        { value: 'Fin', symbol: { type: 'simple-marker', style: 'cross', size: 15, outline: { color: 'blue', width: 4 } } },
      ]
    },
    rendererPkEstrategiaIntervencion: {
      type: 'unique-value',
      field: 'VALOR_TIPO_ESTRATEGIA',
      legendOptions: {
        title: 'TIPO DE ESTRATEGIA'
      },
      defaultSymbol: { type: 'simple-fill', outline: { color: [60, 60, 60, 50], width: '0.5px'}, color: [240, 240, 240, 255] },
      defaultLabel: 'Otros',
      uniqueValueInfos: [
        { value: 1, symbol: {type: 'simple-fill', color: '#DB2C91' }, label:
          'Rehabilitación Vial como Complemento Al Mejoramiento de la Infraestructura de Servicios Públicos'
        },
        {
          value: 2, symbol: {type: 'simple-fill', color: '#1B4E5C' }, label: 'Infraestructura y Gestión del Transito'
        },
        {
          value: 3, symbol: {type: 'simple-fill', color: '#9B53B5' }, label: 'Situaciones Imprevistas y Apoyo Interinstitucional'
        },
        {
          value: 4, symbol: {type: 'simple-fill', color: '#E6003C' }, label: 'Mantenimiento Ciclorutas'
        },
        {
          value: 5, symbol: {type: 'simple-fill', color: '#C47C88' }, label: 'Ruralidad'
        },
        {
          value: 6, symbol: {type: 'simple-fill', color: '#5AA172' }, label: '.'
        },
      ]
    },
    rendererPkActividadAgrupada: {
      type: 'unique-value',
      field: 'ACTIVIDAD_AGRUPADA',
      legendOptions: {
        title: 'ACTIVIDAD AGRUPADA PK'
      },
      defaultSymbol: { type: 'simple-fill', outline: { color: [60, 60, 60, 50], width: '0.4px'}, color: [240, 240, 240, 0] },
      defaultLabel: 'Otros',
      uniqueValueInfos: [
        {
          value: 'SG', symbol: { type: 'simple-fill', color: '#8C2416' }, label: 'SG'
        },
        {
          value: 'LS', symbol: { type: 'simple-fill', color: '#4F250C' }, label: 'LS'
        },
        {
          value: 'SI', symbol: { type: 'simple-fill', color: '#F9C779' }, label: 'SI'
        },
        {
          value: 'SJ', symbol: { type: 'simple-fill', color: '#F7AF2C' }, label: 'SJ'
        },
        {
          value: 'CA', symbol: { type: 'simple-fill', color: '#946815' }, label: 'CA'
        },
        {
          value: 'PABA', symbol: { type: 'simple-fill', color: '#EAE100' }, label: 'PABA'
        },
        {
          value: 'BE', symbol: { type: 'simple-fill', color: '#009836' }, label: 'BE'
        },
        {
          value: 'CC', symbol: { type: 'simple-fill', color: '#009B68' }, label: 'CC'
        },
        {
          value: 'FEM', symbol: { type: 'simple-fill', color: '#00A6EB' }, label: 'FEM'
        },
        {
          value: 'CL', symbol: { type: 'simple-fill', color: '#0C1759' }, label: 'CL'
        },
        {
          value: 'CO', symbol: { type: 'simple-fill', color: '#814597' }, label: 'CO'
        },
        {
          value: 'FE', symbol: { type: 'simple-fill', color: '#5A0E36' }, label: 'FE'
        },
        {
          value: 'GS', symbol: { type: 'simple-fill', color: '#E6003C' }, label: 'GS'
        },
        {
          value: 'RH', symbol: { type: 'simple-fill', color: '#C47C88' }, label: 'RH'
        },
        {
          value: 'SF', symbol: { type: 'simple-fill', color: '#8B0018' }, label: 'SF'
        },
        {
          value: 'IN', symbol: { type: 'simple-fill', color: '#DE0080' }, label: 'IN'
        }
      ]
    },
    /// PORCENTAJE_AVANCE_EJECUCION
    rendererPkAvanceEjecucionIntervencion: {
      type: 'simple',
      symbol: { type: 'simple-fill', style: 'solid', outline: { color: [70, 70, 70, 1.0], width: '2px' } },
      label: 'Avance Ejecución de Intervención',
      visualVariables: [{
        type: 'color', field: 'PORCENTAJE_AVANCE_EJECUCION', legendOptions: { title: 'Avance Ejecución de Intervención' },
        stops: [{ value: 1, color: '#CB3234', label: '1' }, { value: 50, color: '#FF8000', label: '50' },
        { value: 100, color: '#008F39', label: '100' }]
      }]
    },
    /// TIPO_PROGRAMA_ID
    rendererPkTipoPrograma: {
      type: 'unique-value',
      field: 'TIPO_PROGRAMA_ID',
      legendOptions: {
        title: 'Tipo de Programa del PK'
      },
      defaultSymbol: { type: 'simple-fill', outline: { color: [60, 60, 60], width: '1px' }, color: '#B2B2B2', },
      uniqueValueInfos: [
        {value: '583', symbol: { type: 'simple-fill', color: [85, 255, 0, 255] }, label: 'Decreto 064/2015'}
        , {value: '579', symbol: { type: 'simple-fill', color: [255, 170, 0, 255] }, label: 'SIGMA-Alcaldias'}
        , {value: '577', symbol: { type: 'simple-fill', color: [209, 255, 115, 255] }, label: 'RURALIDAD'}
        , {value: '578', symbol: { type: 'simple-fill', color: [115, 255, 223, 255] }, label: 'SIGMA-SDM'}
        , {value: '599', symbol: { type: 'simple-fill', color: [255, 235, 175, 255] }, label: 'IMV-PR-003'}
        , {value: '580', symbol: { type: 'simple-fill', color: [122, 142, 245, 255] }, label: 'Conservacion'}
        , {value: '584', symbol: { type: 'simple-fill', color: [190, 210, 255, 255] }, label: 'Licitación'}
        , {value: '585', symbol: { type: 'simple-fill', color: [255, 208, 217, 255] }, label: 'Misionalidad'}
        , {value: '586', symbol: { type: 'simple-fill', color: [10, 107, 111, 255] },
        label: 'Puntos Críticos-Decreto 064/2015'}
        , {value: '587', symbol: { type: 'simple-fill', color: [168, 112, 0, 255] },
        label: 'Puntos Críticos-Misionalidad'}
        , {value: '588', symbol: { type: 'simple-fill', color: [255, 0, 0, 255] }, label: 'Sello De Fisuras'}
        , {value: '589', symbol: { type: 'simple-fill', color: [38, 115, 0, 255] }, label: 'Sin Estructura'}
        , {value: '590', symbol: { type: 'simple-fill', color: [168, 0, 0, 255] }, label: 'Salvando Vidas'}
        , {value: '591', symbol: { type: 'simple-fill', color: [163, 255, 115, 255] }, label: 'Pica Y Pala'}
        , {value: '592', symbol: { type: 'simple-fill', color: [233, 255, 190, 255] }, label: 'Emergencia'}
        , {value: '593', symbol: { type: 'simple-fill', color: [76, 230, 0, 255]  }, label: 'Acuerdo 257/C'}
        , {value: '594', symbol: { type: 'simple-fill', color: [211, 255, 190, 255] }, label: 'Acuerdo 257/D'}
        , {value: '595', symbol: { type: 'simple-fill', color: [85, 255, 0, 255] },
        label: 'Acuerdo 257/C_D (Accidentalidad)'}
        , {value: '581', symbol: { type: 'simple-fill', color: [56, 168, 0, 255] }, label: 'Cambio De Carpeta'}
        , {value: '582', symbol: { type: 'simple-fill', color: [85, 200, 50, 255] }, label: 'Cambio De Losas'}
      ]
    },
    /// PROGRAMACION_PERIODICA_ID
    rendererPKProgramacionPeriodica: {
      type: 'unique-value',
      valueExpression: '',
      defaultSymbol: { type: 'simple-fill', outline: { color: [60, 60, 60, 50], width: '0.4px'}, color: [240, 240, 240, 0] },
      defaultLabel: 'Otros',
      valueExpressionTitle: 'Pks con Programación Periodica de Intervención',
      uniqueValueInfos: [
        {value: 0, symbol: { type: 'simple-fill', color: '#F3B7BC', outline: {width: '1.5px'}}, label: 'Sin Programación'},
        {value: 1, symbol: { type: 'simple-fill', color: '#C7000A', outline: {width: '1.5px'}}, label: 'Programado'},]
    },
    rendererEjecucionTerminados: {
      type: 'unique-value',
      field: 'VALOR_ESTADO_PK',
      legendOptions: {
        title: 'Estado de Ejecución'
      },
      defaultSymbol: { type: 'simple-fill', outline: { color: [60, 60, 60, 50], width: '0.4px'}, color: [240, 240, 240, 240] },
      defaultLabel: 'Otros',
      uniqueValueInfos: [
        { value: 7, symbol: { type: 'simple-fill', color: '#798FF5' }, label: 'Priorizado'
        },
        { value: 33, symbol: { type: 'simple-fill', color: '#0A6B6F' }, label: 'Por Ejecutar'
        },
        { value: 2, symbol: { type: 'simple-fill', color: '#A87000' }, label: 'En Ejecución'
        },
        { value: 1, symbol: { type: 'simple-fill', color: '#00B333' }, label: 'Terminado'
        }
      ]
    },
    renderJoinEstadoPkActividadAgrupada: {
      type: 'unique-value',
      valueExpression: '',
      defaultSymbol: { type: 'simple-fill', outline: { color: [60, 60, 60, 50], width: '0.4px'}, color: [240, 240, 240, 0] },
      defaultLabel: 'Otros',
      valueExpressionTitle:
        'Estastados y Actividad Agrupada del PK',
        uniqueValueInfos: [
          {value: 'SG Seguimiento', symbol: { type: 'simple-fill', color: '#F3B7BC', outline: {width: '1.5px'}}, label: 'SG Seguimiento'},
          {value: 'LS Seguimiento', symbol: { type: 'simple-fill', color: '#BA757F', outline: {width: '1.5px'}}, label: 'LS Seguimiento'},
          {value: 'SI Seguimiento', symbol: { type: 'simple-fill', color: '#EF97A1', outline: {width: '1.5px'}}, label: 'SI Seguimiento'},
          {value: 'SJ Seguimiento', symbol: { type: 'simple-fill', color: '#B85D6D', outline: {width: '1.5px'}}, label: 'SJ Seguimiento'},
          {value: 'CA Seguimiento', symbol: { type: 'simple-fill', color: '#D96F80', outline: {width: '1.5px'}}, label: 'CA Seguimiento'},
          {value: 'PABA Seguimiento', symbol: { type: 'simple-fill', color: '#D7516D', outline: {width: '1.5px'}}, label: 'PABA Seguimiento'},
          {value: 'BE Seguimiento', symbol: { type: 'simple-fill', color: '#E95975', outline: {width: '1.5px'}}, label: 'BE Seguimiento'},
          {value: 'CC Seguimiento', symbol: { type: 'simple-fill', color: '#E05571', outline: {width: '1.5px'}}, label: 'CC Seguimiento'},
          {value: 'FEM Seguimiento', symbol: { type: 'simple-fill', color: '#B6435C', outline: {width: '1.5px'}}, label: 'FEM Seguimiento'},
          {value: 'CL Seguimiento', symbol: { type: 'simple-fill', color: '#E84458', outline: {width: '1.5px'}}, label: 'CL Seguimiento'},
          {value: 'CO Seguimiento', symbol: { type: 'simple-fill', color: '#D52E5C', outline: {width: '1.5px'}}, label: 'CO Seguimiento'},
          {value: 'FE Seguimiento', symbol: { type: 'simple-fill', color: '#E73363', outline: {width: '1.5px'}}, label: 'FE Seguimiento'},
          {value: 'GS Seguimiento', symbol: { type: 'simple-fill', color: '#CA2B57', outline: {width: '1.5px'}}, label: 'GS Seguimiento'},
          {value: 'RH Seguimiento', symbol: { type: 'simple-fill', color: '#B4244D', outline: {width: '1.5px'}}, label: 'RH Seguimiento'},
          {value: 'SF Seguimiento', symbol: { type: 'simple-fill', color: '#E60042', outline: {width: '1.5px'}}, label: 'SF Seguimiento'},
          {value: 'IN Seguimiento', symbol: { type: 'simple-fill', color: '#9D2437', outline: {width: '1.5px'}}, label: 'IN Seguimiento'},
          {value: 'SG Priorizado', symbol: { type: 'simple-fill', color: '#DC4227', outline: {width: '1.5px'}}, label: 'SG Priorizado'},
          {value: 'LS Priorizado', symbol: { type: 'simple-fill', color: '#CB3D23', outline: {width: '1.5px'}}, label: 'LS Priorizado'},
          {value: 'SI Priorizado', symbol: { type: 'simple-fill', color: '#E26543', outline: {width: '1.5px'}}, label: 'SI Priorizado'},
          {value: 'SJ Priorizado', symbol: { type: 'simple-fill', color: '#D96141', outline: {width: '1.5px'}}, label: 'SJ Priorizado'},
          {value: 'CA Priorizado', symbol: { type: 'simple-fill', color: '#D05D3E', outline: {width: '1.5px'}}, label: 'CA Priorizado'},
          {value: 'PABA Priorizado', symbol: { type: 'simple-fill', color: '#B4674F', outline: {width: '1.5px'}}, label: 'PABA Priorizado'},
          {value: 'BE Priorizado', symbol: { type: 'simple-fill', color: '#E68665', outline: {width: '1.5px'}}, label: 'BE Priorizado'},
          {value: 'CC Priorizado', symbol: { type: 'simple-fill', color: '#DE8162', outline: {width: '1.5px'}}, label: 'CC Priorizado'},
          {value: 'FEM Priorizado', symbol: { type: 'simple-fill', color: '#D47B5E', outline: {width: '1.5px'}}, label: 'FEM Priorizado'},
          {value: 'CL Priorizado', symbol: { type: 'simple-fill', color: '#D0947D', outline: {width: '1.5px'}}, label: 'CL Priorizado'},
          {value: 'CO Priorizado', symbol: { type: 'simple-fill', color: '#EDA98D', outline: {width: '1.5px'}}, label: 'CO Priorizado'},
          {value: 'FE Priorizado', symbol: { type: 'simple-fill', color: '#E4A388', outline: {width: '1.5px'}}, label: 'FE Priorizado'},
          {value: 'GS Priorizado', symbol: { type: 'simple-fill', color: '#D8000B', outline: {width: '1.5px'}}, label: 'GS Priorizado'},
          {value: 'RH Priorizado', symbol: { type: 'simple-fill', color: '#C7000A', outline: {width: '1.5px'}}, label: 'RH Priorizado'},
          {value: 'SF Priorizado', symbol: { type: 'simple-fill', color: '#C35436', outline: {width: '1.5px'}}, label: 'SF Priorizado'},
          {value: 'IN Priorizado', symbol: { type: 'simple-fill', color: '#C98D77', outline: {width: '1.5px'}}, label: 'IN Priorizado'},
          {value: 'SG En ejecución', symbol: { type: 'simple-fill', color: '#ECB38F', outline: {width: '1.5px'}}, label: 'SG En ejecución'},
          {value: 'LS En ejecución', symbol: { type: 'simple-fill', color: '#BF9075', outline: {width: '1.5px'}}, label: 'LS En ejecución'},
          {value: 'SI En ejecución', symbol: { type: 'simple-fill', color: '#F7BD76', outline: {width: '1.5px'}}, label: 'SI En ejecución'},
          {value: 'SJ En ejecución', symbol: { type: 'simple-fill', color: '#F29E6C', outline: {width: '1.5px'}}, label: 'SJ En ejecución'},
          {value: 'CA En ejecución', symbol: { type: 'simple-fill', color: '#BC7A55', outline: {width: '1.5px'}}, label: 'CA En ejecución'},
          {value: 'PABA En ejecución', symbol: { type: 'simple-fill', color: '#EF8249', outline: {width: '1.5px'}}, label: 'PABA En ejecución'},
          {value: 'BE En ejecución', symbol: { type: 'simple-fill', color: '#BA6437', outline: {width: '1.5px'}}, label: 'BE En ejecución'},
          {value: 'CC En ejecución', symbol: { type: 'simple-fill', color: '#9F4229', outline: {width: '1.5px'}}, label: 'CC En ejecución'},
          {value: 'FEM En ejecución', symbol: { type: 'simple-fill', color: '#F2962B', outline: {width: '1.5px'}}, label: 'FEM En ejecución'},
          {value: 'CL En ejecución', symbol: { type: 'simple-fill', color: '#EC6527', outline: {width: '1.5px'}}, label: 'CL En ejecución'},
          {value: 'CO En ejecución', symbol: { type: 'simple-fill', color: '#D95D23', outline: {width: '1.5px'}}, label: 'CO En ejecución'},
          {value: 'FE En ejecución', symbol: { type: 'simple-fill', color: '#E14700', outline: {width: '1.5px'}}, label: 'FE En ejecución'},
          {value: 'GS En ejecución', symbol: { type: 'simple-fill', color: '#B53900', outline: {width: '1.5px'}}, label: 'GS En ejecución'},
          {value: 'RH En ejecución', symbol: { type: 'simple-fill', color: '#E77F00', outline: {width: '1.5px'}}, label: 'RH En ejecución'},
          {value: 'SF En ejecución', symbol: { type: 'simple-fill', color: '#F4D063', outline: {width: '1.5px'}}, label: 'SF En ejecución'},
          {value: 'IN En ejecución', symbol: { type: 'simple-fill', color: '#F4DA92', outline: {width: '1.5px'}}, label: 'IN En ejecución'},
          {value: 'SG Terminado (Excluido)', symbol: { type: 'simple-fill', color: '#C4BA9E', outline: {width: '1.5px'}}, label: 'SG Terminado (Excluido)'},
          {value: 'LS Terminado (Excluido)', symbol: { type: 'simple-fill', color: '#F5E7C1', outline: {width: '1.5px'}}, label: 'LS Terminado (Excluido)'},
          {value: 'SI Terminado (Excluido)', symbol: { type: 'simple-fill', color: '#C4B68B', outline: {width: '1.5px'}}, label: 'SI Terminado (Excluido)'},
          {value: 'SJ Terminado (Excluido)', symbol: { type: 'simple-fill', color: '#F5E2AB', outline: {width: '1.5px'}}, label: 'SJ Terminado (Excluido)'},
          {value: 'CA Terminado (Excluido)', symbol: { type: 'simple-fill', color: '#C5B887', outline: {width: '1.5px'}}, label: 'CA Terminado (Excluido)'},
          {value: 'PABA Terminado (Excluido)', symbol: { type: 'simple-fill', color: '#FFF6AE', outline: {width: '1.5px'}}, label: 'PABA Terminado (Excluido)'},
          {value: 'BE Terminado (Excluido)', symbol: { type: 'simple-fill', color: '#E9D18C', outline: {width: '1.5px'}}, label: 'BE Terminado (Excluido)'},
          {value: 'CC Terminado (Excluido)', symbol: { type: 'simple-fill', color: '#B79F5F', outline: {width: '1.5px'}}, label: 'CC Terminado (Excluido)'},
          {value: 'FEM Terminado (Excluido)', symbol: { type: 'simple-fill', color: '#F6DB72', outline: {width: '1.5px'}}, label: 'FEM Terminado (Excluido)'},
          {value: 'CL Terminado (Excluido)', symbol: { type: 'simple-fill', color: '#B79C4C', outline: {width: '1.5px'}}, label: 'CL Terminado (Excluido)'},
          {value: 'CO Terminado (Excluido)', symbol: { type: 'simple-fill', color: '#E9C75F', outline: {width: '1.5px'}}, label: 'CO Terminado (Excluido)'},
          {value: 'FE Terminado (Excluido)', symbol: { type: 'simple-fill', color: '#DDBD5B', outline: {width: '1.5px'}}, label: 'FE Terminado (Excluido)'},
          {value: 'GS Terminado (Excluido)', symbol: { type: 'simple-fill', color: '#AA9046', outline: {width: '1.5px'}}, label: 'GS Terminado (Excluido)'},
          {value: 'RH Terminado (Excluido)', symbol: { type: 'simple-fill', color: '#FFE05C', outline: {width: '1.5px'}}, label: 'RH Terminado (Excluido)'},
          {value: 'SF Terminado (Excluido)', symbol: { type: 'simple-fill', color: '#E7D82C', outline: {width: '1.5px'}}, label: 'SF Terminado (Excluido)'},
          {value: 'IN Terminado (Excluido)', symbol: { type: 'simple-fill', color: '#AE9D00', outline: {width: '1.5px'}}, label: 'IN Terminado (Excluido)'},
          {value: 'SG Terminado', symbol: { type: 'simple-fill', color: '#C4BA9E', outline: {width: '1.5px'}}, label: 'SG Terminado'},
          {value: 'LS Terminado', symbol: { type: 'simple-fill', color: '#CED099', outline: {width: '1.5px'}}, label: 'LS Terminado'},
          {value: 'SI Terminado', symbol: { type: 'simple-fill', color: '#F5E2AB', outline: {width: '1.5px'}}, label: 'SI Terminado'},
          {value: 'SJ Terminado', symbol: { type: 'simple-fill', color: '#C5B887', outline: {width: '1.5px'}}, label: 'SJ Terminado'},
          {value: 'CA Terminado', symbol: { type: 'simple-fill', color: '#D5E295', outline: {width: '1.5px'}}, label: 'CA Terminado'},
          {value: 'PABA Terminado', symbol: { type: 'simple-fill', color: '#E9D18C', outline: {width: '1.5px'}}, label: 'PABA Terminado'},
          {value: 'BE Terminado', symbol: { type: 'simple-fill', color: '#BDBF72', outline: {width: '1.5px'}}, label: 'BE Terminado'},
          {value: 'CC Terminado', symbol: { type: 'simple-fill', color: '#879150', outline: {width: '1.5px'}}, label: 'CC Terminado'},
          {value: 'FEM Terminado', symbol: { type: 'simple-fill', color: '#B79F5F', outline: {width: '1.5px'}}, label: 'FEM Terminado'},
          {value: 'CL Terminado', symbol: { type: 'simple-fill', color: '#B7C059', outline: {width: '1.5px'}}, label: 'CL Terminado'},
          {value: 'CO Terminado', symbol: { type: 'simple-fill', color: '#D1DC64', outline: {width: '1.5px'}}, label: 'CO Terminado'},
          {value: 'FE Terminado', symbol: { type: 'simple-fill', color: '#AA9046', outline: {width: '1.5px'}}, label: 'FE Terminado'},
          {value: 'GS Terminado', symbol: { type: 'simple-fill', color: '#DDBD5B', outline: {width: '1.5px'}}, label: 'GS Terminado'},
          {value: 'RH Terminado', symbol: { type: 'simple-fill', color: '#BABF34', outline: {width: '1.5px'}}, label: 'RH Terminado'},
          {value: 'SF Terminado', symbol: { type: 'simple-fill', color: '#AE9D00', outline: {width: '1.5px'}}, label: 'SF Terminado'},
          {value: 'IN Terminado', symbol: { type: 'simple-fill', color: '#BDCF00', outline: {width: '1.5px'}}, label: 'IN Terminado'},
          {value: 'SG Terminado (No viable)', symbol: { type: 'simple-fill', color: '#99AF9B', outline: {width: '1.5px'}}, label: 'SG Terminado (No viable)'},
          {value: 'LS Terminado (No viable)', symbol: { type: 'simple-fill', color: '#89A99A', outline: {width: '1.5px'}}, label: 'LS Terminado (No viable)'},
          {value: 'SI Terminado (No viable)', symbol: { type: 'simple-fill', color: '#B7D9AB', outline: {width: '1.5px'}}, label: 'SI Terminado (No viable)'},
          {value: 'SJ Terminado (No viable)', symbol: { type: 'simple-fill', color: '#94BF98', outline: {width: '1.5px'}}, label: 'SJ Terminado (No viable)'},
          {value: 'CA Terminado (No viable)', symbol: { type: 'simple-fill', color: '#91C6AF', outline: {width: '1.5px'}}, label: 'CA Terminado (No viable)'},
          {value: 'PABA Terminado (No viable)', symbol: { type: 'simple-fill', color: '#7EAE83', outline: {width: '1.5px'}}, label: 'PABA Terminado (No viable)'},
          {value: 'BE Terminado (No viable)', symbol: { type: 'simple-fill', color: '#7DBA85', outline: {width: '1.5px'}}, label: 'BE Terminado (No viable)'},
          {value: 'CC Terminado (No viable)', symbol: { type: 'simple-fill', color: '#629779', outline: {width: '1.5px'}}, label: 'CC Terminado (No viable)'},
          {value: 'FEM Terminado (No viable)', symbol: { type: 'simple-fill', color: '#77BB6B', outline: {width: '1.5px'}}, label: 'FEM Terminado (No viable)'},
          {value: 'CL Terminado (No viable)', symbol: { type: 'simple-fill', color: '#5EB38F', outline: {width: '1.5px'}}, label: 'CL Terminado (No viable)'},
          {value: 'CO Terminado (No viable)', symbol: { type: 'simple-fill', color: '#50A564', outline: {width: '1.5px'}}, label: 'CO Terminado (No viable)'},
          {value: 'FE Terminado (No viable)', symbol: { type: 'simple-fill', color: '#52A94C', outline: {width: '1.5px'}}, label: 'FE Terminado (No viable)'},
          {value: 'GS Terminado (No viable)', symbol: { type: 'simple-fill', color: '#3D883C', outline: {width: '1.5px'}}, label: 'GS Terminado (No viable)'},
          {value: 'RH Terminado (No viable)', symbol: { type: 'simple-fill', color: '#009728', outline: {width: '1.5px'}}, label: 'RH Terminado (No viable)'},
          {value: 'SF Terminado (No viable)', symbol: { type: 'simple-fill', color: '#00761D', outline: {width: '1.5px'}}, label: 'SF Terminado (No viable)'},
          {value: 'IN Terminado (No viable)', symbol: { type: 'simple-fill', color: '#009454', outline: {width: '1.5px'}}, label: 'IN Terminado (No viable)'},
          {value: 'SG Terminado (Reserva rechazada)', symbol: { type: 'simple-fill', color: '#E6EFED', outline: {width: '1.5px'}}, label: 'SG Terminado (Reserva rechazada)'},
          {value: 'LS Terminado (Reserva rechazada)', symbol: { type: 'simple-fill', color: '#B7D9CE', outline: {width: '1.5px'}}, label: 'LS Terminado (Reserva rechazada)'},
          {value: 'SI Terminado (Reserva rechazada)', symbol: { type: 'simple-fill', color: '#A1D0C9', outline: {width: '1.5px'}}, label: 'SI Terminado (Reserva rechazada)'},
          {value: 'SJ Terminado (Reserva rechazada)', symbol: { type: 'simple-fill', color: '#6B9E99', outline: {width: '1.5px'}}, label: 'SJ Terminado (Reserva rechazada)'},
          {value: 'CA Terminado (Reserva rechazada)', symbol: { type: 'simple-fill', color: '#84C4BB', outline: {width: '1.5px'}}, label: 'CA Terminado (Reserva rechazada)'},
          {value: 'PABA Terminado (Reserva rechazada)', symbol: { type: 'simple-fill', color: '#62938F', outline: {width: '1.5px'}}, label: 'PABA Terminado (Reserva rechazada)'},
          {value: 'BE Terminado (Reserva rechazada)', symbol: { type: 'simple-fill', color: '#5D9084', outline: {width: '1.5px'}}, label: 'BE Terminado (Reserva rechazada)'},
          {value: 'CC Terminado (Reserva rechazada)', symbol: { type: 'simple-fill', color: '#73B9BC', outline: {width: '1.5px'}}, label: 'CC Terminado (Reserva rechazada)'},
          {value: 'FEM Terminado (Reserva rechazada)', symbol: { type: 'simple-fill', color: '#639FA3', outline: {width: '1.5px'}}, label: 'FEM Terminado (Reserva rechazada)'},
          {value: 'CL Terminado (Reserva rechazada)', symbol: { type: 'simple-fill', color: '#4D8085', outline: {width: '1.5px'}}, label: 'CL Terminado (Reserva rechazada)'},
          {value: 'CO Terminado (Reserva rechazada)', symbol: { type: 'simple-fill', color: '#429599', outline: {width: '1.5px'}}, label: 'CO Terminado (Reserva rechazada)'},
          {value: 'FE Terminado (Reserva rechazada)', symbol: { type: 'simple-fill', color: '#46B7A9', outline: {width: '1.5px'}}, label: 'FE Terminado (Reserva rechazada)'},
          {value: 'GS Terminado (Reserva rechazada)', symbol: { type: 'simple-fill', color: '#30787D', outline: {width: '1.5px'}}, label: 'GS Terminado (Reserva rechazada)'},
          {value: 'RH Terminado (Reserva rechazada)', symbol: { type: 'simple-fill', color: '#247B72', outline: {width: '1.5px'}}, label: 'RH Terminado (Reserva rechazada)'},
          {value: 'SF Terminado (Reserva rechazada)', symbol: { type: 'simple-fill', color: '#04A9AD', outline: {width: '1.5px'}}, label: 'SF Terminado (Reserva rechazada)'},
          {value: 'IN Terminado (Reserva rechazada)', symbol: { type: 'simple-fill', color: '#007175', outline: {width: '1.5px'}}, label: 'IN Terminado (Reserva rechazada)'},
          {value: 'SG Terminado (Buen estado)', symbol: { type: 'simple-fill', color: '#67A0B1', outline: {width: '1.5px'}}, label: 'SG Terminado (Buen estado)'},
          {value: 'LS Terminado (Buen estado)', symbol: { type: 'simple-fill', color: '#6A98B8', outline: {width: '1.5px'}}, label: 'LS Terminado (Buen estado)'},
          {value: 'SI Terminado (Buen estado)', symbol: { type: 'simple-fill', color: '#3B769A', outline: {width: '1.5px'}}, label: 'SI Terminado (Buen estado)'},
          {value: 'SJ Terminado (Buen estado)', symbol: { type: 'simple-fill', color: '#157B8D', outline: {width: '1.5px'}}, label: 'SJ Terminado (Buen estado)'},
          {value: 'CA Terminado (Buen estado)', symbol: { type: 'simple-fill', color: '#1A90CC', outline: {width: '1.5px'}}, label: 'CA Terminado (Buen estado)'},
          {value: 'PABA Terminado (Buen estado)', symbol: { type: 'simple-fill', color: '#0D7283', outline: {width: '1.5px'}}, label: 'PABA Terminado (Buen estado)'},
          {value: 'BE Terminado (Buen estado)', symbol: { type: 'simple-fill', color: '#00A5C4', outline: {width: '1.5px'}}, label: 'BE Terminado (Buen estado)'},
          {value: 'CC Terminado (Buen estado)', symbol: { type: 'simple-fill', color: '#009FB9', outline: {width: '1.5px'}}, label: 'CC Terminado (Buen estado)'},
          {value: 'FEM Terminado (Buen estado)', symbol: { type: 'simple-fill', color: '#00728A', outline: {width: '1.5px'}}, label: 'FEM Terminado (Buen estado)'},
          {value: 'CL Terminado (Buen estado)', symbol: { type: 'simple-fill', color: '#007A8F', outline: {width: '1.5px'}}, label: 'CL Terminado (Buen estado)'},
          {value: 'CO Terminado (Buen estado)', symbol: { type: 'simple-fill', color: '#0080B7', outline: {width: '1.5px'}}, label: 'CO Terminado (Buen estado)'},
          {value: 'FE Terminado (Buen estado)', symbol: { type: 'simple-fill', color: '#0078AC', outline: {width: '1.5px'}}, label: 'FE Terminado (Buen estado)'},
          {value: 'GS Terminado (Buen estado)', symbol: { type: 'simple-fill', color: '#006796', outline: {width: '1.5px'}}, label: 'GS Terminado (Buen estado)'},
          {value: 'RH Terminado (Buen estado)', symbol: { type: 'simple-fill', color: '#0090D0', outline: {width: '1.5px'}}, label: 'RH Terminado (Buen estado)'},
          {value: 'SF Terminado (Buen estado)', symbol: { type: 'simple-fill', color: '#006393', outline: {width: '1.5px'}}, label: 'SF Terminado (Buen estado)'},
          {value: 'IN Terminado (Buen estado)', symbol: { type: 'simple-fill', color: '#00487F', outline: {width: '1.5px'}}, label: 'IN Terminado (Buen estado)'},
          {value: 'SG Terminado (Vigencia diagnóstico)', symbol: { type: 'simple-fill', color: '#EDE8F3', outline: {width: '1.5px'}}, label: 'SG Terminado (Vigencia diagnóstico)'},
          {value: 'LS Terminado (Vigencia diagnóstico)', symbol: { type: 'simple-fill', color: '#CBBCD7', outline: {width: '1.5px'}}, label: 'LS Terminado (Vigencia diagnóstico)'},
          {value: 'SI Terminado (Vigencia diagnóstico)', symbol: { type: 'simple-fill', color: '#B89DC9', outline: {width: '1.5px'}}, label: 'SI Terminado (Vigencia diagnóstico)'},
          {value: 'SJ Terminado (Vigencia diagnóstico)', symbol: { type: 'simple-fill', color: '#AA91BA', outline: {width: '1.5px'}}, label: 'SJ Terminado (Vigencia diagnóstico)'},
          {value: 'CA Terminado (Vigencia diagnóstico)', symbol: { type: 'simple-fill', color: '#B289BC', outline: {width: '1.5px'}}, label: 'CA Terminado (Vigencia diagnóstico)'},
          {value: 'PABA Terminado (Vigencia diagnóstico)', symbol: { type: 'simple-fill', color: '#9C74AD', outline: {width: '1.5px'}}, label: 'PABA Terminado (Vigencia diagnóstico)'},
          {value: 'BE Terminado (Vigencia diagnóstico)', symbol: { type: 'simple-fill', color: '#7E5D8D', outline: {width: '1.5px'}}, label: 'BE Terminado (Vigencia diagnóstico)'},
          {value: 'CC Terminado (Vigencia diagnóstico)', symbol: { type: 'simple-fill', color: '#9566A0', outline: {width: '1.5px'}}, label: 'CC Terminado (Vigencia diagnóstico)'},
          {value: 'FEM Terminado (Vigencia diagnóstico)', symbol: { type: 'simple-fill', color: '#955AA1', outline: {width: '1.5px'}}, label: 'FEM Terminado (Vigencia diagnóstico)'},
          {value: 'CL Terminado (Vigencia diagnóstico)', symbol: { type: 'simple-fill', color: '#8B58A1', outline: {width: '1.5px'}}, label: 'CL Terminado (Vigencia diagnóstico)'},
          {value: 'CO Terminado (Vigencia diagnóstico)', symbol: { type: 'simple-fill', color: '#895295', outline: {width: '1.5px'}}, label: 'CO Terminado (Vigencia diagnóstico)'},
          {value: 'FE Terminado (Vigencia diagnóstico)', symbol: { type: 'simple-fill', color: '#74447F', outline: {width: '1.5px'}}, label: 'FE Terminado (Vigencia diagnóstico)'},
          {value: 'GS Terminado (Vigencia diagnóstico)', symbol: { type: 'simple-fill', color: '#5D376E', outline: {width: '1.5px'}}, label: 'GS Terminado (Vigencia diagnóstico)'},
          {value: 'RH Terminado (Vigencia diagnóstico)', symbol: { type: 'simple-fill', color: '#783B92', outline: {width: '1.5px'}}, label: 'RH Terminado (Vigencia diagnóstico)'},
          {value: 'SF Terminado (Vigencia diagnóstico)', symbol: { type: 'simple-fill', color: '#661585', outline: {width: '1.5px'}}, label: 'SF Terminado (Vigencia diagnóstico)'},
          {value: 'IN Terminado (Vigencia diagnóstico)', symbol: { type: 'simple-fill', color: '#55076F', outline: {width: '1.5px'}}, label: 'IN Terminado (Vigencia diagnóstico)'},
          {value: 'SG Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#EDDCE7', outline: {width: '1.5px'}}, label: 'SG Terminado (Buen estado - seguimiento)'},
          {value: 'LS Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#DFC4D4', outline: {width: '1.5px'}}, label: 'LS Terminado (Buen estado - seguimiento)'},
          {value: 'SI Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#E5BDD3', outline: {width: '1.5px'}}, label: 'SI Terminado (Buen estado - seguimiento)'},
          {value: 'SJ Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#B998AC', outline: {width: '1.5px'}}, label: 'SJ Terminado (Buen estado - seguimiento)'},
          {value: 'CA Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#DBB4CA', outline: {width: '1.5px'}}, label: 'CA Terminado (Buen estado - seguimiento)'},
          {value: 'PABA Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#C294B4', outline: {width: '1.5px'}}, label: 'PABA Terminado (Buen estado - seguimiento)'},
          {value: 'BE Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#D491B4', outline: {width: '1.5px'}}, label: 'BE Terminado (Buen estado - seguimiento)'},
          {value: 'CC Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#A87190', outline: {width: '1.5px'}}, label: 'CC Terminado (Buen estado - seguimiento)'},
          {value: 'FEM Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#D17FAA', outline: {width: '1.5px'}}, label: 'FEM Terminado (Buen estado - seguimiento)'},
          {value: 'CL Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#C779A2', outline: {width: '1.5px'}}, label: 'CL Terminado (Buen estado - seguimiento)'},
          {value: 'CO Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#9A5B7E', outline: {width: '1.5px'}}, label: 'CO Terminado (Buen estado - seguimiento)'},
          {value: 'FE Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#C964A3', outline: {width: '1.5px'}}, label: 'FE Terminado (Buen estado - seguimiento)'},
          {value: 'GS Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#9D4B81', outline: {width: '1.5px'}}, label: 'GS Terminado (Buen estado - seguimiento)'},
          {value: 'RH Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#BF3F93', outline: {width: '1.5px'}}, label: 'RH Terminado (Buen estado - seguimiento)'},
          {value: 'SF Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#B70084', outline: {width: '1.5px'}}, label: 'SF Terminado (Buen estado - seguimiento)'},
          {value: 'IN Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#8F0067', outline: {width: '1.5px'}}, label: 'IN Terminado (Buen estado - seguimiento)'},
          /* {value: 'SG Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#C791AC', outline: {width: '1.5px'}}, label: 'SG Terminado (Buen estado - seguimiento)'},
          {value: 'LS Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#AA607C', outline: {width: '1.5px'}}, label: 'LS Terminado (Buen estado - seguimiento)'},
          {value: 'SI Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#BF567D', outline: {width: '1.5px'}}, label: 'SI Terminado (Buen estado - seguimiento)'},
          {value: 'SJ Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#9C4366', outline: {width: '1.5px'}}, label: 'SJ Terminado (Buen estado - seguimiento)'},
          {value: 'CA Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#DD5C85', outline: {width: '1.5px'}}, label: 'CA Terminado (Buen estado - seguimiento)'},
          {value: 'PABA Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#D4587F', outline: {width: '1.5px'}}, label: 'PABA Terminado (Buen estado - seguimiento)'},
          {value: 'BE Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#A84365', outline: {width: '1.5px'}}, label: 'BE Terminado (Buen estado - seguimiento)'},
          {value: 'CC Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#BC3C71', outline: {width: '1.5px'}}, label: 'CC Terminado (Buen estado - seguimiento)'},
          {value: 'FEM Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#9A2D5B', outline: {width: '1.5px'}}, label: 'FEM Terminado (Buen estado - seguimiento)'},
          {value: 'CL Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#E23D7A', outline: {width: '1.5px'}}, label: 'CL Terminado (Buen estado - seguimiento)'},
          {value: 'CO Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#D03771', outline: {width: '1.5px'}}, label: 'CO Terminado (Buen estado - seguimiento)'},
          {value: 'FE Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#BC2F66', outline: {width: '1.5px'}}, label: 'FE Terminado (Buen estado - seguimiento)'},
          {value: 'GS Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#B12B60', outline: {width: '1.5px'}}, label: 'GS Terminado (Buen estado - seguimiento)'},
          {value: 'RH Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#A52759', outline: {width: '1.5px'}}, label: 'RH Terminado (Buen estado - seguimiento)'},
          {value: 'SF Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#DC007F', outline: {width: '1.5px'}}, label: 'SF Terminado (Buen estado - seguimiento)'},
          {value: 'IN Terminado (Buen estado - seguimiento)', symbol: { type: 'simple-fill', color: '#9B0058', outline: {width: '1.5px'}}, label: 'IN Terminado (Buen estado - seguimiento)'}, */
          {value: 'SG Terminado (Sin Intervención)', symbol: { type: 'simple-fill', color: '#9B7F72', outline: {width: '1.5px'}}, label: 'SG Terminado (Sin Intervención)'},
          {value: 'LS Terminado (Sin Intervención)', symbol: { type: 'simple-fill', color: '#A58879', outline: {width: '1.5px'}}, label: 'LS Terminado (Sin Intervención)'},
          {value: 'SI Terminado (Sin Intervención)', symbol: { type: 'simple-fill', color: '#B2826A', outline: {width: '1.5px'}}, label: 'SI Terminado (Sin Intervención)'},
          {value: 'SJ Terminado (Sin Intervención)', symbol: { type: 'simple-fill', color: '#8B6453', outline: {width: '1.5px'}}, label: 'SJ Terminado (Sin Intervención)'},
          {value: 'CA Terminado (Sin Intervención)', symbol: { type: 'simple-fill', color: '#9D825D', outline: {width: '1.5px'}}, label: 'CA Terminado (Sin Intervención)'},
          {value: 'PABA Terminado (Sin Intervención)', symbol: { type: 'simple-fill', color: '#9E654B', outline: {width: '1.5px'}}, label: 'PABA Terminado (Sin Intervención)'},
          {value: 'BE Terminado (Sin Intervención)', symbol: { type: 'simple-fill', color: '#8B5941', outline: {width: '1.5px'}}, label: 'BE Terminado (Sin Intervención)'},
          {value: 'CC Terminado (Sin Intervención)', symbol: { type: 'simple-fill', color: '#6A412F', outline: {width: '1.5px'}}, label: 'CC Terminado (Sin Intervención)'},
          {value: 'FEM Terminado (Sin Intervención)', symbol: { type: 'simple-fill', color: '#7E6036', outline: {width: '1.5px'}}, label: 'FEM Terminado (Sin Intervención)'},
          {value: 'CL Terminado (Sin Intervención)', symbol: { type: 'simple-fill', color: '#8D4D33', outline: {width: '1.5px'}}, label: 'CL Terminado (Sin Intervención)'},
          {value: 'CO Terminado (Sin Intervención)', symbol: { type: 'simple-fill', color: '#7C432B', outline: {width: '1.5px'}}, label: 'CO Terminado (Sin Intervención)'},
          {value: 'FE Terminado (Sin Intervención)', symbol: { type: 'simple-fill', color: '#5F301E', outline: {width: '1.5px'}}, label: 'FE Terminado (Sin Intervención)'},
          {value: 'GS Terminado (Sin Intervención)', symbol: { type: 'simple-fill', color: '#7B371E', outline: {width: '1.5px'}}, label: 'GS Terminado (Sin Intervención)'},
          {value: 'RH Terminado (Sin Intervención)', symbol: { type: 'simple-fill', color: '#6D2F19', outline: {width: '1.5px'}}, label: 'RH Terminado (Sin Intervención)'},
          {value: 'SF Terminado (Sin Intervención)', symbol: { type: 'simple-fill', color: '#542010', outline: {width: '1.5px'}}, label: 'SF Terminado (Sin Intervención)'},
          {value: 'IN Terminado (Sin Intervención)', symbol: { type: 'simple-fill', color: '#8E5C0E', outline: {width: '1.5px'}}, label: 'IN Terminado (Sin Intervención)'},

        ]
    },
  },
  mostrarMapa: 'Mostrar Mapa',
  ocultarmapa: 'Ocultar Mapa'


};
