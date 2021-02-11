import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialogConfig, MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { KeyValuePair } from '../../../../shared/models/key-value-pair.model';
import { WorkflowCondicionModel } from '../../../models/workflow-condicion.model';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_INVENTARIO_REGISTRO_AMBIENTAL } from './gestion-inventario-ambietal.constant';
import { ElementoAmbientalService } from './services/elemento-ambiental.service';
import { ElementoAmbientalModel } from './models/elemento-ambiental.model';
import { environment } from '../../../../../environments/environment.test';
import { GridMantenimientosComponent } from '../../../../shared/component/grid-mantenimientos/grid-mantenimientos.component';
import { ListaItemsService } from 'src/app/administracion/listas-items/services/listas-items.service';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { CAPAS } from '../../../../shared/visor-mapa/visor-mapa-capas';



@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-realizar-inventario-elementos-ambientales',
  templateUrl: './realizar-inventario-elementos-ambientales.component.html'
})
// tslint:disable-next-line: max-line-length
export class RealizarInventarioElementosAmbientalesComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  @ViewChild('grid') grid: GridMantenimientosComponent;

  elementoAmbientalModel: ElementoAmbientalModel;
 /** Constantes a usar en el componente */
  constants = CONST_INVENTARIO_REGISTRO_AMBIENTAL;
  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  content: any = [];
  dataSourceTable: any = [];
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  enviadaAll = false;
  loader = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: any;
  dataSourceElemento: any;
  lengthList: Number;
  noInfoToShow = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  disableBack = true;
  disableExit = false;
  elementosAmbientales: any = [];
  capa = CAPAS.capas_ambientales_externas.censoArbolado.nombre;
  //  capa = CAPAS.capas_ambientales_externas.censoSumiderosPluvial.nombre;
  currentElements: any = [];
  observaciones: string;
  buttonActive = true;
  nextTransition = false;
  resumen = false;
  elementosTable = true;
  arboleosView: any = [];
  sumiderosView: any = [];
  sumiderosPluvialView: any = [];
  pompeyanoView: any = [];
  plazasView: any = [];
  ePublicosView: any = [];
  elementosTableView = false;
  elementoTitleArboleos = 'Elementos Arbóreos';
  elementoTitleSumiderosAlcantarillado = 'Elementos sumideros sanitario';
  elementoTitleSumiderosPluvial = 'Elementos sumideros pluvial';
  elementoTitleEPPompeyano = 'Elementos pompeyano';
  elementoTitleEPPlaza = 'Elementos Plazas';
  elementoTitleEP_IDU = 'Elementos de espacio público';
  tipoelementoAmbiental: ListaItem;
  listaservice: ListaItemsService
  elementoTitle = this.elementoTitleArboleos;
  nombreLista = 'UMV_INSPECCION_AMB_ELEMENTO';
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'posicion',
    'pk',
    'civ',
    'zona',
    'localidad',
    'nombreResidenteAmbiental',
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk',
    'civ',
    'zona'
  ];
  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente */
  acciones: GridAccion[] = [
    { nombre: 'registrarInventarioAmb', label: 'Registrar inventario ambiental', icono: 'note_add', color: 'primary' },
    { nombre: 'consultarInventarioAmb', label: 'Consultar inventario ambiental', icono: 'visibility', color: 'primary' }
  ];

  columnsPk = [
    'pk',
    'fechaRegistroInventario',
    'localidad',
    'upla',
    'barrio',
    'civ'
  ];

  columnsElemento = ['codigoArbol', 'nombreEspecie', 'idEspecie',
    'objetoId', 'estadoRedSumideroDominio',
    'objetoIdPluv', 'estadoRedSumideroDominioPluv',
    'objetoIdPlazas', 'nombre',
    'objetoIdPom', 'civ',
    'objetoIdEP', 'descripcion',
    'acciones'];
  columnsArboleos = ['codigoArbol', 'nombreEspecie', 'idEspecie'];
  columnsSumiderosAlcantarillado = ['objetoId', 'estadoRedSumideroDominio'];
  columnsSumiderosPluvial = ['objetoIdPluv', 'estadoRedSumideroDominioPluv'];
  columnsPlazas = ['objetoIdPlazas', 'nombre'];
  columnsPompeyano = ['objetoIdPom', 'civ'];
  columnsEP = ['objetoIdEP', 'descripcion'];
  /*
  columnsPlazas = ['PK_ID_PLAZA', 'NOMBRE'];
  columnsPompeyano = ['PK_ID_POMPEYANO', 'CIV'];
  columnsEP = ['PK_ID_CALZADA', 'DESCRIPCION_ELEMENTO'];
  */

  @ViewChild(MatPaginator)
  paginatorEl: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;

  defaulFilters: KeyValuePair[] = [];

  constructor(
    servicio: MantenimientoService,
    commonService: CommonService,
    formBuilder: FormBuilder,
    workflowService: WorkflowService,
    excelService: ExcelService,
    utilitiesServices: UtilitiesService,
    snackBar: MatSnackBar,
    tokenStorageService: TokenStorageService,
    mapService: MapService,
    private dialog: MatDialog,
    private servicioInventario: ElementoAmbientalService
  ) {
    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {

    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      this.columns = this.columns.filter(item => item !== 'select');
      if (this.transicionesMasivas.length > 0) {
        this.columns.unshift('select');
      }
    }
    this.defaulFilters.push({key: 'actividadActualProcesoParaleloId', value: this.data.actividad.id.toString()});
    this.commonService.getCondicionByNombre('PK_REALIZAR_INVENTARIO_ELEMENTOS_AMBIENTALES').subscribe(_condicion => {
      this.condicion = _condicion;
    });

  }

  loadLayerDataOnInit() {
    this._activateLayerVisor();
    this.limpiarElemetosEntidades();
    this._getLayerTypeVisor();
    this.buildElementoTable();
  }

  loadLayerDataOnMove() {

    this._activateLayerVisor();
    this.buildElementoTable();
    this.currentLayerElements();
    this.limpiarElemetosEntidades();
    this.loadDataElemento();
    this.mapService.getVisor().setElementoGeoSeleccionados(this.currentElements);

 }

 /**
  * Método encargado de gestionar la carga de los pks
  * de la grilla al iniciar el componente.
  */
  loadData(): void {
    if (this.mantenimiento.id !== undefined) {
      this.loader = false;
      this.dataSource = new MatTableDataSource(this.dataSourceTable);
      this.lengthList = this.dataSource.filteredData.length;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      if (this.dataSource.filteredData.length <= 0) {
        this.noInfoToShow = true;
      } else {
        this.noInfoToShow = false;
      }

    }
  }

  buildData() {
    this.dataSourceTable = [];
    this.content.fechaRegistroInventario = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(new Date());
    this.content.localidad = this.mantenimiento.localidad;
    this.content.upla = this.mantenimiento.upla;
    this.content.barrio = this.mantenimiento.barrio;
    this.content.civ = this.mantenimiento.civ;
    this.content.pk = this.mantenimiento.pk;
    this.dataSourceTable.push(this.content);
  }

  loadDataElemento(): void {

    this.loader = false;
    this.dataSourceElemento = new MatTableDataSource(this.elementosAmbientales);
    this.lengthList = this.dataSourceElemento.filteredData.length;
    this.dataSourceElemento.sort = this.sort;
    this.dataSourceElemento.paginator = this.paginator;
    if (this.dataSourceElemento.filteredData.length <= 0) {
      this.noInfoToShow = true;
    } else {
      this.noInfoToShow = false;
    }

  }

  buildElementoTable() {
    this.columnsElemento = [];
    if (this.capa === CAPAS.capas_ambientales_externas.censoArbolado.nombre) {
      this.columnsElemento = ['codigoArbol', 'nombreEspecie', 'idEspecie', 'acciones'];
    } else if (this.capa === CAPAS.capas_ambientales_externas.espacioPublicoIDUPlaza.nombre) {
      this.columnsElemento = ['objetoIdPlazas', 'nombre', 'acciones'];
    } else if (this.capa === CAPAS.capas_ambientales_externas.censoSumiderosAlcantarillado.nombre) {
      this.columnsElemento = ['objetoId', 'estadoRedSumideroDominio', 'acciones'];
    } else if (this.capa === CAPAS.capas_ambientales_externas.censoSumiderosPluvial.nombre) {
      this.columnsElemento = ['objetoIdPluv', 'estadoRedSumideroDominioPluv', 'acciones'];
    } else if (this.capa === CAPAS.capas_ambientales_externas.espacioPublicoIDUPompeyano.nombre) {
      this.columnsElemento = ['objetoIdPom', 'civ', 'acciones'];
    } else if (this.capa === CAPAS.capas_ambientales_externas.censoPublicoIDU.nombre) {
      this.columnsElemento = ['objetoIdEP', 'descripcion', 'acciones'];
    }
  }

  executeSingleAction(event) {
    switch (event.accion) {
      case 'registrarInventarioAmb':
        this.registrarInventario(event);
        break;
      case 'consultarInventarioAmb':
        this.consultarInventario(event);
        break;
    }
  }

  registrarInventario(event) {

    if (!event.mantenimiento.intervenciones) {
      this.showMessageSnackBar('El PK no cuenta con una Intervención');
    } else {
      if (!event.mantenimiento.elementoAmbiental) {
        this.startRecorsElement(event);
      } else {
        if (event.mantenimiento.elementoAmbiental.length > 0) {
          if (event.mantenimiento.elementoAmbiental[0].InventarioEncabezadoActual.id !== event.mantenimiento.intervenciones[0].id) {
            this.startRecorsElement(event);
          } else {
            this.showMessageSnackBar('Ya se registro un inventario para el PK seleccionado');
          }
        } else {
          this.startRecorsElement(event);
        }
      }

    }
  }

  consultarInventario(event) {
    if (!event.mantenimiento.elementoAmbiental) {
      this.showMessageSnackBar('El PK no tiene registros asociados');
    } else {
      this.utilitiesServices.scrollToTop();
      this.currentAction = 'consultarInventarioAmb';
      this.nextTransition = true;
      this.mantenimiento = event.mantenimiento;
      this.mapService.getVisor().visible = true;
      this.grid.localizarMantenimientoMapa(this.mantenimiento);
    }
  }

  pkTableBuild() {
    this.buildData();
    this.loadData();
  }

  startRecorsElement(event) {
    this.elementoAmbientalModel = new ElementoAmbientalModel();
    this.disableBack = true;
    this.disableExit = false;

    this.loadLayerDataOnInit();

    this.form = this.formBuilder.group({
      observaciones: [null, Validators.compose([Validators.required, Validators.maxLength(2000)])]
    });

    this.utilitiesServices.scrollToTop();
    this.currentAction = 'registrarInventarioAmb';
    this.mantenimiento = event.mantenimiento;
    this.mapService.getVisor().visible = true;
    this.grid.localizarMantenimientoMapa(this.mantenimiento);

    this.pkTableBuild();
  }

  deleteElement(element: any) {
    if (this.elementosAmbientales.length <= 1) {
      this.elementosAmbientales = [];
    } else {
      this.elementosAmbientales.splice(element, 1);
    }
    this.currentLayerElements();
    this.limpiarElemetosEntidades();
    this.loadDataElemento();
    this.mapService.getVisor().setElementoGeoSeleccionados(this.currentElements);
  }

  currentLayerElements() {
    this.currentElements = [];
    if (this.capa === CAPAS.capas_ambientales_externas.censoArbolado.nombre) {
      if (this.elementosAmbientales.length > 0) {
        for (const element in this.elementosAmbientales) {
          if (this.elementosAmbientales[element].Codigo_Arbol) {
            this.currentElements.push(this.elementosAmbientales[element].Codigo_Arbol);
          }
        }
      }
    } else if (this.capa === CAPAS.capas_ambientales_externas.censoSumiderosAlcantarillado.nombre) {
      if (this.elementosAmbientales.length > 0) {
        for (const element in this.elementosAmbientales) {
          if (this.elementosAmbientales[element].COD_SUMIDERO) {
            this.currentElements.push(this.elementosAmbientales[element].COD_SUMIDERO);
          }
        }
      }
    } else if (this.capa === CAPAS.capas_ambientales_externas.censoSumiderosPluvial.nombre) {
      if (this.elementosAmbientales.length > 0) {
        for (const element in this.elementosAmbientales) {
          if (this.elementosAmbientales[element].COD_SUMIDERO) {
            this.currentElements.push(this.elementosAmbientales[element].COD_SUMIDERO);
          }
        }
      }
    } else if (this.capa === CAPAS.capas_ambientales_externas.espacioPublicoIDUPompeyano.nombre) {
      if (this.elementosAmbientales.length > 0) {
        for (const element in this.elementosAmbientales) {
          if (this.elementosAmbientales[element].PK_ID_POMPEYANO) {
            this.currentElements.push(this.elementosAmbientales[element].PK_ID_POMPEYANO);
          }
        }
      }
    } else if (this.capa === CAPAS.capas_ambientales_externas.espacioPublicoIDUPlaza.nombre) {
      if (this.elementosAmbientales.length > 0) {
        for (const element in this.elementosAmbientales) {
          if (this.elementosAmbientales[element].PK_ID_PLAZA) {
            this.currentElements.push(this.elementosAmbientales[element].PK_ID_PLAZA);
          }
        }
      }
    } else if (this.capa === CAPAS.capas_ambientales_externas.censoPublicoIDU.nombre) {
      if (this.elementosAmbientales.length > 0) {
        for (const element in this.elementosAmbientales) {
          if (this.elementosAmbientales[element].PK_ID_CALZADA) {
            this.currentElements.push(this.elementosAmbientales[element].PK_ID_CALZADA);
          }
        }
      }
    }
  }

  limpiarElemetosEntidades() {
    this.mapService.getVisor().limpiar();
  }

  showMessageSnackBar(message: string) {
    this.snackBar.open(
      message, 'X', {
      duration: 5000,
      panelClass: ['error-snackbar']
    }
    );
  }

  _activateLayerVisor() {
    this.mapService.getVisor().nombreCapaActivaSeleccionable = this.capa;
    this.mapService.getVisor().activarSeleccionCapaInventarioAmbiental(this.capa);
  }

  _getLayerTypeVisor() {
    this.elementosAmbientales = [];
    this.mapService.getVisor().elementosSeleccionadosEntidades$.subscribe(elementosEntidad => {
      this.elementosAmbientales = [];
      this.elementosAmbientales = elementosEntidad;
      this.loadDataElemento();
    });
  }

  back(event) {
    this.currentAction = event.currentAction;
    this.mapService.getVisor().visible = true;
    this.grid.clear();
  }


  onExit() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          this.switchOffVisor();
          this.exitInventarioForm();
          this.grid.clear();
        }
      }
    );
  }

  exitInventarioForm() {
    this.elementosTable = true;
    this.elementosTableView = false;
    this.buttonActive = true;
    this.enviadaAll = false;
    this.nextTransition = false;
    this.resumen = false;
    this.elementoAmbientalModel = new ElementoAmbientalModel();
    this.elementosAmbientales = [];
    this.observaciones = '';
    this.arboleosView = [];
    this.sumiderosView = [];
    this.sumiderosPluvialView = [];
    this.pompeyanoView = [];
    this.plazasView = [];
    this.ePublicosView = [];
    this.capa = CAPAS.capas_ambientales_externas.censoArbolado.nombre;
    this.elementoTitle = this.elementoTitleArboleos;
    this.mapService.getVisor().visible = true;
    this.currentAction = 'list';
  }

  switchOffVisor() {
    this.limpiarElemetosEntidades();
    this.mapService.getVisor().nombreCapaActivaSeleccionable = '';
    this.mapService.getVisor().desactivarSeleccionCapaInventarioAmbiental();
  }


  onBack() {
    if(this.elementosTableView){
      this.buttonActive = true;
      this.elementosTable = true;
      this.elementosTableView = false;
      this.mapService.getVisor().visible = true;
    } else if (this.capa === CAPAS.capas_ambientales_externas.censoSumiderosAlcantarillado.nombre) {
      this.elementosAmbientales = this.arboleosView;
      this.capa = CAPAS.capas_ambientales_externas.censoArbolado.nombre;
      this.elementoTitle = this.elementoTitleArboleos;
      this.observaciones = this.elementoAmbientalModel.observacionesArboles;
      this.disableBack = true;
    } else if (this.capa === CAPAS.capas_ambientales_externas.censoSumiderosPluvial.nombre) {
      this.elementosAmbientales = this.sumiderosView;
      this.capa = CAPAS.capas_ambientales_externas.censoSumiderosAlcantarillado.nombre;
      this.elementoTitle = this.elementoTitleSumiderosAlcantarillado;
      this.observaciones = this.elementoAmbientalModel.observacionesSumideros;
    } else if (this.capa === CAPAS.capas_ambientales_externas.espacioPublicoIDUPompeyano.nombre) {
      this.elementosAmbientales = this.sumiderosPluvialView;
      this.capa = CAPAS.capas_ambientales_externas.censoSumiderosPluvial.nombre;
      this.elementoTitle = this.elementoTitleSumiderosPluvial;
      this.observaciones = this.elementoAmbientalModel.observacionesSumiderosPluv;
    } else if (this.capa === CAPAS.capas_ambientales_externas.espacioPublicoIDUPlaza.nombre) {
      this.elementosAmbientales = this.pompeyanoView;
      this.capa = CAPAS.capas_ambientales_externas.espacioPublicoIDUPompeyano.nombre;
      this.elementoTitle = this.elementoTitleEPPompeyano;
      this.observaciones = this.elementoAmbientalModel.observacionesPompeyano;
    } else if (this.capa === CAPAS.capas_ambientales_externas.censoPublicoIDU.nombre) {
      this.elementosAmbientales = this.plazasView;
      this.capa = CAPAS.capas_ambientales_externas.espacioPublicoIDUPlaza.nombre;
      this.elementoTitle = this.elementoTitleEPPlaza;
      this.observaciones = this.elementoAmbientalModel.observacionesPlazas;
    }

    this.grid.localizarMantenimientoMapa(this.mantenimiento);
    this.loadLayerDataOnMove();

  }


   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.elementoAmbientalModel.mantenimiento = new WorkflowMantenimientoModel();
    this.elementoAmbientalModel.mantenimiento.id = this.mantenimiento.id;
    this.elementoAmbientalModel.cantidadBanos = 0;
    this.elementoAmbientalModel.observacionesBanos = '';
    this.elementoAmbientalModel.intervencionEncabezado = this.mantenimiento.intervenciones[0];

    if (this.capa === CAPAS.capas_ambientales_externas.censoArbolado.nombre) {
      this.arboleosView = this.elementosAmbientales;
      this.elementoAmbientalModel.cantidadArboles = this.elementosAmbientales.length;
      this.elementoAmbientalModel.observacionesArboles = this.observaciones;
      this.elementoAmbientalModel.elementoArboles = JSON.stringify(this.elementosAmbientales);
      this.capa = CAPAS.capas_ambientales_externas.censoSumiderosAlcantarillado.nombre;
      this.elementoTitle = this.elementoTitleSumiderosAlcantarillado;
      this.observaciones = this.elementoAmbientalModel.observacionesSumideros;
      if (this.sumiderosView != undefined && this.sumiderosView != null && this.sumiderosView.length > 0) {
        this.elementosAmbientales = this.sumiderosView;
      } else {
        this.elementosAmbientales = [];
        this.currentElements = [];
      }
      this.disableBack = false;
    } else if (this.capa === CAPAS.capas_ambientales_externas.censoSumiderosAlcantarillado.nombre) {
      this.sumiderosView = this.elementosAmbientales;
      this.elementoAmbientalModel.cantidadSumideros = this.elementosAmbientales.length;
      this.elementoAmbientalModel.observacionesSumideros = this.observaciones;
      this.elementoAmbientalModel.elementoSumideros = JSON.stringify(this.elementosAmbientales);
      this.capa = CAPAS.capas_ambientales_externas.censoSumiderosPluvial.nombre;
      this.elementoTitle = this.elementoTitleSumiderosPluvial;
      this.observaciones = this.elementoAmbientalModel.observacionesSumiderosPluv;
      if (this.sumiderosPluvialView != undefined && this.sumiderosPluvialView != null && this.sumiderosPluvialView.length > 0) {
        this.elementosAmbientales = this.sumiderosPluvialView;
      } else {
        this.elementosAmbientales = [];
        this.currentElements = [];
      }
    } else if (this.capa === CAPAS.capas_ambientales_externas.censoSumiderosPluvial.nombre) {
      this.sumiderosPluvialView = this.elementosAmbientales;
      this.elementoAmbientalModel.cantidadSumiderosPluvial = this.elementosAmbientales.length;
      this.elementoAmbientalModel.observacionesSumiderosPluv = this.observaciones;
      this.elementoAmbientalModel.elementoSumiderosPluvial = JSON.stringify(this.elementosAmbientales);
      this.capa = CAPAS.capas_ambientales_externas.espacioPublicoIDUPompeyano.nombre;
      this.elementoTitle = this.elementoTitleEPPompeyano;
      this.observaciones = this.elementoAmbientalModel.observacionesPompeyano;
      if (this.pompeyanoView != undefined && this.pompeyanoView != null && this.pompeyanoView.length > 0) {
        this.elementosAmbientales = this.pompeyanoView;
      } else {
        this.elementosAmbientales = [];
        this.currentElements = [];
      }
    } else if (this.capa === CAPAS.capas_ambientales_externas.espacioPublicoIDUPompeyano.nombre) {
      this.pompeyanoView = this.elementosAmbientales;
      this.elementoAmbientalModel.cantidadPompeyano = this.elementosAmbientales.length;
      this.elementoAmbientalModel.observacionesPompeyano = this.observaciones;
      this.elementoAmbientalModel.elementoPompeyano = JSON.stringify(this.elementosAmbientales);
      this.capa = CAPAS.capas_ambientales_externas.espacioPublicoIDUPlaza.nombre;
      this.elementoTitle = this.elementoTitleEPPlaza;
      this.observaciones = this.elementoAmbientalModel.observacionesPlazas;
      if (this.plazasView != undefined && this.plazasView != null && this.plazasView.length > 0) {
        this.elementosAmbientales = this.plazasView;
      } else {
        this.elementosAmbientales = [];
        this.currentElements = [];
      }
    } else if (this.capa === CAPAS.capas_ambientales_externas.espacioPublicoIDUPlaza.nombre) {
      this.plazasView = this.elementosAmbientales;
      this.elementoAmbientalModel.cantidadPlazas = this.elementosAmbientales.length;
      this.elementoAmbientalModel.observacionesPlazas = this.observaciones;
      this.elementoAmbientalModel.elementoPlazas = JSON.stringify(this.elementosAmbientales);
      this.capa = CAPAS.capas_ambientales_externas.censoPublicoIDU.nombre;
      this.elementoTitle = this.elementoTitleEP_IDU;
      this.observaciones = this.elementoAmbientalModel.observacionesEspacioP;
      if (this.ePublicosView != undefined && this.ePublicosView != null && this.ePublicosView.length > 0) {
        this.elementosAmbientales = this.ePublicosView;
      } else {
        this.elementosAmbientales = [];
        this.currentElements = [];
      }
    } else if (this.capa === CAPAS.capas_ambientales_externas.censoPublicoIDU.nombre) {
      this.ePublicosView = this.elementosAmbientales;
      this.elementoAmbientalModel.cantidadEspacioPublico = this.elementosAmbientales.length;
      this.elementoAmbientalModel.observacionesEspacioP = this.observaciones;
      this.elementoAmbientalModel.elementoEspacioP = JSON.stringify(this.elementosAmbientales);
      this.buttonActive = false;
      this.elementosTable = false;
      this.elementosTableView = true;
      this.mapService.getVisor().visible = false;
    }

    this.grid.localizarMantenimientoMapa(this.mantenimiento);
    //    this.loadLayerDataOnInit();
    this.loadLayerDataOnMove();
  }

  saveAll() {
    this.enviadaAll = false;
    this.disableBack = true;
    this.disableExit = true;
    if (this.elementoAmbientalModel) {
      this.servicioInventario.create(this.elementoAmbientalModel).subscribe((data) => {
        this.snackBar.open(
          this.constants.successSave, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        }
        );
        this.elementosTable = false;
        this.enviadaAll = true;
        //this.nextTransition = true;
        this.resumen = true;
        this.disableExit = false;
      }, error => {
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
        this.disableBack = false;
        this.disableExit = false;
      });
    }
  }

  executeTransition(): void {
    this.data.mantenimiento = this.mantenimiento;
    this.data.mantenimiento.inventarioAmbiental = true;
    this.applySingleTransitionTo();
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.disableSubmit = true;
    if (this.form.valid === true) {
      this.disableSubmit = true;
      this.save();
    } else {
      this.disableSubmit = false;
      this.enviada = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    // tslint:disable-next-line: forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  ngAfterViewInit() {
    this.mapService.getVisor().activarListadoCapasGestionAmbiental();
  }

  /** Método que se ejecuta una vez invocada la destrucción del componente */
  ngOnDestroy(): void {
    this.mapService.getVisor().desactivarListadoCapasGestionAmbiental();
  }

}
