// tslint:disable-next-line: max-line-length
import { ImportarSeleccionPksComponent } from './../../../workflow/forms/solicitud/shared/importar-seleccion-pks/importar-seleccion-pks.component';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar, MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';
import { GRID_MANTENIMIENTOS_CONSTANTS } from './grid-mantenimientos.constants';
import { WorkflowTransicionModel } from 'src/app/workflow/models/workflow-transicion.model';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { CondicionService } from 'src/app/administracion/transicioncondiciones/services/transicioncondiciones.services';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { GridAccion } from './model/grid-accion.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { UsuarioInfo } from 'src/app/workflow/models/usuario-info.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { BaseGridComponent } from './base-grid-component';
import { WorkflowActividadModel } from 'src/app/workflow/models/workflow-actividad.model';
import { DefaultSortGrid } from '../../models/defaultSortGrid';
import { Zona } from 'src/app/administracion/ubicaciones/zona/models/zona.model';
import { ZonaService } from 'src/app/administracion/ubicaciones/zona/services/zona.service';
import { Localidad } from 'src/app/administracion/ubicaciones/localidad/models/localidad.model';
import { LocalidadService } from 'src/app/administracion/ubicaciones/localidad/services/localidad.service';
import { BarrioService } from 'src/app/administracion/ubicaciones/barrio/services/barrio.service';
import { Barrio } from 'src/app/administracion/ubicaciones/barrio/models/barrio.model';
import { Observable } from 'rxjs';
import { DataGenericService } from '../../services/data-generic.service';
import { filter, catchError } from 'rxjs/operators';
import { MapService } from '../../services/map.service';
import { Upla } from 'src/app/administracion/ubicaciones/upla/models/upla.model';
import { Cuadrante } from 'src/app/administracion/ubicaciones/cuadrante/models/cuadrante.model';
import { PdfService } from '../../services/pdf.service';
import { Usuario } from 'src/app/administracion/usuario/models/usuario.model';
import { Profile } from 'src/app/seguridad/models/profile';
import { SigmaConfirmFormatToExportComponent } from '../sigma-confirm-format-to-export/sigma-confirm-format-to-export.component';
import { ProfileService } from 'src/app/seguridad/services/profile.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';

/**
 * Componente de la grilla usado para gestionar los datos de los mantenimientos de forma
 * global para las actividades contempradas como proceso en el sistema
*/
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-grid-mantenimientos',
  templateUrl: './grid-mantenimientos.component.html'
})
export class GridMantenimientosComponent extends BaseGridComponent implements OnInit, AfterViewInit, OnDestroy {

  /**
   * Variable bandera con la cual se identifica si el componente
   * se encuentra realizando algun procesamiento de información
   */
  processing = false;
  /** Constantes a usar en el componente */
  constants = GRID_MANTENIMIENTOS_CONSTANTS;
  /** Listado de filtros permitidos a usar en el componente */
  filtersToShow = {
    id: false, pk: false, civ: false, solicitudRadicadoEntrada: false, origen: false, responsable: false, ejecutadoPor: false,
    fechaAsignacion: false, fechaVencimiento: false, zona: false, cuadrante: false, localidad: false, barrio: false, upla: false,
    upz: false,
    tieneRadicadoSalida: false, solicitudRadicadoSalida: false, estadoPk: false, fechaVisitaTecnica: false, fechaInstalacion: false,
    indicePriorizacion: false, tipoMalla: false, posibleDanioRedes: false, tipoSeccionVial: false, actividadActual: false,
    estadoMantenimiento: false, enSeguimiento: false, fechaSeguimiento: false, tipoIntervencion: false, estrategia: false,
    directorDeObra: false, prioritarios: false, tipoRadicadoRespuestaReserva: false, radicadoSolicitudReserva: false,
    fechaAsignacionIngenieroDisenio: false, ingenieroDisenio: false, fechaSolicitudSmvl: false, numeroRadicadoSmvl: false,
    listaChequeoSmvl: false, fechaSolicitudGasa: false, numeroRadicadoGasa: false, listaChequeoGasa: false,
    radicadoIntervencion: false, radicadoInterExclusivo: false, tipoActividad: false, actividadAgrupada: false,
    estadoProgramacionVisita: false, listaIngenierosDisenio: false,
    fechaProgramacionDiaria: false, estadoProgramacionDiaria: false, estrategiaIntervencion: false,
    jornada: false, jornadaProgDiaria: false, fechaInforme: false, estadoObra: false, estadoRegistroDiarioCuadrilla: false,
    avancePorcentajeAcumuladoObra: false, estadoProgramacionPk: false, fechaProgramacionIntervencion: false,
    residenteSocial: false, tieneResidenteSocial: false, tieneResidenteAmbiental: false, tieneResidenteSST: false,
    residenteSST: false, responsableVisitaTecnica: false, responsableRevision: false, origenSin: false,
    tieneSolicitudLaboratorio: false, espesorDisenio: false, tipoResultadoId: false, frecuencia: false, tipoMezcla: false,
    residenteAmbiental: false, fechaDespacho: false, fechaSolicitud: false, fechaProgramacionVisita: false,
    estadoInspeccionIntervencion: false, fechasIntervencion: false, radicadoRespuestaReserva: false, directorDeObraXZona: false,
    fechaSolicitudEnsayo: false, tipoEnsayo: false, fechaRegistroEnsayo: false
  };

  /** Mantenimiento actividad con la información a procesar */
  @Input() data: WorkflowMantenimientoActividadModel;
  /** Información de transición en la que se encuentra el pk a procesar */
  @Input() transicion: WorkflowTransicionModel
  /** Condición por la cual se relizará la carga de pks en la grilla */
  @Input() condicion: WorkflowCondicionModel;
  /** Tipo de grilla a presentar al usuario */
  @Input() tipoGrid = 'Invisible';
  /** Listado de columnas que serán presentadas al usuario en la grilla */
  @Input() columns = [];
  /**  Nombres de columnas que presentará la grilla de mantenimiento usada en el componente */
  @Input() headers = [];
  /** Variable de entrada de los filtros que se aplicarán de forma predeterminada al componente */
  @Input() defaultFilters: KeyValuePair[] = [];
  /** Variable de entrada de los filtros que se aplicarán de forma predeterminada al componente */
  @Input() preloadFilters: KeyValuePair[] = [];
  /** Filtros a aplicar a la grilla en la acción de consulta */
  @Input() filters = [];
  /** Ordenamiento que de forma predeterminada se presenta al usuario al presentar la grilla*/
  @Input() defaultSortGrid: DefaultSortGrid;
  /** Listado de acciones con las cuales interactuará el usuario para cada Pk */
  @Input() singleActions: GridAccion[];
  /** Acciones masivas a aplicar a todos los pks seleccionados por el usuario */
  @Input() masiveActions: GridAccion[];
  /** Evento que notifica la realización de la acción de selección de 1 unico pk */
  @Output() executeOnSingle = new EventEmitter();
  /** Evento que notifica la realización de la acción de selección de varios de los pks */
  @Output() executeOnMasiveAction = new EventEmitter();
  /** Evento que notifica la realización de la acción de selección de varios de los pks */
  @Output() executeOnChangeSelecteds = new EventEmitter();
  /** Evento que notifica la realización de la acción de transición de varios de los pks */
  @Output() executeOnMasiveTransition = new EventEmitter();
  /** Evento que notifica la realización de la acción serch */
  @Output() executeOnSearch = new EventEmitter();
  /** Bandera que indica si se presenta el botón de exportar */
  @Input() showExport = true;
  /** Bandera que indica si se presenta el botón de importar datos */
  @Input() showImport = false;
  /** Etiqueta que indica el mensaje a presentar para el botón exportar a excel */
  @Input() exportTo = this.constants.excel;
  /** Variable con la funcionaldiad de importar  */
  @Input() funcionalidadImportar = null;
  /** Bandera que indica si se presentará el contador de cantidad de registros */
  @Input() showCountItems = true;
  /** Bandera que indica si se presentará los datos de atividad agrupada */
  @Input() showActividadAgrupada = true;
  /** Bandera que indica si se presentarán los datos de kilometro carril */
  @Input() showKmCarril = true;
  /** Bandera que indica si se presentará la sumatoria de kilometro carril lineal */
  @Input() showKmLineal = false;
  /** Bandera que indica si se presentará el Kilometro carril por obra */
  @Input() showKmObra = false;
  /** Bandera que indica si se presentará la sección de transiciones */
  @Input() showTransitionComponent = true;
  /** Bandera que indica si se presentará el dato de duración planeada de obra */
  @Input() showTotalDiasDuracionPlaneada = false;
  /** Bandera que indica si se presentará el Número total de cuadrillas para el pk */
  @Input() showTotalNoCuadrilla = false;

  /** Bandera que indica si se mostrará al usuario la
   * opción seleccionar todos los pks de la grilla */
  @Input() showCheckMasive = false;
  /** Bandera que indica si se presentará el check para selección de un pk */
  @Input() showCheckSingle = false;
  /** Listado de columnas que se exportarán en el archivo excel
   * al presionar exportar */
  @Input() columnsToExport: string[];

  /** Listado de origenes que serán excluidos del listado
   * para la selección de este tipo de dato */
  @Input() excludeOrigin: string[];
  /** Listado de estados del pk que serán excluidos del listado
   * para la selección de este tipo de dato */
  @Input() excludeEstadoPk: string[];
  /** Bandera que permite identificar si la selección de
   * ruta en el mapa ya se inició */
  @Input() mapaInicial = true;
  /**
   * permite pasar un usuario predeterminado para ejecutar la transicion
   */
  @Input() defaultUserToTransition: Usuario;
  /**  Bandera que permite mostrar un reponsable por defecto en la columna reponsable del grid  */
  @Input() reponsableForViewGrid: Profile;
  /** Bandera que permite mostar un popup en el cual se pregunta el formato a exportar (excel, pdf) */
  @Input() confirmFormatToExport = false;

