import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HistorialMantenimientoDatasource } from '../services/historial-mantenimiento.datasource';
import { HistorialMantenimientoService } from '../services/historial-mantenimiento.service';
import { MatPaginator, MatSort, MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { COSNT_MEJORAMIENTO_HISTORIAL_MANTENIMIENTO } from './../historial-mantenimiento.constants';
import { HistorialMantenimientoCriteria } from '../models/historialMantenimiento.criteria.model';
import { Query, Condiciones, Campos, Acciones } from './../models/modelsForQuery.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { environment } from 'src/environments/environment';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { HistorialDetalleComponent } from '../historial-detalle/historial-detalle.component';
import { MapService } from 'src/app/shared/services/map.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { CondicionService } from 'src/app/administracion/transicioncondiciones/services/transicioncondiciones.services';
import { GridMantenimientoCriteria } from 'src/app/shared/component/grid-mantenimientos/model/grid-mantenimiento.criteria.model';
import { Zona } from 'src/app/administracion/ubicaciones/zona/models/zona.model';
import { ZonaService } from 'src/app/administracion/ubicaciones/zona/services/zona.service';
import { Localidad } from 'src/app/administracion/ubicaciones/localidad/models/localidad.model';
import { LocalidadService } from 'src/app/administracion/ubicaciones/localidad/services/localidad.service';
import { BarrioService } from 'src/app/administracion/ubicaciones/barrio/services/barrio.service';
import { Barrio } from 'src/app/administracion/ubicaciones/barrio/models/barrio.model';
import { Upz } from 'src/app/administracion/ubicaciones/upz/models/upz.model';
import { Upla } from 'src/app/administracion/ubicaciones/upla/models/upla.model';
import { Cuadrante } from 'src/app/administracion/ubicaciones/cuadrante/models/cuadrante.model';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { filter } from 'rxjs/operators';
import { HistorialMantenimientoModel } from '../models/historialMantenimiento.model';

/** Componente encargado de gestionar el historial de los mantenimientos */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-historial-list',
  templateUrl: './historial-list.component.html'
})
export class HistorialListComponent implements OnInit, AfterViewInit {