  /** Listado de filtros a presentar al usuario */
  filtersJson: any[];
  /** Listado de filtros aplicados a la tabla de la grilla */
  tableFiltersLimitesAplicados: any[];
  /** Listado de equivalencia de campos */
  fieldsEquivalentes: any[] = [{ id: 'tieneRadicadoSalida', equivalente: 'solicitudRadicadoSalida' }];
  /** Listado de transiciones disponibles para selección del usuario */
  transiciones: WorkflowTransicionModel[] = [];
  /** Filtro de actividades actuales a presentar */
  actividadActualFromFilter: WorkflowActividadModel;
  /** Listado de zonas a las que pertenecen los pks seleccionados */
  zonas: Zona[] = [];
  /** Listado de todas las localidades */
  localidadesAll: Localidad[] = [];
  /** Listado de todos los barrios */
  barriosAll: Barrio[] = [];
  /** Variable par conservar el listado de las localidades segun zona */
  localidades: Localidad[] = [];
  /** Variable par conservar el listado de las barrios segun localidad */
  barrios: Barrio[] = [];
  /** Variable par conservar el listado de uplas */
  uplas: Upla[] = [];
  /** Listado de todos los cuadrantes */
  cuadrantesAll: Cuadrante[] = [];
  /** Listado de todas las uplas */
  uplasAll: Upla[] = [];
  /** Observable de opciones de filtros a realizar al seleccionar un barrio del filtro */
  filteredOptions: Observable<Barrio[]>;
  /** Variable para gestionar el filtro de la grilla por pk */
  public pkGridByPk = null;
  /* Variable para obtener el usuario logueado */
  public usuarioLogueado: any;


  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones de mantenimientos
   * @param commonService Servicio usado en el componente para gestionar las peticiones
   * @param workflowService Componente usado para invocar los servicios de workflow
   * @param pdfService Componente usado para gestionar la exportación de la grilla en archivo pdf
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesServices Componente de utilidades de peticiones a servicios
   * @param _servicioGeneral Servicio usado para gestionar los servicios generales de SIGMA
   * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
   * @param mapService Componente usado para gestionar información del mapa
   * @param _servicioZona Servicio usado en el componente para gestionar la infoación de las zonas
   * @param _servicioLocalidad Servicio usado en el componente para gestionar la infoación de las localidades
   * @param _servicioBarrio Servicio usado en el componente para gestionar la infoación de los barrios
   **/
  constructor(
    servicio: CondicionService,
    commonService: CommonService,
    workflowService: WorkflowService,
    excelService: ExcelService,
    pdfService: PdfService,
    utilitiesServices: UtilitiesService,
    snackBar: MatSnackBar,
    private _servicioGeneral: DataGenericService,
    public dialog: MatDialog,
    private _servicioZona: ZonaService,
    private _servicioLocalidad: LocalidadService,
    private _servicioBarrio: BarrioService,
    private mapService: MapService,
    private tokenStorage: TokenStorageService,
    public utilitiesService: UtilitiesService
  ) {
    super(servicio, commonService, workflowService, excelService, pdfService,
      utilitiesServices, snackBar);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    if (this.transicion) {
      this.transiciones.push(this.transicion);
    }

    if (this.defaultSortGrid) {
      this.criteria.sortBy = this.defaultSortGrid.sortBy;
      this.criteria.sortOrder = this.defaultSortGrid.sortOrder;
    }

    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    super.initDataSource();
    this.initFilters();
    super.loadTransicion();
    this.processingFiltersToShow();
    this.processingColumnsToShow();
    if (!this.mapaInicial) {
      this.mapService.getVisor().visible = false;
    }
    this.usuarioLogueado = this.tokenStorage.getStorage(this.tokenStorage.PERFIL);
    this.inicializarDataSourcePksSeleccionados();
  }

  /** Método encargado de obtener los datos de los pks seleccionados por el usuario */
  inicializarDataSourcePksSeleccionados() {
    this.dataSourcePksSeleccionados = new MatTableDataSource(this._mantenimientosSeleccionados);
    this.dataSourcePksSeleccionados.filterPredicate =
      (data: WorkflowMantenimientoModel, filtersJson: string) => {
        const matchFilter = [];
        const filters = JSON.parse(filtersJson);
        const _this = this;
        filters.forEach(filter => {
          let rowData = data[filter.id] === null ? '' : data[filter.id];
          let bandDesdeHasta = '';
          if (typeof rowData === 'undefined') {
            if (!this.isFilterFieldEquivalent(filter.id, _this)) {
              if (filter.id.includes('Hasta')) {
                bandDesdeHasta = 'Hasta';
              } else {
                bandDesdeHasta = 'Desde';
              }
              filter.id = filter.id.replace(bandDesdeHasta, '');
              rowData = data[filter.id] === null ? '' : data[filter.id];
            } else {
              // inicio: campos 'Equivalentes'
              if (typeof rowData === 'undefined') {
                const fieldHomologado = this.getFilterFieldEquivalent(filter.id, this).equivalente;
                rowData = data[fieldHomologado] === null ? false :
                  data[fieldHomologado].length > 0 ? true : false;
              }
              // fin: campos 'Equivalentes'
            }
          }
          switch (typeof rowData) {
            case 'string':
              if (!_this.utilitiesServices.isValidDateWithFormat(rowData, 'DD-MM-YYYY')) {
                // Para campos cadenas
                matchFilter.push(rowData.includes(filter.value));
              } else {
                // para campos de fechas
                const fechaRowData = _this.utilitiesServices.getFechaClientFormat(rowData);
                if (bandDesdeHasta === 'Desde') {
                  // Filtro fecha desde
                  const filterDesdeDate = _this.utilitiesServices.getFechaClientFormat(filter.value);
                  const filterHasta = this.findFilterByName(filter.id + 'Hasta', _this);
                  if (filterHasta !== null) {
                    const filterHastaDate = _this.utilitiesServices.getFechaClientFormat(filterHasta.value);
                    if (!this.findFilterTableLimitesAplicadosByName(filter.id, rowData, _this)) {
                      matchFilter.push(fechaRowData >= filterDesdeDate && fechaRowData <= filterHastaDate);
                    }
                  } else {
                    matchFilter.push(fechaRowData >= filterDesdeDate);
                  }
                } else {
                  // Filtro fecha Hasta
                  const filterHastaDate = _this.utilitiesServices.getFechaClientFormat(filter.value);
                  const filterDesde = this.findFilterByName(filter.id + 'Desde', _this);
                  if (filterDesde !== null) {
                    const filterDesdeDate = _this.utilitiesServices.getFechaClientFormat(filterDesde.value);
                    if (!this.findFilterTableLimitesAplicadosByName(filter.id, rowData, _this)) {
                      matchFilter.push(fechaRowData >= filterDesdeDate && fechaRowData <= filterHastaDate);
                    }
                  } else {
                    matchFilter.push(fechaRowData <= filterHastaDate);
                  }
                }
                this.tableFiltersLimitesAplicados.push({ 'id': filter.id, 'value': filter.value });
              }
              break;
            case 'number':
              if (bandDesdeHasta === '') {
                // Caso normal
                matchFilter.push(rowData.toString() === filter.value);
              } else {

                if (bandDesdeHasta === 'Desde') {
                  // para filtro numero 'Desde'
                  const filterHasta = this.findFilterByName(filter.id + 'Hasta', _this);
                  if (filterHasta !== null) {
                    if (!this.findFilterTableLimitesAplicadosByName(filter.id, rowData, _this)) {
                      matchFilter.push(rowData >= Number(filter.value) && rowData <= Number(filterHasta.value));
                    }
                  } else {
                    matchFilter.push(rowData >= Number(filter.value));
                  }
                } else {
                  // para filtro numero 'Hasta'
                  const filterDesde = this.findFilterByName(filter.id + 'Desde', _this);
                  if (filterDesde !== null) {
                    if (!this.findFilterTableLimitesAplicadosByName(filter.id, rowData, _this)) {
                      matchFilter.push(rowData >= Number(filterDesde.value) && rowData <= Number(filter.value));
                    }
                  } else {
                    matchFilter.push(rowData <= Number(filter.value));
                  }
                }
                this.tableFiltersLimitesAplicados.push({ 'id': filter.id, 'value': filter.value });
              }
              break;
            case 'object':
              const rowDataListItem = rowData as ListaItem;
              matchFilter.push(rowDataListItem.id === filter.value);
              break;
            case 'boolean':
              matchFilter.push(rowData.toString() === filter.value);
              break;
          }
        });
        return matchFilter.every(Boolean);
      };
  }

  /**
   * Método encargado de encontrar los límites de los filtros a usar en la grilla
   * @param name Nombre del filtro
   * @param data Datos que contienen el filtro a aplicar
   * @param _this Elemento sobre el cual se aplicará el filtro
  */
  findFilterTableLimitesAplicadosByName(name: string, data: any, _this: any) {
    for (let i = 0; i < _this.tableFiltersLimitesAplicados.length; i++) {
      if (_this.tableFiltersLimitesAplicados[i].id === name && _this.tableFiltersLimitesAplicados[i].data === data) {
        return true;
      }
    }
    return false;
  }

  /** Método encargado de identificar la equialencia del filtro según la etiqueta del control
   * @param name Nombre del elemento
   * @param _this referencia al elemento actual
  */
  isFilterFieldEquivalent(name: string, _this: any) {
    for (let i = 0; i < _this.fieldsEquivalentes.length; i++) {
      if (_this.fieldsEquivalentes[i].id === name) {
        return true;
      }
    }
    return false;
  }

  /** Método encargado de obtener el valor de equivalencia de la etiqueta
   * @param name Nombre del elemento
   * @param _this referencia al elemento actual
  */
  getFilterFieldEquivalent(name: string, _this: any): any {
    for (let i = 0; i < _this.fieldsEquivalentes.length; i++) {
      if (_this.fieldsEquivalentes[i].id === name) {
        return _this.fieldsEquivalentes[i];
      }
    }
    return null;
  }


  /** Método encargado de obtener el valor de equivalencia de la etiqueta
  * @param name Nombre del elemento
  * @param _this referencia al elemento actual
 */
  findFilterByName(name: string, _this: any) {
    for (let i = 0; i < _this.filtersJson.length; i++) {
      if (_this.filtersJson[i].id === name) {
        return _this.filtersJson[i];
      }
    }
    return null;
  }

  /** Metodo encargado de realizar la búsqueda de los pks seleccionados en la grilla */
  searchSeleccionados() {
    let tableFilters = [];

    tableFilters = this.getFiltersPksSeleccionados(tableFilters);
    this.filtersJson = tableFilters;
    this.executeOnChangeSelecteds.emit(
      { mantenimientos: this._mantenimientosSeleccionados }
    );
    this.dataSourcePksSeleccionados.filter = JSON.stringify(tableFilters);
    if (this.dataSourcePksSeleccionados.paginator) {
      this.dataSourcePksSeleccionados.paginator.firstPage();
    }
  }

  /**
   * Método encargado de contruir los filtros por los cuales se realizará
   * la consulta según selección realizada por el usuario.
   * @param tableFilters Tabla de filtros expuesta en el componente que solicitó la grilla
   */
  getFiltersPksSeleccionados(tableFilters: any[]) {
    this.tableFiltersLimitesAplicados = [];
    if (this.criteria.pk !== undefined && this.criteria.pk !== null && this.criteria.pk !== '') {
      tableFilters.push({
        id: 'pk',
        value: this.criteria.pk
      });
    }
    if (this.criteria.civ !== undefined && this.criteria.civ !== null && this.criteria.civ !== '') {
      tableFilters.push({
        id: 'civ',
        value: this.criteria.civ
      });
    }
    if (this.criteria.localidad !== undefined && this.criteria.localidad !== null) {
      tableFilters.push({
        id: 'localidad',
        value: this.criteria.localidad.id
      });
    }
    if (this.criteria.cuadrante !== undefined && this.criteria.cuadrante !== null) {
      tableFilters.push({
        id: 'cuadrante',
        value: this.criteria.cuadrante.id
      });
    }
    if (this.criteria.barrio !== undefined && this.criteria.barrio !== null) {
      tableFilters.push({
        id: 'barrio',
        value: this.criteria.barrio.id
      });
    }
    if (this.criteria.zona !== undefined && this.criteria.zona !== null) {
      tableFilters.push({
        id: 'zona',
        value: this.criteria.zona.id
      });
    }
    if (this.criteria.estadoMantenimiento !== undefined && this.criteria.estadoMantenimiento !== null) {
      tableFilters.push({
        id: 'estadoMantenimiento',
        value: this.criteria.estadoMantenimiento.id
      });
    }
    if (this.criteria.tipoSeccionVial !== undefined && this.criteria.tipoSeccionVial !== null) {
      tableFilters.push({
        id: 'tipoSeccionVial',
        value: this.criteria.tipoSeccionVial.id
      });
    }
    if (this.criteria.tipoMalla !== undefined && this.criteria.tipoMalla !== null) {
      tableFilters.push({
        id: 'tipoMalla',
        value: this.criteria.tipoMalla.id
      });
    }
    // tslint:disable-next-line: max-line-length
    if (this.criteria.actividadActualId !== undefined && this.criteria.actividadActualId !== null && this.criteria.actividadActualId !== '') {
      tableFilters.push({
        id: 'actividadActualId',
        value: this.criteria.actividadActualId
      });
    }
    if (this.criteria.origen !== undefined && this.criteria.origen !== null) {
      tableFilters.push({
        id: 'origen',
        value: this.criteria.origen.id
      });
    }
    if (this.criteria.solicitudRadicadoEntrada !== undefined && this.criteria.solicitudRadicadoEntrada !== null
      && this.criteria.solicitudRadicadoEntrada !== '') {
      tableFilters.push({
        id: 'solicitudRadicadoEntrada',
        value: this.criteria.solicitudRadicadoEntrada
      });
    }
    if (this.criteria.solicitudRadicadoSalida !== undefined && this.criteria.solicitudRadicadoSalida !== null
      && this.criteria.solicitudRadicadoSalida !== '') {
      tableFilters.push({
        id: 'solicitudRadicadoSalida',
        value: this.criteria.solicitudRadicadoSalida
      });
    }
    if (this.criteria.indicePriorizacion !== undefined && this.criteria.indicePriorizacion !== null
      && this.criteria.indicePriorizacion !== '') {
      tableFilters.push({
        id: 'indicePriorizacion',
        value: this.criteria.indicePriorizacion
      });
    }
    if (this.criteria.indicePriorizacionDesde !== undefined && this.criteria.indicePriorizacionDesde !== null
      && this.criteria.indicePriorizacionDesde !== '') {
      tableFilters.push({
        id: 'indicePriorizacionDesde',
        value: this.criteria.indicePriorizacionDesde
      });
    }

    if (this.criteria.indicePriorizacionHasta !== undefined && this.criteria.indicePriorizacionHasta !== null
      && this.criteria.indicePriorizacionHasta !== '') {
      tableFilters.push({
        id: 'indicePriorizacionHasta',
        value: this.criteria.indicePriorizacionHasta
      });
    }
    if (this.criteria.fechaAsignacionDesde !== undefined && this.criteria.fechaAsignacionDesde != null
      && this.criteria.fechaAsignacionDesde !== '') {
      tableFilters.push({
        id: 'fechaAsignacionDesde',
        value: this.criteria.fechaAsignacionDesde
      });
    }
    if (this.criteria.fechaAsignacionHasta !== undefined && this.criteria.fechaAsignacionHasta != null
      && this.criteria.fechaAsignacionHasta !== '') {
      tableFilters.push({
        id: 'fechaAsignacionHasta',
        value: this.criteria.fechaAsignacionHasta
      });
    }

    if (this.criteria.solicitudFechaVinculacionDesde !== undefined && this.criteria.solicitudFechaVinculacionDesde != null
      && this.criteria.solicitudFechaVinculacionDesde !== '') {
      tableFilters.push({
        id: 'solicitudFechaVinculacionDesde',
        value: this.criteria.solicitudFechaVinculacionDesde
      });
    }
    if (this.criteria.solicitudFechaVinculacionHasta !== undefined && this.criteria.solicitudFechaVinculacionHasta != null
      && this.criteria.solicitudFechaVinculacionHasta !== '') {
      tableFilters.push({
        id: 'solicitudFechaVinculacionHasta',
        value: this.criteria.solicitudFechaVinculacionHasta
      });
    }
    if (this.criteria.tieneRadicadoSalida !== undefined && this.criteria.tieneRadicadoSalida !== null) {
      tableFilters.push({
        id: 'tieneRadicadoSalida',
        value: this.criteria.tieneRadicadoSalida
      });
    }
    if (this.criteria.directorDeObra !== undefined && this.criteria.directorDeObra !== null) {
      tableFilters.push({
        id: 'directorDeObra',
        value: this.criteria.directorDeObra.id
      });
    }
    return tableFilters;
  }

  /**
   * Método encargado de realizar la inicialización del componente de filtros
   * según criterios definidos por el programador en el componente
   */
  initFilters() {
    if (this.preloadFilters) {
      this.preloadFilters.forEach(filter => {

        if (filter.key === 'id') {
          this.criteria.id = filter.value;
        }

        if (filter.key === 'pk') {
          this.criteria.pk = filter.value;
        }

        if (filter.key === 'civ') {
          this.criteria.civ = filter.value;
        }

        if (filter.key === 'localidadId') {
          this.criteria.localidad = new Localidad();
          this.criteria.localidad.id = +filter.value;
        }

        if (filter.key === 'cuadranteId') {
          this.criteria.cuadrante = new Cuadrante();
          this.criteria.cuadrante.id = +filter.value;
        }
        if (filter.key === 'barrioId') {
          this.criteria.barrio = new Barrio();
          this.criteria.barrio.id = +filter.value;
        }

        if (filter.key === 'zonaId') {
          this.criteria.zona = new Zona();
          this.criteria.zona.id = +filter.value;
        }
        if (filter.key === 'estadoMantenimientoId') {
          this.criteria.estadoMantenimiento = new ListaItem();
          this.criteria.estadoMantenimiento.id = +filter.value;
        }

        if (filter.key === 'tipoSeccionVialId') {
          this.criteria.tipoSeccionVial = new ListaItem();
          this.criteria.tipoSeccionVial.id = +filter.value;
        }

        if (filter.key === 'actividadAgrupada') {
          this.criteria.tipoMalla = new ListaItem();
          this.criteria.tipoMalla.id = + filter.value;
        }

        if (filter.key === 'tipoMallalId') {
          this.criteria.tipoMalla = new ListaItem();
          this.criteria.tipoMalla.id = +filter.value;
        }
        if (filter.key === 'actividadActualId') {
          this.criteria.actividadActualId = filter.value;
        }
        if (filter.key === 'origenId') {
          this.criteria.origen = new ListaItem();
          this.criteria.origen.id = +filter.value;
        }
        if (filter.key === 'solicitudRadicadoEntrada') {
          this.criteria.solicitudRadicadoEntrada = filter.value;
        }
        if (filter.key === 'solicitudRadicadoSalida') {
          this.criteria.solicitudRadicadoSalida = filter.value;
        }
        if (filter.key === 'indicePriorizacion') {
          this.criteria.indicePriorizacion = filter.value;
        }
        if (filter.key === 'indicePriorizacionDesde') {
          this.criteria.indicePriorizacionDesde = filter.value;
        }
        if (filter.key === 'indicePriorizacionHasta') {
          this.criteria.indicePriorizacionHasta = filter.value;
        }
        if (filter.key === 'solicitudFechaVinculacionDesde') {
          this.criteria.solicitudFechaVinculacionDesde = filter.value;
        }
        if (filter.key === 'solicitudFechaVinculacionHasta') {
          this.criteria.solicitudFechaVinculacionHasta = filter.value;
        }
        if (filter.key === 'tieneRadicadoSalida') {
          this.criteria.tieneRadicadoSalida = filter.value;
        }
        if (filter.key === 'posibleDanioRedes') {
          this.criteria.posibleDanioRedes = filter.value;
        }
        if (filter.key === 'fechaAsignacionDesde') {
          this.criteria.fechaAsignacionDesde = filter.value;
        }
        if (filter.key === 'fechaAsignacionHasta') {
          this.criteria.fechaAsignacionHasta = filter.value;
        }
        if (filter.key === 'fechaVencimientoDesde') {
          this.criteria.fechaVencimientoDesde = filter.value;
        }
        if (filter.key === 'fechaVencimientoHasta') {
          this.criteria.fechaVencimientoHasta = filter.value;
        }
        if (filter.key === 'responsableId') {
          this.criteria.responsable = new UsuarioInfo();
          this.criteria.responsable.id = +filter.value;
        }
        if (filter.key === 'ejecutadoPorId') {
          this.criteria.ejecutadoPor = new UsuarioInfo();
          this.criteria.ejecutadoPor.id = +filter.value;
        }
        if (filter.key === 'fechaVisitaTecnicaDesde') {
          this.criteria.fechaVisitaTecnicaDesde = filter.value;
        }
        if (filter.key === 'fechaVisitaTecnicaHasta') {
          this.criteria.fechaVisitaTecnicaHasta = filter.value;
        }
        if (filter.key === 'fechaInstalacionDesde') {
          this.criteria.fechaInstalacionDesde = filter.value;
        }
        if (filter.key === 'fechaInstalacionHasta') {
          this.criteria.fechaInstalacionHasta = filter.value;
        }
        if (filter.key === 'fechaProgramacionVisitaDesde') {
          this.criteria.fechaProgramacionVisitaDesde = filter.value;
        }
        if (filter.key === 'fechaProgramacionVisitaHasta') {
          this.criteria.fechaProgramacionVisitaHasta = filter.value;
        }
        if (filter.key === 'tipoActividadId') {
          this.criteria.tipoActividad = new ListaItem();
          this.criteria.tipoActividad.id = +filter.value;
        }
        if (filter.key === 'enSeguimiento') {
          this.criteria.enSeguimiento = filter.value;
        }
        if (filter.key === 'fechaSeguimientoDesde') {
          this.criteria.fechaSeguimientoDesde = filter.value;
        }
        if (filter.key === 'fechaSeguimientoHasta') {
          this.criteria.fechaSeguimientoHasta = filter.value;
        }
        if (filter.key === 'fechaAsignacionIngenieroDisenioDesde') {
          this.criteria.fechaAsignacionIngenieroDisenioDesde = filter.value;
        }
        if (filter.key === 'fechaAsignacionIngenieroDisenioHasta') {
          this.criteria.fechaAsignacionIngenieroDisenioHasta = filter.value;
        }
        if (filter.key === 'estadoPk') {
          this.criteria.estadoPk = new ListaItem();
          this.criteria.estadoPk.id = + filter.value;
        }
        if (filter.key === 'radicadoSolicitudReserva') {
          this.criteria.radicadoSolicitudReserva = filter.value;
        }
        if (filter.key === 'fechaInstalacionDesde') {
          this.criteria.fechaInstalacionDesde = filter.value;
        }
        if (filter.key === 'fechaInstalacionHasta') {
          this.criteria.fechaInstalacionHasta = filter.value;
        }
        if (filter.key === 'fechaProgramacionIntervencionDesde') {
          this.criteria.fechaProgramacionIntervencionDesde = filter.value;
        }
        if (filter.key === 'fechaProgramacionIntervencionHasta') {
          this.criteria.fechaProgramacionIntervencionHasta = filter.value;
        }
        if (filter.key === 'fechaSolicitudDesde') {
          this.criteria.fechaSolicitudDesde = '';
        }
        if (filter.key === 'fechaSolicitudHasta') {
          this.criteria.fechaSolicitudHasta = '';
        }
        if (filter.key === 'TurnoEjecucion') {
          this.criteria.turnoEjecucion = filter.value;
        }
      });
    }

  }