 /** Constantes a usar en el componente */
  constants = COSNT_MEJORAMIENTO_HISTORIAL_MANTENIMIENTO;
  /** Acccion actual que se encuentra ejecutando en el componente */
  currentAction = 'list';
  /** Listado de estados válidos del mapa*/
  estadosPkMapa = ['NULL'];
  /** Bandera que indica si se presentará al usuario el botón trabajar */
  botonTrabajarMapa = false;
  /** Bandera que indica si el mapa se encuentra en selección de másiva de pks */
  seleccionMasivaMapa = true;
  /** Bandera usada para ocultar el botón guardar */
  searchDisabled = true;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /** Columnas de los datos que se exportarán a presionar el botón exportar del componente*/
  dataExport: any = [];
  /** Objeto del mantenimiento que se procesará en el componente */
  mantenimiento: WorkflowMantenimientoModel = new WorkflowMantenimientoModel;
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    pk: this.constants.pk,
    civ: this.constants.civ,
    enSeguimiento: this.constants.enSeguimiento,
    estadoPk: this.constants.estadoPk,
    indicePriorizacion: this.constants.indicePriorizacion,
    tipoMalla: this.constants.tipoMalla,
    actividadAgrupada: this.constants.actividadAgrupada,
    responsable: this.constants.responsable,
    tieneRutasTransporte: this.constants.tieneRutasTransporte,
    usoVia: this.constants.usoViaId,
    localidad: this.constants.localidad,
    fecha: this.constants.fecha,
  }];

  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new HistorialMantenimientoCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new HistorialMantenimientoCriteria();
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: HistorialMantenimientoDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: HistorialMantenimientoDatasource;

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;

  /** Bandera que permite identificar si la
   * consulta a realizar es una consulta avanzada
   **/
  consultaAvanzadaActiva: boolean;
  /** Etiqueta usada para gestionar las búsquedas avanzadas*/
  labelBotonActivarBusquedaAvanzada: string;
  /** Listado de elementos de los elementos de consulta */
  queries = [];
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Condiciones asociadas a las transiciones */
  condiciones = new Condiciones();
  /** Campos de los terminos de la condición */
  campos = new Campos();
  /** Acciones realizadas */
  acciones = new Acciones();
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk', 'mantenimientoId', 'civ', 'enSeguimiento', 'estadoPkNombre', 'indicePriorizacion',
    'tipoMallaNombre', 'actividadAgrupada', 'usuarioNombre',
    'tieneRutasTransporte', 'usoViaNombre', 'localidadNombre', 'fechaInicio', 'acciones'
  ];
  /** Listado de mantenimientos que corresponden a las condiciones */
  mantenimientoFromCondicion: WorkflowMantenimientoModel;

  /** Listado de zonas */
  zonas: Zona[] = [];
  /** Listado de localidades */
  localidadesAll: Localidad[] = [];
  /** Listado de barrios */
  barriosAll: Barrio[] = [];
  /** Listado de localidades seleccionadas */
  localidades: Localidad[] = [];
  /** Listado de barrios seleccionados */
  barrios: Barrio[] = [];
  /** Listado de upzs */
  upzs: Upz[] = [];
  /** Listado de uplas */
  uplas: Upla[] = [];
  /** Listado de todos los cuadrantes */
  cuadrantesAll: Cuadrante[] = [];
  /** Listado de todas las upzs */
  upzsAll: Upz[] = [];
  /** Listado de uplas seleccionadas */
  uplasAll: Upla[] = [];


  /**
   * Método encargado de construir una instancia de componente
   *
   * @param _service Servicio usado en el componente para gestionar las peticiones
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
   * @param mapService Componente usado para gestionar los servicios del mapa
   * @param condicionService Componente usado para gestioanr las condiciones
   * @param _servicioGeneral Componente usado para gestionar los dataSources explicitamente
   */
  constructor(
    private _service: HistorialMantenimientoService,
    private formBuilder: FormBuilder,
    private excelService: ExcelService,
    private dialog: MatDialog,
    private mapService: MapService,
    private utilitiesService: UtilitiesService,
    private condicionService: CondicionService,
    private _servicioGeneral: DataGenericService,
  ) {
    this.criteria = new HistorialMantenimientoCriteria();
    this.dataSource = new HistorialMantenimientoDatasource(this._service);

    this.form = this.formBuilder.group({
      'fileNumber': [],
      'fileText': []
    });

    this.mapService.limpiarMantenimientoIndividual();
    this.mapService.mantenimientoSeleccionado$.subscribe(_mantenimiento => {
      if (_mantenimiento) {
        this.criteria.pk = _mantenimiento.pk;
        this.search();
      }
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    setTimeout(() => {
      this.consultaAvanzadaActiva = false;
      this.labelBotonActivarBusquedaAvanzada = this.constants.activarBusquedaAvanzada;
      this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
      this.search();
      this.queries.push(new Query());

      this.dataSource.loadData(this.criteria, this.consultaAvanzadaActiva);
      this.mapService.getVisor().visible = true;
      this.mapService.getVisor().seleccionMasiva = false;
      this.mapService.getVisor().limpiar();
      this.clear();
    }, 100);
    this.processingFiltersToShow();
  }

  /** Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      this.criteria.page = this.paginator.pageIndex;
      this.criteria.size = this.paginator.pageSize;
      this.dataSource.loadData(this.criteria, this.consultaAvanzadaActiva);
    });

    this.sort.sortChange.subscribe(() => {
      this.criteria.sortBy = this.sort.active;
      this.criteria.sortOrder = this.sort.direction || 'asc';
      this.paginator.pageIndex = 0;
      this.dataSource.loadData(this.criteria, this.consultaAvanzadaActiva);
    });
  }

  /**
   * Método encargado de invocar la petición de consulta
   * al servicio según los criterios definidos
   */
  search() {
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    this.dataSource.loadData(this.criteria, this.consultaAvanzadaActiva);
  }


  /**
   * Método encargado de limpiar los campos de filtros de la grilla
   * y refrescar la grilla.
   */
  clear() {
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key) && this.criteria.hasOwnProperty(key)) {
        this.criteria[key] = '';
      }
    }
    this.queries.splice(0);
    this.localidades = this.localidadesAll;
    this.barrios = this.barriosAll;
    this.upzs = this.upzsAll;
    this.search();
  }

 /**
   * Método encargado de limpiar los campos de filtros avanzados de la grilla
   * y refrescar la grilla.
   */
  clearAvanzada() {
    this.queries = [{ ...new Query() }];
    this.changeQuery();
  }

  /**
   * Métdo encargado de activar la búsqueda avanzada
   */
  activarBusquedaAvanzada() {
    this.queries = [{ ...new Query() }];
    this.criteria.query = '';
    this.criteria.queryURL = '';
    this.validFields();
    this.consultaAvanzadaActiva = !this.consultaAvanzadaActiva;
    this.labelBotonActivarBusquedaAvanzada =
      this.consultaAvanzadaActiva ? this.constants.activarBusquedaPorFiltros : this.constants.activarBusquedaAvanzada;

    this.search();
  }

  /**
   * Método encargado de adicionar sentencia de consulta a
   * la busqueda avanzada
   *
   * @param key Clave con la cual se desea adicionar termino a la consulta
   */
  agregarQuery(key = null): void {
    if (!key) {
      key = this.queries.length;
    }
    this.queries.splice(key, 0, new Query());
    this.validFields();
  }

  /**
   * Método encargado de eliminar una sentencia de la consulta
   * @param key  LLave numerica de la sentencia a eliminar
   */
  eliminarQuery(key: number): void {
    this.queries.splice(key, 1);
    this.changeQuery();
  }

  /** Método encargado de gestionar la consulta
   * cuando el campo ha cambiado de valor
   *
   * @param query Consulta sobre la cual se va a cambiar
   **/
  changeCampo(query) {
    query.value = '';
    query.show = false;

    setTimeout(() => {
      query.show = true;
    }, 250);
    this.changeQuery();
  }

  /** Método encargado de gestionar la consulta
   * cuando la consulta ha cambiado
   **/
  changeQuery(): void {
    this.criteria.query = '';
    this.criteria.queryURL = '';
    // tslint:disable-next-line: forin
    for (const query in this.queries) {
      let queryDate = "TO_DATE(TO_CHAR('~campo~', 'MM/DD/YYYY'), 'MM/DD/YYYY')";
      let typeString = '';
      let campoString = '';
      let accionString = '';
      let typeStringURL = '';
      let campoStringURL = '';
      let accionStringURL = '';

      if (this.queries[query].type) {
        typeString = this.queries[query].type.value ? this.queries[query].type.value : '';
        typeStringURL = this.queries[query].type.value ? this.queries[query].type.valueUrl : '';
      }
      if (this.queries[query].campo.field) {
        if (this.queries[query].campo.type == this.constants.date) {
          campoString = this.queries[query].campo.field ?
            queryDate.replace(/~campo~/g, this.queries[query].campo.field) :
            '';
        } else {
          campoString = this.queries[query].campo.field ? this.queries[query].campo.field : '';
        }
        campoStringURL = this.queries[query].campo.field ? this.queries[query].campo.field : '';
      }
      if (this.queries[query].operador.value) {
        if (this.queries[query].value) {
          if (this.queries[query].campo.type == this.constants.date) {
            accionStringURL = this.queries[query].operador ?
              this.queries[query].operador.symbol + this.queries[query].value.replace(/-/g, '') : '';
            accionString = this.queries[query].operador.valueDate.replace(/~search~/g, this.queries[query].value);
          } else if (this.queries[query].campo.type == this.constants.list) {
            accionStringURL = this.queries[query].operador ?
              this.queries[query].operador.symbol + this.queries[query].value.id : '';
            accionString = this.queries[query].operador.value.replace(/~search~/g, this.queries[query].value.id);
          } else {
            accionStringURL = this.queries[query].operador ?
              this.queries[query].operador.symbol + this.queries[query].value : '';
            accionString = this.queries[query].operador.value.replace(/~search~/g, this.queries[query].value);
          }
        } else {
          accionString = this.queries[query].operador.symbol;
          if (this.queries[query].campo.type == this.constants.date) {
            accionString = this.queries[query].operador.valueDate;
          } else {
            accionString = this.queries[query].operador.value;
          }
        }
      }
      this.criteria.query += typeString + campoString + accionString;
      this.criteria.queryURL += typeStringURL + campoStringURL + accionStringURL;
    }
    this.criteria.query += ';';

    this.validFields();
  }

  /** Método encargado de validar los ítems de los queries */
  validFields() {
    let disable = false;

    for (const item of this.queries) {
      if (item.campo.length <= 0) {
        disable = true;
        break;
      }
      if (item.operador.length <= 0) {
        disable = true;
        break;
      }
      if (item.type.length <= 0) {
        disable = true;
        break;
      }
      if (!item.value) {
        disable = true;
        break;
      }
    }

    this.searchDisabled = disable;
  }

  /**
   * Método encargado de evaluar si el objeto que ingresa por parámetro esta vacío
   * @param obj  Objeto a evaluar
   */
  isEmpty(obj: any) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  /** Métdo encargado de asignar el valor de la consulta al query */
  setValorQuery(value: any, query: Query) {
    query.value = value;
    this.changeQuery();
  }

  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSX() {
    this.cargandoExcel = true;
    this.dataSourceExport = new HistorialMantenimientoDatasource(this._service);

    const total = this.dataSource.totalelementsSubject.value;
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key) && this.criteria.hasOwnProperty(key)) {
        this.criteriaExport[key] = this.criteria[key];
      }
    }

    this.criteriaExport.size = total > environment.grid.excel.maxExport ? environment.grid.excel.maxExport : total;
    this.criteriaExport.page = 0;
    this.dataSourceExport.loadData(this.criteriaExport, this.consultaAvanzadaActiva);
    this.dataSourceExport.loading$.subscribe(response => {
      if (!response) {
        let content = [];
        try {
          content = this.dataSourceExport.historialData.map((historial: any) => {
            return {
              pk: historial.pk,
              civ: historial.civ,
              enSeguimiento: historial.enSeguimiento ? this.constants.si : this.constants.no,
              estadoPk: historial.estadoPkNombre,
              indicePriorizacion: historial.indicePriorizacion,
              tipoMalla: historial.tipoMallaNombre,
              actividadAgrupada: historial.actividadAgrupada,
              responsable: historial.usuarioNombre,
              tieneRutasTransporte: historial.tieneRutasTransporte ? this.constants.si : this.constants.no,
              usoVia: historial.usoViaNombre,
              localidad: historial.localidadNombre,
              fecha: historial.fechaInicio,
            };
          });
        } catch (error) { }
        this.dataExport = [...this.headers, ...content];
        const order = ['pk', 'civ', 'enSeguimiento', 'estadoPk', 'indicePriorizacion',
          'tipoMalla', 'actividadAgrupada', 'responsable',
          'tieneRutasTransporte', 'usoVia', 'localidad', 'fecha'
        ];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'historial', true, order);
        this.cargandoExcel = false;
      }
    });
  }

  /**
   * Método encargado de redireccionar al componente de
   * diagnostico por accion de usuario
   *
   * @param mantenimiento Mantenimiento del cual se desea
   * realizar la petición de diagnóstico
   */
  diagnosticar(mantenimiento: HistorialMantenimientoModel) {
    this.utilitiesService.scrollToTop();
    this.currentAction = this.constants.currentAction.detalleDiagnosticar;
    this .mantenimiento = new WorkflowMantenimientoModel();
    this.mantenimiento.id = mantenimiento.mantenimientoId;
    this.mapService.getVisor().visible = false;
  }

  verificar(mantenimiento: WorkflowMantenimientoModel, hman: HistorialMantenimientoModel) {
      const criteria = new GridMantenimientoCriteria();
      criteria.id = hman.mantenimientoId + '';
    const _this = this;
    this.condicionService.mantenimientosByCondicion(criteria).subscribe(data => {
      if (data.content[0].intervenciones !== null) {
        _this.mantenimientoFromCondicion = data.content[0];
        _this.currentAction = this.constants.currentAction.detalleVisitaIntervencion;
        _this.mantenimiento = data.content[0];
        _this.mapService.getVisor().visible = false;
      } else {
        _this.mantenimientoFromCondicion = null;
        _this.currentAction = this.constants.currentAction.detalleVisitaIntervencion;
      }
      this.utilitiesService.scrollToTop();
    },
      error => {
        console.log('No se encuentran resultados del mantenimiento en evaluacion-Condicion');
      }
    );
  }

  /** Método que se ejecuta una vez invocada la destrucción del componente */
  ngOnDestroy(): void {
    this.mapService.getVisor().ruteoLimpiar();
    this.mapService.getVisor().ocultarRuteo();
    this.mapService.getVisor().inRouting = false;
    this.mapService.disconectGrid();
  }

  /**
   * Método encargado de visualizar los documentos del mantenimiento indicado
   * @param mantenimiento Mantenimiento del cual se desea
   * realizar la petición de diagnóstico
   */
  documentos(mantenimiento: WorkflowMantenimientoModel) {
    this.utilitiesService.scrollToTop();
    this.currentAction = this.constants.currentAction.historicoDocumento;
    this.mantenimiento = mantenimiento;
    this.mapService.getVisor().visible = false;
  }

  /**
   * Método encargado de cerrar la acción actual invocada por el usuario
   */
  closeAccion() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      mensaje: this.constants.deseaSalir
    };
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val == 1) {
          if (location.pathname.split('/').length > 3) {
            this.currentAction = this.constants.currentAction.list;
            this.mapService.getVisor().visible = true;
            this.dataSource = new HistorialMantenimientoDatasource(this._service);
            this.dataSource.loadData(this.criteria, this.consultaAvanzadaActiva);
          }
        }
      }
    );
  }

  /** Método encargado de localizar en el mapa un mantenimiento específico*/
  localizarMantenimientoMapa(mantenimientoHistorial) {
    this.mapService.getVisor().localizar(mantenimientoHistorial);
  }

  /** Método encargado de procesar el listado de filtros a mostrar al usuario */
  processingFiltersToShow() {

    this._servicioGeneral.cacheList(this.constants.path_mejoramiento_lista_zonas);
    this._servicioGeneral.listQuery$
      .pipe(
        filter((data: any) => (data.path === this.constants.path_mejoramiento_lista_zonas))
      )
      .subscribe((data: any) => {
        data.content.sort((a, b) => a.nombre.localeCompare(b.nombre));
        this.zonas = data.content;
      });

    this._servicioGeneral.cacheList(this.constants.path_mejoramiento_lista_localidades);
    this._servicioGeneral.listQuery$
      .pipe(
        filter((data: any) => (data.path === this.constants.path_mejoramiento_lista_localidades))
      )
      .subscribe((data: any) => {
        data.content.sort((a, b) => a.nombre.localeCompare(b.nombre));
        this.localidadesAll = data.content;
        this.localidades = data.content;
      });

    this._servicioGeneral.cacheList(this.constants.path_mejoramiento_lista_barrios);
    this._servicioGeneral.listQuery$
      .pipe(
        filter((data: any) => (data.path === this.constants.path_mejoramiento_lista_barrios))
      )
      .subscribe((data: any) => {
        data.content.sort((a, b) => a.nombre.localeCompare(b.nombre));
        this.barriosAll = data.content;
        this.barrios = data.content;
      });

    this._servicioGeneral.cacheList(this.constants.path_mejoramiento_lista_upz);
    this._servicioGeneral.listQuery$
      .pipe(
        filter((data: any) => (data.path === this.constants.path_mejoramiento_lista_upz))
      )
      .subscribe((data: any) => {
        data.content.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
        this.upzsAll = data.content;
        this.upzs = data.content;
      });

  }

  /** Método encargado de limpiar los modelos de las localidades, barrios
   * y upzs según la zona seleccionada por el usuario
   *
   * @param event Evento con el valor de la zona seleccionado por el usuario
   **/
  cambioZona(event: any) {
    if (this.criteria.zona === undefined) {
      this.localidades = this.localidadesAll;
      this.barrios = this.barriosAll;
      this.upzs = this.upzsAll;
    } else {
      this.localidades = this.localidadesAll.filter(l => l.zona !== null && l.zona.id === event.id);
      this.filtrarBarriosYUpzPorZona();
    }
  }

   /** Método encargado de limpiar los modelos de las barrios
   * y upzs según la localidad seleccionada por el usuario
   *
   * @param event Evento con el valor de la localidad seleccionado por el usuario
   **/
   cambioLocalidad(event: any) {
    this.barrios = [];
    this.upzs = [];
    if (event === undefined) {
      this.filtrarBarriosYUpzPorZona();
    } else {
      for (const barrio of this.barriosAll) {
        for (const localidad of barrio.localidades) {
          if (localidad.id === event.id) {
            this.barrios.push(barrio);
          }
        }
      }

      for (const upz of this.upzsAll) {
        for (const localidad of upz.localidades) {
          if (localidad.id === event.id) {
            this.upzs.push(upz);
          }
        }
      }
      this.criteria.barrio = null;
      this.criteria.upz = null;
    }
  }

  /** Método encargado de realizar la consulta de barrios
   * según upz y zona seleccionada por el usuario
   **/
  filtrarBarriosYUpzPorZona() {
    this.barrios = [];
    this.upzs = [];
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

    for (const upz of this.upzsAll) {
      for (const localidad of this.localidades) {
        for (const localidadTem of upz.localidades) {
          if (localidadTem.id === localidad.id) {
            if (!this.upzs.includes(upz)) {
              this.upzs.push(upz);
            }
          }
        }
      }
    }
    this.criteria.localidad = null;
    this.criteria.barrio = null;
    this.criteria.upz = null;
  }

}