  /**
   * Método encargado de realizar la asignación de valores predeterminados en el componente de filtros
   * según criterios definidos por el programador en el componente
   */
  defaultCriteria(): void {
    this.actividadActualFromFilter = null;
    if (this.defaultFilters) {
      this.defaultFilters.forEach(filter => {

        if (filter.key === 'id') {
          this.criteria.id = filter.value;
        }

        if (filter.key === 'pk') {
          this.criteria.pk = filter.value;
        }

        if (filter.key === 'civ') {
          this.criteria.pk = filter.value;
        }

        if (filter.key === 'localidadId') {
          this.criteria.localidad = new Localidad();
          this.criteria.localidad.id = +filter.value;
        }

        if (filter.key === 'cuadranteId') {
          this.criteria.cuadrante = new Cuadrante();
          this.criteria.cuadrante.id = +filter.value;
        }
        if (filter.key === 'barrioId') {
          this.criteria.barrio = new Barrio();
          this.criteria.barrio.id = +filter.value;
        }

        if (filter.key === 'zonaId') {
          this.criteria.zona = new Zona();
          this.criteria.zona.id = +filter.value;
        }
        if (filter.key === 'estadoMantenimientoId') {
          this.criteria.estadoMantenimiento = new ListaItem();
          this.criteria.estadoMantenimiento.id = +filter.value;
        }

        if (filter.key === 'tipoSeccionVialId') {
          this.criteria.tipoSeccionVial = new ListaItem();
          this.criteria.tipoSeccionVial.id = +filter.value;
        }
        if (filter.key === 'tipoMallalId') {
          this.criteria.tipoMalla = new ListaItem();
          this.criteria.tipoMalla.id = +filter.value;
        }
        if (filter.key === 'actividadActualId') {
          this.criteria.actividadActualId = filter.value;
        }
        if (filter.key === 'origenId') {
          this.criteria.origen = new ListaItem();
          this.criteria.origen.id = +filter.value;
        }
        if (filter.key === 'solicitudRadicadoEntrada') {
          this.criteria.solicitudRadicadoEntrada = filter.value;
        }
        if (filter.key === 'solicitudRadicadoSalida') {
          this.criteria.solicitudRadicadoSalida = filter.value;
        }
        if (filter.key === 'indicePriorizacion') {
          this.criteria.indicePriorizacion = filter.value;
        }
        if (filter.key === 'indicePriorizacionDesde') {
          this.criteria.indicePriorizacionDesde = filter.value;
        }
        if (filter.key === 'indicePriorizacionHasta') {
          this.criteria.indicePriorizacionHasta = filter.value;
        }
        if (filter.key === 'solicitudFechaVinculacionDesde') {
          this.criteria.solicitudFechaVinculacionDesde = filter.value;
        }
        if (filter.key === 'solicitudFechaVinculacionHasta') {
          this.criteria.solicitudFechaVinculacionHasta = filter.value;
        }
        if (filter.key === 'tieneRadicadoSalida') {
          this.criteria.tieneRadicadoSalida = filter.value;
        }
        if (filter.key === 'posibleDanioRedes') {
          this.criteria.posibleDanioRedes = filter.value;
        }
        if (filter.key === 'fechaAsignacionDesde') {
          this.criteria.fechaAsignacionDesde = filter.value;
        }
        if (filter.key === 'fechaAsignacionHasta') {
          this.criteria.fechaAsignacionHasta = filter.value;
        }
        if (filter.key === 'fechaVencimientoDesde') {
          this.criteria.fechaVencimientoDesde = filter.value;
        }
        if (filter.key === 'fechaVencimientoHasta') {
          this.criteria.fechaVencimientoHasta = filter.value;
        }
        if (filter.key === 'responsableId') {
          this.criteria.responsable = new UsuarioInfo();
          this.criteria.responsable.id = +filter.value;
        }
        if (filter.key === 'ejecutadoPorId') {
          this.criteria.ejecutadoPor = new UsuarioInfo();
          this.criteria.ejecutadoPor.id = +filter.value;
        }
        if (filter.key === 'fechaVisitaTecnicaDesde') {
          this.criteria.fechaVisitaTecnicaDesde = filter.value;
        }
        if (filter.key === 'fechaVisitaTecnicaHasta') {
          this.criteria.fechaVisitaTecnicaHasta = filter.value;
        }
        if (filter.key === 'fechaInstalacionDesde') {
          this.criteria.fechaInstalacionDesde = filter.value;
        }
        if (filter.key === 'fechaInstalacionHasta') {
          this.criteria.fechaInstalacionHasta = filter.value;
        }
        if (filter.key === 'fechaProgramacionVisitaDesde') {
          this.criteria.fechaProgramacionVisitaDesde = filter.value;
        }
        if (filter.key === 'fechaProgramacionVisitaHasta') {
          this.criteria.fechaProgramacionVisitaHasta = filter.value;
        }
        if (filter.key === 'tipoActividadId') {
          this.criteria.tipoActividad = new ListaItem();
          this.criteria.tipoActividad.id = +filter.value;
        }
        if (filter.key === 'enSeguimiento') {
          this.criteria.enSeguimiento = filter.value;
        }
        if (filter.key === 'fechaSeguimientoDesde') {
          this.criteria.fechaSeguimientoDesde = filter.value;
        }
        if (filter.key === 'fechaSeguimientoHasta') {
          this.criteria.fechaSeguimientoHasta = filter.value;
        }
        if (filter.key === 'estadoPk') {
          this.criteria.estadoPk = new ListaItem();
          this.criteria.estadoPk.id = + filter.value;
        }
        if (filter.key === 'radicadoSolicitudReserva') {
          this.criteria.radicadoSolicitudReserva = filter.value;
        }
        if (filter.key === 'permisoId') {
          this.criteria.permisoId = filter.value;
        }
        if (filter.key === 'fechaSolicitudDesde') {
          this.criteria.fechaSolicitudDesde = filter.value;
        }
        if (filter.key === 'fechaSolicitudHasta') {
          this.criteria.fechaSolicitudHasta = filter.value;
        }
        if (filter.key === 'directorDeObra') {
          this.criteria.directorDeObra = new UsuarioInfo();
          this.criteria.directorDeObra.id = +filter.value;
        }
        if (filter.key === 'actividadActualProcesoParaleloId') {
          this.criteria.actividadActualProcesoParaleloId = filter.value;
        }
      });
    }
    if (this.transicion) {
      if (this.transicion.condicion) {
        this.criteria.condicionId = this.transicion.condicion.id;
      }
    } else {
      if (this.condicion) {
        this.criteria.condicionId = this.condicion.id;
      }
    }
    if (this.defaultSortGrid && this.keepDefaultFilter) {
      this.criteria.sortBy = this.defaultSortGrid.sortBy;
      this.criteria.sortOrder = this.defaultSortGrid.sortOrder;
    }
  }

  /** Método encargado de realizar la solicitud de busqueda de pks según criterios definidos
   * por el programador e información de filtros realizada por el usuario
   */
  search() {
    this.executeOnSearch.emit({ accion: 'Search' });
    this.searchSeleccionados();
    super.search();
    this.getMapFilter();
    this.filterByPkMap();
  }

  loadBasicGrid() {
    this.defaultCriteria();
    super.search();
  }

  /**
   * Método encargado de realizar la selección de pks en el mapa
   * basandose en los mantenimientos seleccionados
   */
  private filterByPkMap() {
    if (this.pkGridByPk) {
      this.pkGridByPk.unsubscribe();
    }
    if (this.criteria.pk !== '' && this.criteria.pk !== null) {
      // tslint:disable-next-line: max-line-length
      this.pkGridByPk = this.dataSource.mantenimientos$.subscribe((mantenimientos: any) => {
        // tslint:disable-next-line: max-line-length
        const mantenimiento = mantenimientos.filter((mantenimientoFilter: any) => (Number(mantenimientoFilter.pk) === Number(this.criteria.pk)));
        if (mantenimiento) {
          this.localizarMantenimientoMapa(mantenimiento[0]);
        }
      });
    }
  }

  filtrarMedianteMapa(filtro: any) {
    this.criteria.barrio = undefined;
    this.criteria.localidad = undefined;
    this.criteria.zona = undefined;
    this.criteria.upla = undefined;
    this.criteria.upz = undefined;
    this.localidades = this.localidadesAll;
    this.barrios = this.barriosAll;
    this.uplas = this.uplasAll;
    switch (filtro.ubicacion) {
      case 'Barrios':
          const barrio = this.barriosAll.find(b => b.nombre === filtro.nombre);
          this.criteria.barrio = barrio;
        break;
      case 'Localidades':
        const localidad = this.localidadesAll.find(l => l.nombre === filtro.nombre);
          this.criteria.localidad = localidad;
         this.cambioLocalidad(localidad);
        break;
      case 'Zonas':
        const zona = this.zonas.find(z => z.nombre === filtro.nombre);
          this.criteria.zona = zona;
          this.cambioZona(zona);
        break;
      case 'UPZs':
        const upz = this.uplasAll.find(u => u.nombre === filtro.nombre);
          console.log('criteria upz' + upz);
          this.criteria.upla = upz;
        break;
    }
    if (this.dataSource) {
      this.dataSource.loadData(this.criteria);
    }
  }

  /** Método encargado de devolver los mantenimiento seleccionados por el usuario */
  public getSeleccionados(): WorkflowMantenimientoModel[] {
    return this._mantenimientosSeleccionados;
  }

  /** Método encargado de devolver la cantidad de los mantenimiento seleccionados por el usuario */
  public getCantidadElementosSeleccionados(): number {
    return this._mantenimientosSeleccionados.length;
  }

  /** Método encargado de localizar los mantenimiento seleccionados por el usuario
   * @param mantenimiento Mantenimiento para el cual se realizará el procesamiento de la información
  */
  localizarMantenimientoMapa(mantenimiento: WorkflowMantenimientoModel) {
    this._mantenimientoLocalizado = mantenimiento;
    this._mantenimientoLocalizadoSubject.next(this._mantenimientoLocalizado);
  }

  /** Método encargado de limpiar la localización de pks en el mapa */
  limpiarLocalizarMantenimientoMapa() {
    this.mapService.getVisor().limpiar();
    this._mantenimientoLocalizado = undefined;
    this._mantenimientoLocalizadoSubject.next(this._mantenimientoLocalizado);
  }

  /** Método ecncargado de gestionar los pks a mostrar al usuario */
  processingFiltersToShow() {
    for (const keyC in this.constants) {
      if (this.filters.includes(keyC)) {
        this.filtersToShow[keyC] = true;
      }
    }

    // Obtiene la lista de zonas
    this._servicioGeneral.cacheList(this.constants.path_administracion_zonas);
    this._servicioGeneral.listQuery$
      .pipe(
        filter((data: any) => (data.path === this.constants.path_administracion_zonas))
      )
      .subscribe((data: any) => {
        data.content.sort((a, b) => a.nombre.localeCompare(b.nombre));
        this.zonas = data.content;
      });

    // Obtiene la lista de localidades
    this._servicioGeneral.cacheList(this.constants.path_administracion_localidades);
    this._servicioGeneral.listQuery$
      .pipe(
        filter((data: any) => (data.path === this.constants.path_administracion_localidades))
      )
      .subscribe((data: any) => {
        data.content.sort((a, b) => a.nombre.localeCompare(b.nombre));
        this.localidadesAll = data.content;
        this.localidades = data.content;
      });

    // Obtiene la lista de barrios
    this._servicioGeneral.cacheList(this.constants.path_administracion_barrios);
    this._servicioGeneral.listQuery$
      .pipe(
        filter((data: any) => (data.path === this.constants.path_administracion_barrios))
      )
      .subscribe((data: any) => {
        data.content.sort((a, b) => a.nombre.localeCompare(b.nombre));
        this.barriosAll = data.content;
        this.barrios = data.content;
      });

    // Obtiene la lista de UPLAS
    this._servicioGeneral.cacheList(this.constants.path_administracion_uplas);
    this._servicioGeneral.listQuery$
      .pipe(
        filter((data: any) => (data.path === this.constants.path_administracion_uplas))
      )
      .subscribe((data: any) => {
        data.content.sort((a, b) => a.nombre.localeCompare(b.nombre));
        this.uplasAll = data.content;
        this.uplas = data.content;
      });

    // Obtiene la lista de cuadrantes
    this._servicioGeneral.cacheList(this.constants.path_administracion_cuadrantes);
    this._servicioGeneral.listQuery$
      .pipe(
        filter((data: any) => (data.path === this.constants.path_administracion_cuadrantes))
      )
      .subscribe((data: any) => {
        this.cuadrantesAll = data.content;
      });
  }

  /** Método ecncargado de gestionar las columnas de la grilla a mostrar al usuario */
  processingColumnsToShow() {
    this.columns = this.columns.filter(item => item !== 'select');
    if ((this.transicionesMasivas.length > 0 && this.transicion) || this.masiveActions || this.showCheckSingle) {
      this.columns.unshift('select');
    }
    if (this.singleActions) {
      this.columns.push('acciones');
    }
  }

  /** Método ecncargado de gestionar las acciones a presentar al usuario para selección individual de pks */
  executeSingleAction(accion: string, mantenimiento: WorkflowMantenimientoModel) {
    this.executeOnSingle.emit({ accion: accion, mantenimiento: mantenimiento, transicion: this.transicion, grid: this });
  }

  /** Método ecncargado de gestionar las acciones a presentar al usuario para selección masiva de pks */
  executeMasiveAction(accion: string) {
    this.executeOnMasiveAction.emit(
      { accion: accion, mantenimientos: this._mantenimientosSeleccionados, transicion: this.transicion, grid: this }
    );
  }

  /** Método que se ejecuta una vez invocada la destrucción del componente */
  ngOnDestroy(): void {
  }

  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(): void {
    this.subscribePaginationAndSoort();
  }

  /**
   * Método encargado de procesar las columnas a retornar en el archivo a exportar
   * @param mantenimiento Mantenimiento para el cual se realizará el procesamiento de la información
  */
  elementToRow(mantenimiento: WorkflowMantenimientoModel): any {
    if (this.tipoGrid === 'Seleccionados') {
      return this.processColumnsToExportSeleccionados(mantenimiento);
    } else {
      return this.processColumnsToExport(mantenimiento);
    }
  }


  /**
   * Método encargado de procesar los datos a retornar en el archivo a exportar
   * @param mantenimiento Mantenimiento para el cual se realizará el procesamiento de la información
  */
  processColumnsToExport(mantenimiento: any): any {
    const datos = {
      posicion: mantenimiento.posicion ? mantenimiento.posicion : '',
      id: mantenimiento.id ? mantenimiento.id : '',
      pk: mantenimiento.pk ? mantenimiento.pk : '',
      civ: mantenimiento.civ ? mantenimiento.civ : '',
      solicitudRadicadoEntrada: mantenimiento.solicitudRadicadoEntrada ? mantenimiento.solicitudRadicadoEntrada : '',
      solicitudFechaVinculacion: mantenimiento.solicitudFechaVinculacion ? mantenimiento.solicitudFechaVinculacion : '',
      solicitudRadicadoSalida: mantenimiento.solicitudRadicadoSalida ? mantenimiento.solicitudRadicadoSalida : '',
      origen: mantenimiento.origen ? mantenimiento.origen : '',
      estadoPk: mantenimiento.estadoPk ? mantenimiento.estadoPk : '',
      fechaAsignacion: mantenimiento.fechaAsignacion ? mantenimiento.fechaAsignacion : '',
      fechaVencimiento: mantenimiento.fechaVencimiento ? mantenimiento.fechaVencimiento : '',
      kmCarrilImpacto: mantenimiento.kmCarrilImpacto ? mantenimiento.kmCarrilImpacto.toFixed(3) : '',
      kmCarrilLineal: mantenimiento.kmCarrilLineal && mantenimiento.kmCarrilLineal !== 0 ? mantenimiento.kmCarrilLineal.toFixed(3) : 0,
      kmCarrilObra: mantenimiento.kmCarrilObra && mantenimiento.kmCarrilObra !== 0 ? mantenimiento.kmCarrilObra.toFixed(3) : 0,
      ancho: mantenimiento.ancho ? mantenimiento.ancho.toFixed(2) : '',
      area: mantenimiento.area ? mantenimiento.area.toFixed(2) : '',
      longitud: mantenimiento.longitud ? mantenimiento.longitud.toFixed(2) : '',
      indicePriorizacion: mantenimiento.indicePriorizacion ? mantenimiento.indicePriorizacion : '',
      responsable: mantenimiento.responsable ? mantenimiento.responsable : '',
      ejecutadoPor: mantenimiento.actividadMantenimientos !== undefined && mantenimiento.actividadMantenimientos !== null &&
      mantenimiento.actividadMantenimientos.length > 0 &&
      mantenimiento.actividadMantenimientos[0].ejecutadoPor !== null ?
      mantenimiento.actividadMantenimientos[0].ejecutadoPor.nombresYapellidos : '',
      responsableVisitaTecnica: mantenimiento.responsableVisitaTecnica ? mantenimiento.responsableVisitaTecnica : '',
      responsableRevision: mantenimiento.responsableRevision ? mantenimiento.responsableRevision : '',
      radicadoSolicitudReserva: mantenimiento.radicadoSolicitudReserva ? mantenimiento.radicadoSolicitudReserva : '',
      radicadoRespuestaReserva: mantenimiento.radicadoRespuestaReserva ? mantenimiento.radicadoRespuestaReserva : '',
      tipoMalla: mantenimiento.tipoMalla != null ? mantenimiento.tipoMalla : '',
      tipoUsoVia: mantenimiento.tipoUsoVia != null ? mantenimiento.tipoUsoVia : '',
      vigencia: mantenimiento.vigencia ? mantenimiento.vigencia : '',
      periodicidad: mantenimiento.periodicidad ? mantenimiento.periodicidad : '',
      periodo: mantenimiento.periodo ? mantenimiento.periodo : '',
      fechaVisitaTecnica: mantenimiento.fechaVisitaTecnica ? mantenimiento.fechaVisitaTecnica : '',
      fechaInstalacion: '',
      radicadoIntervencion: mantenimiento.radicadoIntervencion ? mantenimiento.radicadoIntervencion : '',
      radicadoInterExclusivo: mantenimiento.radicadoIntervencion ? mantenimiento.radicadoIntervencion : '',
      localidad: mantenimiento.localidad ? mantenimiento.localidad : '',
      zona: mantenimiento.zona ? mantenimiento.zona : '',
      barrio: mantenimiento.barrio ? mantenimiento.barrio : '',
      estadoMantenimiento: mantenimiento.estadoMantenimiento ? mantenimiento.estadoMantenimiento : '',
      cuadrante: mantenimiento.cuadrante ? mantenimiento.cuadrante : '',
      cantidadApiques: mantenimiento.cantidadApiques ? mantenimiento.cantidadApiques : '',
      actividadSolicitudApique: '',
      aforos: mantenimiento.aforos === 1 ? 'SI' : 'NO',
      prioritarios: mantenimiento.prioritarios ? mantenimiento.prioritarios : '',
      solicitud: mantenimiento.solicitud ? mantenimiento.solicitud : '',
      tipoActividad: mantenimiento.tipoActividad ? mantenimiento.tipoActividad : '',
      upla: mantenimiento.upla ? mantenimiento.upla : '',
      upz: mantenimiento.upz ? mantenimiento.upz : '',
      actividadActual: mantenimiento.actividadActual ? mantenimiento.actividadActual : '',
      actividad: mantenimiento.actividad ? mantenimiento.actividad : '',
      fechaVisitaDisenio: mantenimiento.fechaVisitaDisenio ? mantenimiento.fechaVisitaDisenio : '',
      requiereApique: mantenimiento.requiereApique === 1 ? 'SI' : 'NO',
      requiereAforo: mantenimiento.requiereAforo === 1 ? 'SI' : 'NO',
      tipoSuperficie: mantenimiento.tipoSuperficie ? mantenimiento.tipoSuperficie : '',
      tipoIntervencion: mantenimiento != null && mantenimiento.tipoSuperficie ?
        mantenimiento.tipoSuperficie && mantenimiento.tipoIntervencionTotal ?
          mantenimiento.tipoSuperficie + ' - ' + mantenimiento.tipoIntervencionTotal : '' : '',
      direccion: mantenimiento.ejeVial && mantenimiento.desde ? mantenimiento.ejeVial + ' N° ' + mantenimiento.desde : '',
      ejeVial: mantenimiento.ejeVial ? mantenimiento.ejeVial : '',
      desde: mantenimiento.desde ? mantenimiento.desde : '',
      hasta: mantenimiento.hasta ? mantenimiento.hasta : '',
      observacionDireccionApique: mantenimiento.observacionDireccionApique ? mantenimiento.observacionDireccionApique : '',
      directorDeObra: mantenimiento.directorObra ? mantenimiento.directorObra : '',
      numeroCarriles: '',
      intervencionAgrupada: '',
      intervencionDetallada: '',
      priorizacionFinal: '',
      fechaInicioVisita: mantenimiento.fechaInicioVisita ? mantenimiento.fechaInicioVisita : '',
      fechaFinVisita: mantenimiento.fechaFinVisita ? mantenimiento.fechaFinVisita : '',
      estadoProgramacion: mantenimiento.estadoProgramacionPk ? mantenimiento.estadoProgramacionPk : '',
      programa: mantenimiento.programa ? mantenimiento.programa : '',
      nomenclatura: mantenimiento.nomenclatura ? mantenimiento.nomenclatura : '',
      estrategia: mantenimiento.estrategia ? mantenimiento.estrategia : '',
      estrategiaIntervencion: mantenimiento.estrategiaIntervencion ? mantenimiento.estrategiaIntervencion : '',
      observacionActividadActual: mantenimiento.ultimaObservacionMantenimientoActividad,
      observacionApiqueUltimaSolicitudApique: '',
      rutasTransporte: mantenimiento.rutasTransporte != null ? mantenimiento.rutasTransporte === true ? 'Si' : 'No' : '',
      levantamientoTopografico: '',
      modulacionLosas: '',
      fichaEvaluacionEstructural: '',
      informacionDeDisenio: '',
      consultaRedes: '',
      posibleDanioRedes: mantenimiento.posibleDanioRedes != null ? mantenimiento.posibleDanioRedes === true ? 'Si' : 'No' : '',
      tieneRadicadoSalida: '',
      tipoRadicadoRespuestaReserva: '',
      fechaAsignacionIngenieroDisenio: mantenimiento.fechaAsignacionIngenieroDisenio,
      ingenieroDisenio: mantenimiento.ingenieroDisenio ? mantenimiento.ingenieroDisenio : '',
      listaIngenierosDisenio: mantenimiento.ingenieroDisenio ? mantenimiento.ingenieroDisenio : '',
      nombreResidenteSocial: mantenimiento.nombreResidenteSocial ? mantenimiento.nombreResidenteSocial : '',
      jornadaProgramacionPeriodica: '',
      fechaSolicitudSmvl: '',
      numeroRadicadoSmvl: '',
      observacionesSmvl: '',
      listaChequeoSmvl: '',
      listaChequeoGasa: '',
      fechaSolicitudGasa: '',
      numeroRadicadoGasa: '',
      observacionesGasa: '',
      estadoProgramacionDiaria: mantenimiento.intervenciones && mantenimiento.intervenciones.length > 0 &&
        mantenimiento.intervenciones[0].programacionesDiarias &&
        mantenimiento.intervenciones[0].programacionesDiarias.length > 0 &&
        mantenimiento.intervenciones[0].programacionesDiarias[0].estado ?
        mantenimiento.intervenciones[0].programacionesDiarias[0].estado.descripcion : '',
      estadoProgramacionVisita: mantenimiento.visitas ? mantenimiento.visitas[0].estadoVisita ?
        mantenimiento.visitas[0].estadoVisita.descripcion : '' : '',
      fechaProgramacionVisita: mantenimiento.fechaProgramacionVisita ? mantenimiento.fechaProgramacionVisita : '',
      numeroMovilVisitaTecnica: mantenimiento.numeroMovilVisitaTecnica ? mantenimiento.numeroMovilVisitaTecnica : '',
      tipoIntervencionPriorizacion: mantenimiento.tipoIntervencionPriorizacion != null ? mantenimiento.tipoIntervencionPriorizacion : '',
      turnoResidenteSocial: mantenimiento.turnoResidenteSocial ? mantenimiento.turnoResidenteSocial : '',
      nombreResidenteAmbiental: mantenimiento.nombreResidenteAmbiental ? mantenimiento.nombreResidenteAmbiental : '',
      turnoResidenteAmbiental: mantenimiento.turnoResidenteAmbiental ? mantenimiento.turnoResidenteAmbiental : '',
      requiereActualizacionDiagnostico: mantenimiento.intervenciones ? mantenimiento.intervenciones[0].requiereActualizacionDiag : '',
      numeroActaIntervencion: mantenimiento.intervenciones ? mantenimiento.intervenciones[0].nroActa : '',
      estadoInspeccionIntervencion: mantenimiento.estadoInspeccionIntervencion ? mantenimiento.estadoInspeccionIntervencion : '',
      fechaProgramacionIntervencion: mantenimiento.fechaProgramacionIntervencion ? mantenimiento.fechaProgramacionIntervencion : '',
      turnoEjecucionIntervencion: mantenimiento.turnoEjecucionIntervencion ? mantenimiento.turnoEjecucionIntervencion : '',
      cantidadArbolesIntervencion: mantenimiento.cantidadArbolesIntervencion ? mantenimiento.cantidadArbolesIntervencion : '',
      cantidadProtArbolesIntervencion: mantenimiento.cantidadProtArbolesIntervencion ? mantenimiento.cantidadProtArbolesIntervencion : '',
      cantidadSumiderosIntervencion: mantenimiento.cantidadSumiderosIntervencion ? mantenimiento.cantidadSumiderosIntervencion : '',
      cantidadProtSumiderosIntervencion:
        mantenimiento.cantidadProtSumiderosIntervencion ? mantenimiento.cantidadProtSumiderosIntervencion : '',
      cantidadEspacioPublicoIntervencion:
        mantenimiento.cantidadEspacioPublicoIntervencion ? mantenimiento.cantidadEspacioPublicoIntervencion : '',
      cantidadEscombrosIntervencion: mantenimiento.cantidadEscombrosIntervencion ? mantenimiento.cantidadEscombrosIntervencion : '',
      destinoEscombrosIntervencion: mantenimiento.destinoEscombrosIntervencion ? mantenimiento.destinoEscombrosIntervencion : '',
      cantidadBanosInervencion: mantenimiento.cantidadBanosInervencion ? mantenimiento.cantidadBanosInervencion : '',
      cantidadBanosMantenIntervencion: mantenimiento.cantidadBanosMantenIntervencion ? mantenimiento.cantidadBanosMantenIntervencion : '',
      fechaSolicitud: '',
      actividadAgrupada: mantenimiento.actividadAgrupada,
      descripcionActividadAgrupada: mantenimiento.descripcionActividadAgrupada,
      duracionPlaneada: mantenimiento.duracionPlaneada,
      jornada: mantenimiento.turnoEjecucionIntervencion ? mantenimiento.turnoEjecucionIntervencion : '',
    };

    const datoAMostrar = {};
    for (const key in datos) {
      if (this.columnsToExport && this.columnsToExport.includes(key)) {
        datoAMostrar[key] = datos[key];
      } else if (this.columns.includes(key)) {
        datoAMostrar[key] = datos[key];
      }
    }
    return datoAMostrar;
  }

  /**
    * Método encargado de procesar las columnas a retornar en el archivo a exportar
    * @param mantenimiento Mantenimiento para el cual se realizará el procesamiento de la información
   */
  processColumnsToExportSeleccionados(mantenimiento: any): any {
    const datos = {
      id: mantenimiento.id ? mantenimiento.id : '',
      pk: mantenimiento.pk ? mantenimiento.pk : '',
      civ: mantenimiento.civ ? mantenimiento.civ : '',
      solicitudRadicadoEntrada: mantenimiento.solicitudRadicadoEntrada ? mantenimiento.solicitudRadicadoEntrada : '',
      solicitudFechaVinculacion: mantenimiento.solicitudFechaVinculacion ? mantenimiento.solicitudFechaVinculacion : '',
      solicitudRadicadoSalida: mantenimiento.solicitudRadicadoSalida ? mantenimiento.solicitudRadicadoSalida : '',
      origen: mantenimiento.origen ? mantenimiento.origen.descripcion : '',
      estadoPk: mantenimiento.estadoPk ? mantenimiento.estadoPk.descripcion : '',
      fechaAsignacion: mantenimiento.fechaAsignacion ? mantenimiento.fechaAsignacion : '',
      fechaVencimiento: mantenimiento.fechaVencimiento ? mantenimiento.fechaVencimiento : '',
      kmCarrilImpacto: mantenimiento.kmCarrilImpacto ? mantenimiento.kmCarrilImpacto.toFixed(3) : '',
      kmCarrilLineal: mantenimiento.kmCarrilLineal !== 0 ? mantenimiento.kmCarrilLineal.toFixed(3) : 0,
      kmCarrilObra: mantenimiento.kmCarrilObra !== 0 ? mantenimiento.kmCarrilObra.toFixed(3) : 0,
      ancho: mantenimiento.ancho ? mantenimiento.ancho.toFixed(2) : '',
      area: mantenimiento.area ? mantenimiento.area.toFixed(2) : '',
      longitud: mantenimiento.longitud ? mantenimiento.longitud.toFixed(2) : '',
      indicePriorizacion: mantenimiento.indicePriorizacion ? mantenimiento.indicePriorizacion : '',
      responsable: mantenimiento.responsable ? mantenimiento.responsable.nombres + ' ' + mantenimiento.responsable.apellidos : '',
      ejecutadoPor: mantenimiento.actividadMantenimientos !== null &&
      mantenimiento.actividadMantenimientos.length > 0 &&
      mantenimiento.actividadMantenimientos[0].ejecutadoPor !== null ?
      mantenimiento.actividadMantenimientos[0].ejecutadoPor.nombresYapellidos : '',
      responsableVisitaTecnica: mantenimiento.visitas && mantenimiento.visitas.length > 0 ?
        mantenimiento.visitas[0].responsable.nombres + ' ' + mantenimiento.visitas[0].responsable.apellidos : '',
      // responsableRevision: mantenimiento.responsableRevision ? mantenimiento.responsableRevision : '',
      radicadoSolicitudReserva: mantenimiento.radicadoSolicitudReserva ? mantenimiento.radicadoSolicitudReserva : '',
      radicadoRespuestaReserva: mantenimiento.radicadoRespuestaReserva ? mantenimiento.radicadoRespuestaReserva : '',
      tipoMalla: mantenimiento.tipoMalla ? mantenimiento.tipoMalla.descripcion : '',
      tipoUsoVia: mantenimiento.tipoUsoVia ? mantenimiento.tipoUsoVia.descripcion : '',
      vigencia: mantenimiento.vigencia ? mantenimiento.vigencia.descripcion : '',
      periodicidad: mantenimiento.periodicidad ? mantenimiento.periodicidad.descripcion : '',
      periodo: mantenimiento.periodo ? mantenimiento.periodo.descripcion : '',
      fechaVisitaTecnica: mantenimiento.fechaVisitaTecnica ? mantenimiento.fechaVisitaTecnica : '',
      fechaInstalacion: '',
      radicadoIntervencion: mantenimiento.radicadoIntervencion ? mantenimiento.radicadoIntervencion : '',
      radicadoInterExclusivo: mantenimiento.radicadoIntervencion ? mantenimiento.radicadoIntervencion : '',
      localidad: mantenimiento.localidad ? mantenimiento.localidad : '',
      zona: mantenimiento.zona ? mantenimiento.zona : '',
      barrio: mantenimiento.barrio ? mantenimiento.barrio : '',
      estadoMantenimiento: mantenimiento.estadoMantenimiento ? mantenimiento.estadoMantenimiento : '',
      cuadrante: mantenimiento.cuadrante ? mantenimiento.cuadrante : '',
      cantidadApiques: mantenimiento.predisenio && mantenimiento.predisenio.solicitudesApique
        && mantenimiento.predisenio.solicitudesApique.length > 0 ? mantenimiento.predisenio.solicitudesApique.length : '',
      actividadSolicitudApique: '',
      aforos: mantenimiento.predisenio && mantenimiento.predisenio.solicitudesApique
        && mantenimiento.predisenio.solicitudesApique.length > 0 ? 'SI' : 'NO',
      prioritarios: mantenimiento.predisenio && mantenimiento.predisenio.solicitudesApique
        && mantenimiento.predisenio.solicitudesApique.length > 0 ?
        mantenimiento.predisenio.solicitudesApique[0].prioritarios : '',
      solicitud: mantenimiento.predisenio && mantenimiento.predisenio.solicitudesApique &&
        mantenimiento.predisenio.solicitudesApique.length > 0 ?
        mantenimiento.predisenio.solicitudesApique[0].solicitud ?
          mantenimiento.predisenio.solicitudesApique[0].solicitud.descripcion : '' : '',
      tipoActividad: mantenimiento.tipoActividad ? mantenimiento.tipoActividad.descripcion : '',
      upla: mantenimiento.upla ? mantenimiento.upla : '',
      upz: mantenimiento.upz ? mantenimiento.upz : '',
      actividadActual: mantenimiento.actividadActual ? mantenimiento.actividadActual.descripcion : '',
      actividad: mantenimiento.actividad ? mantenimiento.actividad : '',
      fechaVisitaDisenio: mantenimiento.fechaVisitaDisenio ? mantenimiento.fechaVisitaDisenio : '',
      requiereApique: mantenimiento.predisenio !== null && mantenimiento.predisenio !== undefined
        && mantenimiento.predisenio.requiereApique !== null ? mantenimiento.requiereApique === 1 ? 'SI' : 'NO' : '',
      requiereAforo: mantenimiento.predisenio !== null && mantenimiento.predisenio !== undefined &&
        mantenimiento.predisenio.requiereAforo !== null ? mantenimiento.requiereAforo === 1 ? 'SI' : 'NO' : '',
      tipoIntervencion: mantenimiento.diagnostico ? mantenimiento.diagnostico.priorizacion ?
        mantenimiento.diagnostico.priorizacion.tipoIntervencion ?
          mantenimiento.diagnostico.priorizacion.tipoIntervencion.descripcion : '' : '' : '',
      direccion: mantenimiento.ejeVial && mantenimiento.desde ? mantenimiento.ejeVial + ' N° ' + mantenimiento.desde : '',
      desde: mantenimiento.desde ? mantenimiento.desde : '',
      ejeVial: mantenimiento.ejeVial ? mantenimiento.ejeVial : '',
      tipoSuperficie: mantenimiento.tipoSuperficie ? mantenimiento.tipoSuperficie.descripcion : '',
      hasta: mantenimiento.hasta ? mantenimiento.hasta : '',
      observacionDireccionApique: mantenimiento.predisenio && mantenimiento.predisenio.solicitudesApique &&
        mantenimiento.predisenio.solicitudesApique.length > 0 ? mantenimiento.observacionDireccionApique : '',
      directorDeObra: mantenimiento.directorObra != null ?
        mantenimiento.directorObra.nombres + ' ' + mantenimiento.directorObra.apellidos : '',
      // numeroCarriles: '',
      intervencionAgrupada: '',
      intervencionDetallada: '',
      priorizacionFinal: '',
      fechaInicioVisita: mantenimiento.fechaInicioVisita ? mantenimiento.fechaInicioVisita : '',
      fechaFinVisita: mantenimiento.fechaFinVisita ? mantenimiento.fechaFinVisita : '',
      estadoProgramacion: mantenimiento.estadoProgramacionPk ? mantenimiento.estadoProgramacionPk : '',
      programa: mantenimiento.programa ? mantenimiento.programa : '',
      nomenclatura: mantenimiento.nomenclatura ? mantenimiento.nomenclatura : '',
      estrategia: mantenimiento.estrategia ? mantenimiento.estrategia : '',
      estrategiaIntervencion: mantenimiento.estrategiaIntervencion ? mantenimiento.estrategiaIntervencion : '',
      observacionActividadActual: mantenimiento.ultimaObservacionMantenimientoActividad,
      observacionApiqueUltimaSolicitudApique: '',
      rutasTransporte: mantenimiento.rutasTransporte != null ? mantenimiento.rutasTransporte === true ? 'Si' : 'No' : '',
      levantamientoTopografico: '',
      modulacionLosas: '',
      fichaEvaluacionEstructural: '',
      informacionDeDisenio: '',
      consultaRedes: '',
      posibleDanioRedes: mantenimiento.posibleDanioRedes != null ? mantenimiento.posibleDanioRedes === true ? 'Si' : 'No' : '',
      tieneRadicadoSalida: '',
      tipoRadicadoRespuestaReserva: '',
      fechaAsignacionIngenieroDisenio: mantenimiento.fechaAsignacionIngenieroDisenio,
      ingenieroDisenio: mantenimiento.ingenieroDisenio ?
        mantenimiento.ingenieroDisenio.nombres + ' ' + mantenimiento.ingenieroDisenio.apellidos : '',
      nombreResidenteSocial: mantenimiento.intervenciones && mantenimiento.intervenciones.length > 0 ?
        mantenimiento.intervenciones[0].residenteSocial ?
          mantenimiento.intervenciones[0].residenteSocial.nombres + ' ' +
          mantenimiento.intervenciones[0].residenteSocial.apellidos : '' : '',
      jornadaProgramacionPeriodica: '',
      fechaSolicitudSmvl: '',
      numeroRadicadoSmvl: '',
      observacionesSmvl: '',
      listaChequeoSmvl: '',
      listaChequeoGasa: '',
      fechaSolicitudGasa: '',
      numeroRadicadoGasa: '',
      observacionesGasa: '',
      estadoProgramacionVisita: mantenimiento.visitas && mantenimiento.visitas.length > 0 ? mantenimiento.visitas[0].estadoVisita ?
        mantenimiento.visitas[0].estadoVisita.descripcion : '' : '',
      fechaProgramacionVisita: mantenimiento.visitas && mantenimiento.visitas.length > 0 ? mantenimiento.visitas[0].fecha : '',
      numeroMovilVisitaTecnica: mantenimiento.visitas && mantenimiento.visitas.length > 0 ? mantenimiento.visitas[0].equipo.movil : '',
      tipoIntervencionPriorizacion: mantenimiento.diagnostico != null ? mantenimiento.diagnostico.priorizacion != null ?
        mantenimiento.diagnostico.priorizacion.tipoIntervencion != null ?
          mantenimiento.diagnostico.priorizacion.tipoIntervencion.descripcion : '' : '' : '',
      turnoResidenteSocial: mantenimiento.intervenciones && mantenimiento.intervenciones.length > 0 ?
        mantenimiento.intervenciones[0].turnoResidenteSocial ?
          mantenimiento.intervenciones[0].turnoResidenteSocial.descripcion : '' : '',
      nombreResidenteAmbiental: mantenimiento.intervenciones && mantenimiento.intervenciones.length > 0
        ? mantenimiento.intervenciones[0].residenteAmbiental ?
          mantenimiento.intervenciones[0].residenteAmbiental.nombres + ' ' +
          mantenimiento.intervenciones[0].residenteAmbiental.apellidos : '' : '',
      turnoResidenteAmbiental: mantenimiento.intervenciones && mantenimiento.intervenciones.length > 0 ?
        mantenimiento.intervenciones[0].turnoResidenteAmbiental ?
          mantenimiento.intervenciones[0].turnoResidenteAmbiental.descripcion : '' : '',
      fechaSolicitud: '',
      descripcionActividadAgrupada: mantenimiento.descripcionActividadAgrupada,
      jornada: mantenimiento.turnoEjecucionIntervencion ? mantenimiento.turnoEjecucionIntervencion : '',
    };
    const datoAMostrar = {};
    for (const key in datos) {
      if (this.columnsToExport.includes(key)) {
        datoAMostrar[key] = datos[key];
      } else if (this.columns.includes(key)) {
        datoAMostrar[key] = datos[key];
      }
    }
    return datoAMostrar;
  }

  /** Método encargado de limpiar los datos del formulario de consulta */
  clear() {
    this.limpiarLocalizarMantenimientoMapa();
    this.processingFiltersToShow();
    this.actividadActualFromFilter = null;
    super.clear(this.tipoGrid);
    this.mapService.getVisor().zoomQuerylocalizar(this.getMapFilter());
  }

  /** Método encargado de desplegar el componente que permite importar información */
  importar(): void {
    let dialogRef: any;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      tipoImportacion: this.funcionalidadImportar
    };
    dialogConfig.width = '70%';

    dialogRef = this.dialog.open(ImportarSeleccionPksComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(
      val => {
        if (val !== undefined && val.length !== 0) {
          this.setMantenimientosSelected(val);
        }
      }
    );
  }

  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo PDF
   */
  export(): void {
    let processedColumns: string[];

    if (this.columnsToExport) {
      processedColumns = this.columnsToExport;
    } else {
      processedColumns = this.columns;
    }

    const headers = {};
    for (const key in this.constants) {
      if (processedColumns.includes(key) && key !== 'select') {
        headers[key] = this.constants[key];
      }
    }
    const order = processedColumns.filter(item => item !== 'select');
    if (!this.confirmFormatToExport) {
      this.exportToFile([headers], order, this.exportTo);
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = '';
      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = true;
      dialogConfig.width = '30%';
      const dialogRef = this.dialog.open(SigmaConfirmFormatToExportComponent, dialogConfig);

      dialogRef.beforeClosed().subscribe(formato => {
        if (formato !== 0) {
          this.exportToFile([headers], order, formato);
        }
      });
    }
  }

  /**
   * Método encargado de gestionar la aplicación de la transicion de forma masiva para varios pks
   * @param event Evento del usuario con los pks a los cuales se les aplicará la transición
  */
  executeMasiveTransition(event: any): void {
    this.executeOnMasiveTransition.emit({ mantenimientos: this._mantenimientosSeleccionados, grid: this });
  }

  /**
   * Método encargado de gestionar el cambio de la actividad actual en el mantenimiento
   * una vez aplicada una transición
   */
  changeActividadActualId() {
    this.criteria.actividadActualId = this.actividadActualFromFilter.id.toString();
  }

  /** Método encargado de obtener los filtros por los
   * cuales se realiza la selección de pks en el mapa */
  public getMapFilter(): string {
    let sql = '';
    if (this.transicion) {
      if (this.transicion.condicion) {
        sql = this.getQueryCondicion(this.transicion.condicion);
      }
    } else {
      if (this.condicion) {
        sql = this.getQueryCondicion(this.condicion);
      }
    }

    this.defaultCriteria();
    if (this.criteria) {
      if (this.criteria.getMapQuery().length > 0) {
        if (sql.length > 0) {
          sql = this.criteria.getMapQuery() + ' AND (' + sql + ')';
        } else {
          sql = this.criteria.getMapQuery();
        }
      }
    }

    if (this.criteria.actividadActualProcesoParaleloId !== undefined) {
      if (sql !== '' && this.data.actividad !== undefined) {
        switch (this.data.actividad.proceso.nombre) {
          case 'social':
            sql = sql + ' AND RESIDENTE_SOCIAL_ID = ' + this.usuarioLogueado.id;
            break;
          case 'ambiental':
            sql = sql + ' AND RESIDENTE_AMBIENTAL_ID = ' + this.usuarioLogueado.id;
            break;
          case 'ambientalSST':
            sql = sql + ' AND RESIDENTE_SST_ID = ' + this.usuarioLogueado.id;
            break;
        }
      }
    } else if (this.criteria.permisoId === null) {
      if (sql !== '') {
        // tslint:disable-next-line: max-line-length
        sql = sql + ' AND (' + this.getFieldResponsableForMap() + ' = ' + this.usuarioLogueado.id + ' OR ' + this.getFieldResponsableForMap() + ' IS NULL )';
      } else {
        sql = this.getFieldResponsableForMap() + '=' + this.usuarioLogueado.id;
      }
    }

    if (sql.endsWith('AND ( ( (')) {
      sql = sql.replace('AND ( ( (', '');
    }
    this._mapQuery = sql;
    this._mapQuerySubject.next(this._mapQuery);
    return sql;
  }

  /**
   * Método encargado de identificar su la transición a aplicar
   * permite procesamiento como masiva o no.
   */
  public esMasiva(): boolean {
    if (typeof this.transicion === 'object') {
      return this.transicion.esMasiva ? true : false;
    }
    if (this.masiveActions) {
      return true;
    }
    return false;
  }

  /**
   * Método que permite adicionar un pk en el listado de pks seleccionados
   * @param pk Pk a adicionar como seleccionado
  */
  public setPksSeleccionado(pk: any) {
    this.criteria.pk = pk;
    this.loadData();
  }

  /**
   * Método que permite adicionar un pk en el listado de filtros seleccionados
   * @param pk Pk a adicionar como seleccionado
  */
  public setPkFiltro(pk: any) {
    this.criteria.pk = pk;
    this.loadData();
  }

  /**
   * Método encargado de gestionar el cambio de zona reiniciando
   * los valores de localidades, barrios y uplas
   *
   * @param event Evento del usuario con la nueva zona seleccionada
   */
  cambioZona(event: any) {
    if (this.criteria.zona === undefined) {
      this.localidades = this.localidadesAll;
      this.barrios = this.barriosAll;
      this.uplas = this.uplasAll;
    } else {
      this.localidades = this.localidadesAll.filter(l => l.zona !== null && l.zona.id === event.id);
      this.filtrarBarriosYUplaPorZona();
    }
    //this.limpiarDirectorObraXZona(event);
  }

  // /**
  //  * Método encargado de limpiar el filtro del director de obra
  //  *
  //  */
  // limpiarDirectorObraXZona(event: any) {
  //   this.setDirectorObraXZona(undefined);
  //   this.filtersToShow.directorDeObraXZona = false;
  //     setTimeout(() => {
  //       this.filtersToShow.directorDeObraXZona = true;
  //     }, 50);
  // }

  // /**
  //  * Método encargado de complementar la url para el autocompletar de director de obra x zona
  //  *
  //  */
  // getCriteriaDirectorObraZona() {
  //   let result = '&apellidos=&zonaId';

  //   if (this.criteria.zona) {
  //     result += '=' + this.criteria.zona.id;
  //   }
  //   return result;
  // }


  // /**
  //  * Método encargado de actualizar la información del director de obra
  //  *
  //  * @param _director Objeto con la información del director de obra
  //  */
  // public async setDirectorObraXZona(_director: any) {
  //   if (_director) {
  //     this.criteria.directorDeObra = _director;
  //   } else {
  //     this.criteria.directorDeObra = undefined;
  //   }
  // }

  /**
   * Método encargado de gestionar el cambio de localidad reiniciando
   * los valores de barrios y uplas
   *
   * @param event Evento del usuario con la nueva localidad seleccionada
   */
  cambioLocalidad(event: any) {
    this.barrios = [];
    this.uplas = [];
    if (event === undefined) {
      this.filtrarBarriosYUplaPorZona();
    } else {
      for (const barrio of this.barriosAll) {
        for (const localidad of barrio.localidades) {
          if (localidad.id === event.id) {
            this.barrios.push(barrio);
          }
        }
      }

      for (const upla of this.uplasAll) {
        for (const localidad of upla.localidades) {
          if (localidad.id === event.id) {
            this.uplas.push(upla);
          }
        }
      }
      this.criteria.barrio = null;
      this.criteria.upla = null;
    }
  }

  /** Método encargado de realizar el filtro de los barrios y
   * ups según la zona seleccionada */
  filtrarBarriosYUplaPorZona() {
    this.barrios = [];
    this.uplas = [];
    for (const barrio of this.barriosAll) {
      for (const localidad of this.localidades) {
        for (const localidadTem of barrio.localidades) {
          if (localidadTem.id === localidad.id) {
            if (!this.barrios.includes(barrio)) {
              this.barrios.push(barrio);
            }
          }
        }
      }
    }

    for (const upla of this.uplasAll) {
      for (const localidad of this.localidades) {
        for (const localidadTem of upla.localidades) {
          if (localidadTem.id === localidad.id) {
            if (!this.uplas.includes(upla)) {
              this.uplas.push(upla);
            }
          }
        }
      }
    }
    this.criteria.localidad = null;
    this.criteria.barrio = null;
    this.criteria.upla = null;
  }

}
