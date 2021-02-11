import { MantenimientoDocumentoModel } from 'src/app/workflow/models/mantenimientoDocumento.model';
import { DiagnosticoFotoModel } from './../../mejoramiento/diagnostico/models/diagnostico.foto.model';
import { MapService } from 'src/app/shared/services/map.service';
import { ViewChild, QueryList, ViewChildren, AfterViewInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { MantenimientoCriteria } from 'src/app/workflow/criterials/mantenimiento-criteria.model';
import { MantenimientoDatasource } from 'src/app/workflow/datasources/mantenimiento-datasource';
import { CdkTable } from '@angular/cdk/table';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { WorkflowMantenimientoActividadModel } from '../models/workflow-mantenimiento-actividad.model';
import { WorkflowService } from '../services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { SelectionModel } from '@angular/cdk/collections';
import { WorkflowMantenimientoModel } from '../models/workflow-mantenimiento.model';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { DiagnosticoModel } from 'src/app/mejoramiento/diagnostico/models/diagnostico.model';
import { DiagnosticoEncabezadoModel } from 'src/app/mejoramiento/diagnostico/models/diagnostico.encabezado.model';
import { DiagnosticoPriorizacionModel } from 'src/app/mejoramiento/diagnostico/models/diagnostico.priorizacion.model';
import { GridMantenimientosComponent } from 'src/app/shared/component/grid-mantenimientos/grid-mantenimientos.component';
import { DiagnosticoFactorModel } from 'src/app/mejoramiento/diagnostico/models/diagnostico.factor.model';
import { DiagnosticoUnidadMuestraModel } from 'src/app/mejoramiento/diagnostico/models/diagnostico.unidadMuestreo.model';
import { DiagnosticoFallaModel } from 'src/app/mejoramiento/diagnostico/models/diagnostico.falla.model';
import { Observable, of as observableOf, BehaviorSubject } from 'rxjs';

/**
 * clase abstracta usado para unificar y mantener
 * multiples funcionalidades para uso de todos los componentes
 * del sistema
 */

export abstract class BaseComponent implements FormComponent, AfterViewChecked, OnDestroy {
    /** Variables de la actividad */
    /** objeto con datos obtenidos de la petición al servidor */
    mantenimiento: WorkflowMantenimientoModel;
    /** objeto con datos obtenidos de la petición al servidor */
    data: WorkflowMantenimientoActividadModel;
    /** Clón del objeto que se va a modificar información */
    clone: WorkflowMantenimientoModel;
    /** Variable de consttructor del formulario presentado al usuario */
    formBuilder: FormBuilder;
    /** Formulario contenedor del componente */
    forms: FormGroup[] = [];
    /** Servicio para llamado a funcionalidades propias del SIGMA */
    commonService: CommonService;
    /** variable que recibe current action actual  */
    public accion: string;
    /** Acccion actual que se encuentra ejecutando en el componente */
    public currentAction = 'list';
    /** Acccion anterior que se ejecutó en el componente */
    lastAction = 'list';
    /** Variable bandera con la cual se identifica si el componente
    * se encuentra realizando algun procesamiento de información */
    processing = false;
    /** varible booleana para permitir la edición del modulo */
    moduloEdicion = true;
    /**
   * Variable bandera con la cual se identifica si el componente
   * se encuentra realizando el procesamiento de información del 
   * archivo excel a descargar
   */
    cargandoExcel = false;
    /** Definición de las columnas presentadas en la grilla */
    columns = [];
    /** lista que recibe las transiciones masivas a usar */
    transicionesMasivas = [];
    /** lista que recibe las transiciones individuales a usar */
    transicionesIndividuales = [];
    /** variable que recibe diferentes valores de contenido */
    content: any;
    /** variable tipo lista que recibe contenido para asignarlo al data */
    dataLoad: any = [];
    /** tabla en la que se procesará la información */
    @ViewChild('table') table: CdkTable<any>;
    /** componente grid en la que se procesará la información */
    @ViewChildren('grid') grids: QueryList<GridMantenimientosComponent>;
    /** Control de formulario al tab seleccionado */
    tabSeleccionado = new FormControl(0);
    /** objeto privado de tipo GridMantenimientosComponent que recibe
     * valor de grid seleccionado a usar
     */
    private _gridSeleccionada: GridMantenimientosComponent;

    /** Elemento usado para gestionar la paginación de la grilla */
    @ViewChild(MatPaginator)
    paginator: MatPaginator;
    /** Elemento usado para gestionar el ordenamiento de la grilla */
    @ViewChild(MatSort)
    sort: MatSort;
    /**  Columnas de la grilla que se van a exportar */
    dataExport: any = [{}];

    /** Services */
    /** Servicio mantenimiento usado en el componente para gestionar las peticiones */
    servicio: MantenimientoService;
    /** Servicio workflow usado en el componente para gestionar las peticiones */
    workflowService: WorkflowService;
    /** Servicio usado en el componente para peticiones de archivos de Excel */
    excelService: ExcelService;
    /** Componente de utilidades de peticiones a servicios */
    utilitiesServices: UtilitiesService;
    /** Componente usado para abrir un recuadro modal */
    snackBar: MatSnackBar;
    /** Objeto de tipo MantenimientoCriteria con los filtros de la consulta a realizar */
    criteria: MantenimientoCriteria;
    /** Objeto de tipo MantenimientoCriteria con los filtros de la consulta de archivo a exportar */
    criteriaExport: MantenimientoCriteria;
    /** Fuente de conjunto de datos para manejo de grilla del componente */
    dataSource: MantenimientoDatasource;
    /** Fuente de conjunto de datos para manejo de archivo a exportar */
    dataSourceExport: MantenimientoDatasource;
    /** variable sin uso */
    activeRequestSelectPk = null;
    /** variable booleana sin uso */
    processingSelectPk = false;
    /** Componente usado para obtener información del token del usuario */
    tokenStorageService: TokenStorageService;
    /** Componente usado para gestionar información del mapa */
    mapService: MapService = null;

    /** Datasources */
    /** Fuente de conjunto de factores para manejo de grilla del componente */
    factoresDatasource: MatTableDataSource<DiagnosticoFactorModel>;
    /** Fuente de conjunto de fotos para manejo de grilla del componente */
    fotosDatasource: MatTableDataSource<DiagnosticoFotoModel>;
    /** Fuente de conjunto de resultados para manejo de grilla del componente */
    resultadosDatasource: MatTableDataSource<MantenimientoDocumentoModel>;
    /** Fuente de conjunto de muestreos para manejo de grilla del componente */
    muestreosDatasource: MatTableDataSource<DiagnosticoUnidadMuestraModel>;
    /** Fuente de conjunto de fallas para manejo de grilla del componente */
    fallasDatasource: MatTableDataSource<DiagnosticoFallaModel>;

    /** Variables para la aplicación masiva de una transición a un conjunto de mantemientos */
    transicionId: number;
    /** Objeto lista que almacena los ID de los mantenimientos seleccionados */
    mantenimientosIds: Array<number> = [];
    /** Objeto lista que almacena el KM Carril de los mantenimientos seleccionados */
    mantenimientosPksKmsCarril: Array<any> = [];
    /** Objeto selectionModel con mantenimientoModel*/
    selection = new SelectionModel<WorkflowMantenimientoModel>(true, []);
    /** Lista que almacena los Pks seleccionados en la grilla */
    listaPksSelect = [];
    /** variable pública que recibe el total de km a mostrar en el componente */
    public totalkms = 0;
    /** variable pública de tipo boolean que permite setear la grilla */
    public setGrilla = true;
    /** variable numerica que recibe valor de numero de grillas cargadas */
    numberGridsLoaded = 0;
    /** Variable bandera con la cual se identifica si el componente
    * inicial se encuentra realizando algun procesamiento de información */
    firstGridsLoaded = true;

    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    /**
    * Método encargado de construir una instancia de componente
    *
    * @param servicio Servicio usado en el componente para gestionar las peticiones
    * @param commonService Componente usado para invocar los servicios de mantenimiento
    * @param formBuilder Componente usado para Agrupar elementos en el formulario
    * @param workflowService Componente usado para invocar los servicios de workflow
    * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
    * @param utilitiesService Componente de utilidades de peticiones a servicios
    * @param snackBar Componente usado para abrir un recuadro modal
    * @param tokenStorageService Componente usado para obtener información del token del usuario
    * @param dialog Componente gráfico usado para presentar cuadros de dialogo
    * @param mapService Componente usado para gestionar información del mapa
    */
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
    ) {
        this.servicio = servicio;
        this.commonService = commonService;
        this.formBuilder = formBuilder;
        this.workflowService = workflowService;
        this.excelService = excelService;
        this.utilitiesServices = utilitiesServices;
        this.snackBar = snackBar;
        this.tokenStorageService = tokenStorageService;
        this.mapService = mapService;
        this.commonService.responsableId = this.tokenStorageService.getId();
        this.mapService.connectActividad(this);
        this.criteria = new MantenimientoCriteria();
        this.criteriaExport = new MantenimientoCriteria();
        if (this.accion != null) {
            this.currentAction = this.accion;
        }
    }

    /** Método encargado de iniciar la busquedad de Pks */
    initDataSource() {
        this.listaPksSelect = [];
        this.mantenimientosIds = [];

        if (this.paginator) {
            this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
        }
        this.dataSource = new MantenimientoDatasource(this.servicio);
        this.dataSourceExport = new MantenimientoDatasource(this.servicio);

    }

    /** Método encargado de gestionar la paginación de la información de
    *  la grilla usada en el componente
    */
    subscribePaginationAndSoort(): void {
        if (this.paginator) {
            this.paginator.page.subscribe(() => {
                this.criteria.page = this.paginator.pageIndex;
                this.criteria.size = this.paginator.pageSize;
                this.loadData();
            });
            this.sort.sortChange.subscribe(() => {
                this.criteria.sortBy = this.sort.active;
                this.criteria.sortOrder = this.sort.direction || 'asc';
                this.paginator.pageIndex = 0;
                this.loadData();
            });
        }
    }

    /** Método encargado de redireccionar la vista de usuario
     * a la página inicial del menú
     * @param grid grilla del componente inicial a
     * recarga de busqueda de datos
     */
    goHome(grid: GridMantenimientosComponent = null, irACurrentAction_list = true) {
        if (irACurrentAction_list) {
            if (grid != null) {
                grid.search();
            } else {
                this.currentAction = 'list';
                setTimeout(() => {
                    this.seleccionarGrid(0);
                }, 500);
            }
            this.mapService.getVisor().zoomQuerylocalizar(this.mapService.getVisor().definitionExpressionOriginal);
            this.mapService.getVisor().visible = true;
        }
    }

    /**
    * Método encargado de solicitar el listado de los pks al servicio
    */
    loadData(): void {

        this.defaultCriteria();
        if (this.dataSource) {
            this.dataSource.loadData(this.criteria);
        }

        if (typeof this.data.actividad !== 'undefined' &&
            typeof this.data.actividad.transiciones !== 'undefined') {
            this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
            this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
            this.columns = this.columns.filter(item => item !== 'select');
            if (this.transicionesMasivas.length > 0) {
                this.columns.unshift('select');
            }
        }
    }

    /**
    * Método encargado de solicitar el listado de los pks al servicio
    */
    loadDataTable(): void {
        this.defaultCriteria();
        if (this.dataSource) {
            this.dataSource.loadData(this.criteria);
            this.dataSource.matenimientosDataContent$.subscribe((data) => {
                if (data) {
                    this.dataLoad = [];
                    for (const mantenimiento of data) {
                        this.content = mantenimiento;

                        let fechaVisitaT: Date;
                        if (mantenimiento.fechaVisitaTecnica) {
                            fechaVisitaT = this.utilitiesServices.convertStringToDate(mantenimiento.fechaVisitaTecnica);
                            fechaVisitaT.setHours(0, 0, 0, 0);
                        }
                        const hoy = new Date();
                        hoy.setHours(0, 0, 0, 0);
                        if (hoy > fechaVisitaT) {
                            this.content.check = false;
                        } else {
                            this.content.check = true;
                        }
                        this.dataLoad.push(this.content);
                    }
                    this.dataSource.mantenimientosData = this.dataLoad;
                }
            });
        }

        if (typeof this.data.actividad !== 'undefined' &&
            typeof this.data.actividad.transiciones !== 'undefined') {
            this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
            this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
            this.columns = this.columns.filter(item => item !== 'select');
            if (this.transicionesMasivas.length > 0) {
                this.columns.unshift('select');
            }
        }
    }

    /** Método encargado de retornar al tab seleccionado
     * @param tab número de posición del tab a mostrar
    */
    cancel(tab: number = 0) {
        this.currentAction = this.lastAction;
        this.mapService.getVisor().visible = true;
        this.tabSeleccionado.setValue(tab);
    }

    /** Método publico encargado de validar que el formulario
     * este completo y sin errores
     * @param form formulario a evaluar
     */
    public validate(form: FormGroup): boolean {
        // tslint:disable-next-line: forin
        for (const inner in form.controls) {
            if (inner === 'id') {
                form.get(inner).clearValidators();
                form.get(inner).setErrors(null);
            }
            form.get(inner).markAsTouched();
            form.get(inner).updateValueAndValidity();
        }
        return form.valid;
    }

    /** Método encargado de inicializar el componente al ser creada nueva instancia */
    new(): void {
        this.processing = true;
        this.workflowService.get(this.data.actividad.proceso.url, this.data.actividad.url).subscribe((data) => {
            this.data = data;
            this.mantenimiento = JSON.parse(JSON.stringify(data.mantenimiento));
            this.lastAction = this.currentAction;
            this.currentAction = 'create';
            this.processing = false;
        },
            error => {
                this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
            });
    }

    /** Método encargado de salvar todos los cambios realizados de Pks */
    saveAll(irACurrentAction_list = true): void {
        this.processing = true;
        this.workflowService.update(this.data).subscribe(
            data => {
                this.data = data;
                this.processing = false;
                this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
                    duration: 5000,
                    panelClass: ['success-snackbar']
                });
                this.goHome(null, irACurrentAction_list);
            },
            error => {
                this.processing = false;
                this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
            });
    }

    /** Método encargado de salvar cambios de mantenimiento
     * @param currentAction nombre de la vista a retornar
     */
    saveMantenimientoGrid(currentAction: string): void {
        this.loadingSubject.next(true);
        this.workflowService.update(this.data).subscribe(
            data => {
                this.data = data;
                this.mantenimiento = data.mantenimiento;
                this.utilitiesServices.formSuccessMessages('Datos guardados exitosamente!!!', this.snackBar);
                if (currentAction !== null) {
                    this.currentAction = currentAction;
                }
                this.loadingSubject.next(false);
            },
            error => {
                this.utilitiesServices.formErrorMessages( error, this.forms, this.snackBar);
                this.loadingSubject.next(false);
            });
    }

    /** Método encargado de salvar cambios de los mantenimientos
     * @param mantenimientos lista de mantenimientos a actualizar
     */
    saveMantenimientoGridSL(mantenimientos: WorkflowMantenimientoModel[]): void {
        for (const mantenimiento of mantenimientos) {
            this.data.mantenimiento = mantenimiento;
            this.workflowService.update(this.data).subscribe(
                data => {
                    this.data = data;
                    this.mantenimiento = data.mantenimiento;
                    this.utilitiesServices.formSuccessMessages('Datos guardados exitosamente!!!', this.snackBar);
                },
                error => {
                    this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
                });

        }

    }

    /** Método encargado de salvar cambios de mantenimiento
     * del grid actual
    */
    saveMantenimientoGridOnGrid(): void {
        this.workflowService.update(this.data).subscribe(
            data => {
                this.data = data;
                this.mantenimiento = data.mantenimiento;
                this.utilitiesServices.formSuccessMessages('Datos guardados exitosamente!!!', this.snackBar);
                this.loadData();
            },
            error => {
                this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
            });
    }

    /** Método público encargado de aplicar transición a mantenimiento seleccionado
     * @param grid componente seleccionado con mantenimiento a actualizar
     */
    public applySingleTransitionTo(grid: GridMantenimientosComponent = null, showMessageSuccessful = false): void {
        this.utilitiesServices.scrollToTop();
        this.processing = true;
        if (this.data.id) {
            this.workflowService.update(this.data).subscribe(
                data => {
                    this.data = data;
                    this.processing = false;
                    if (showMessageSuccessful) { this.showMessageSuccessful(); }
                    this.goHome();
                },
                error => {
                    this.processing = false;
                    this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
                });
        } else {
            this
                .workflowService.create(this.data).subscribe(
                    data => {
                        this.data = data;
                        this.processing = false;
                        if (showMessageSuccessful) { this.showMessageSuccessful(); }
                        this.goHome();
                    },
                    error => {
                        this.processing = false;
                        this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
                    });
        }
        if (this.data.transicion) {
            this.applyDocumentTransition(this.data.transicion.id, this.data.mantenimiento);
        }
    }

    showMessageSuccessful() {
        this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
            duration: 5000,
            panelClass: ['success-snackbar']
        });
    }

    /** Método enargado de solicitar la ejecución del servicio work retornando el observable del mantenimiento
    * @param mantenimiento mantenimiento al cual se le va a realizar la acción
    * @param process objeto a evaluar y para cambiar valor de variable processing a true
    * */
    work(mantenimiento: WorkflowMantenimientoModel, process: any) {
        if (process) {
            this.processing = true;
        }
        this.workflowService.work(mantenimiento.id, this.data.actividad.id).subscribe((data) => {
            this.data = data;
            this.mantenimiento = JSON.parse(JSON.stringify(data.mantenimiento));

            if (this.mantenimiento.diagnostico == null) {
                this.mantenimiento.diagnostico = new DiagnosticoModel();
            }

            if (this.mantenimiento.diagnostico.encabezado == null) {
                this.mantenimiento.diagnostico.encabezado = new DiagnosticoEncabezadoModel();
            }
            if (this.mantenimiento.diagnostico.priorizacion == null) {
                this.mantenimiento.diagnostico.priorizacion = new DiagnosticoPriorizacionModel();
            }

            if (this.mantenimiento.diagnostico.factores == null) {
                this.mantenimiento.diagnostico.factores = [];
            }

            if (this.mantenimiento.diagnostico.muestreos == null) {
                this.mantenimiento.diagnostico.muestreos = [];
            }

            if (this.mantenimiento.diagnostico.fallas == null) {
                this.mantenimiento.diagnostico.fallas = [];
            }

            this.lastAction = this.currentAction;
            this.currentAction = 'work';
            this.processing = false;
        },
            error => {
                this.processing = false;
                this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
            });
    }


    /** Método encargado de restaurar  */
    defaultCriteria(): void {
        this.criteria.actividadActualId = '' + this.data.actividad.id;
        this.criteria.responsableId = this.tokenStorageService.getId();
    }

    /** Método encargado de invocar la petición de consulta 
    * al servicio según los criterios definidos 
    */
    search(): void {
        this.paginator.pageIndex = 0;
        this.criteria.page = 0;
        this.loadData();
    }

    /**
    * Método encargado de limpiar los campos de filtros de la grilla
    * y refrescar la grilla.
    */
    clear(): void {
        this.mantenimientosIds = [];
        this.listaPksSelect = [];
        this.paginator.pageIndex = 0;
        this.criteria.page = 0;
        const baseQueryElements = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
        for (const key in this.criteria) {
            if (!baseQueryElements.includes(key)) {
                this.criteria[key] = '';
            }
        }
        this.paginator.pageIndex = 0;
        this.loadData();
    }

    /** Método encargado de retornar lista vacía
     * @param element objeto a vaciar
     */
    elementToRow(element: any): any {
        return {};
    }

    /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   * @param headers lista de titulos por columna del archivo a exportar
   * @param order lista del orden a mostrar en el archivo
   * a exportar
   */
    exportToExcel(headers: Array<any>, order: Array<any>): void {
        let alreadyExport = false;
        let exportData: any = [];

        this.cargandoExcel = true;
        const total = this.dataSource.totalelementsSubject.value;
        const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
        for (const key in this.criteria) {
            if (!noLimpiar.includes(key)) {
                this.criteriaExport[key] = this.criteria[key];
            }
        }
        this.criteriaExport.size = total > environment.grid.excel.maxExport ? environment.grid.excel.maxExport : total;
        this.criteriaExport.page = 0;
        this.dataSourceExport.loadData(this.criteriaExport);

        this.dataSourceExport.loading$.subscribe(response => {
            if (!response && !alreadyExport) {
                let content = [];
                try {
                    content = this.dataSourceExport.mantenimientosData.map((mantenimiento: any) =>
                        this.elementToRow(mantenimiento));
                } catch (error) {
                    console.log(error);
                }

                exportData = [...headers, ...content];
                this.excelService.exportAsExcelFileCustom(exportData, 'Mantenimiento', true, order);
                this.cargandoExcel = false;
                alreadyExport = true;
            }
        });
    }

    /** Método asincronico para selección de mantenimientos y calcular sus valores
     * @param mantenimiento objeto mantenimiento seleccionado con el check
     * @param event evento recibido del check seleccionado
      */
    async toggleChecks(mantenimiento: WorkflowMantenimientoModel, event: any) {
        this.listaPksSelect = await this.removeDuplicates(this.listaPksSelect, 'pk');
        if (event.checked) {
            this.listaPksSelect.push(mantenimiento);
        } else {
            this.listaPksSelect.splice(this.listaPksSelect.findIndex(m => m.id === mantenimiento.id), 1);
        }

        this.calcularKmsCarril();
        this.mantenimientosIds = [];
        this.listaPksSelect.forEach(element => {
            this.mantenimientosIds.push(element['id']);
        });
    }

    /** Método encargado de realizar la sumatoria
     * y calcular el km carril de la lista de Pks
     */
    calcularKmsCarril() {
        this.totalkms = 0;
        const thisLocal = this;
        this.listaPksSelect.forEach((element: WorkflowMantenimientoModel) => {
            if (element.tipoMalla != null) {
                if ((element.tipoMalla.valor === 'AR') || (element.tipoMalla.valor === 'RU')) {
                    thisLocal.totalkms = thisLocal.totalkms + (element.area / 3500);
                } else {
                    thisLocal.totalkms = thisLocal.totalkms + (element.area / 3000);
                }
            }
        }
        );
    }

    /** Método encargado de eliminar las propiedades
     * duplicadas retornando lista
     * @param originalArray lista a recorrer
     * @param prop propiedad a evaluar su duplicidad
     */
    removeDuplicates(originalArray, prop) {
        const newArray = [];
        const lookupObject = {};
        // tslint:disable-next-line: forin
        for (const i in originalArray) {
            lookupObject[originalArray[i][prop]] = originalArray[i];
        }
        // tslint:disable-next-line: forin
        for (const i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
        return newArray;
    }

    /** Método encargado de incluir ID de mantenimiento seleccionado
     *  en una lista
     * @param id variable numerica que corresponde al ID
     * del mantenimiento seleccionado
     */
    mantenimientoIsSelected(id: number): Boolean {
        return this.mantenimientosIds.includes(id);
    }

    /** Método público encargado de enviar mantenimientos seleccionados
     * a método que aplica la transición
     * @param event evento del componente que contiene lista de mantenimientos
     * a usar y grid original
     */
    public executeMasiveTransition(event: any): void {
        debugger;
        this.applyMasiveTransitionTo(event.mantenimientos, event.grid);
    }

    /** Método público encargado de aplicar la transición de varios
     * mantenimientos seleccionados y recargar la grilla al finalizar
     * la transición
     * @param mantenimientos lista de mantenimientos a usar
     * @param grid objeto grilla donde se seleccionaron los mantenimientos
     */
    public applyMasiveTransitionTo(
        mantenimientos: WorkflowMantenimientoModel[],
        grid: GridMantenimientosComponent,
        tab: number = null,
        nextAction = 'list')
    {
        this.processing = true;
        const mantenimientosActividad: WorkflowMantenimientoActividadModel[] = [];
        for (const mantenimiento of mantenimientos) {
            const mantenimientoActividad = new WorkflowMantenimientoActividadModel();
            mantenimientoActividad.mantenimiento = mantenimiento;
            mantenimientoActividad.actividad = this.data.actividad;
            mantenimientoActividad.observaciones = this.data.observaciones;
            mantenimientoActividad.transicion = this.data.transicion;
            mantenimientoActividad.usuarioAsignado = this.data.usuarioAsignado;
            mantenimientosActividad.push(mantenimientoActividad);
            if (this.data.transicion) {
                this.applyDocumentTransition(this.data.transicion.id, mantenimiento);
            }
        }
        this.workflowService.createList(mantenimientosActividad).subscribe((data: any) => {
            this.utilitiesServices.scrollToTop();
            this.processing = false;
            if (grid) {
                if (tab) {
                    this.tabSeleccionado.setValue(tab);
                }
                grid.clear();
            } else {
                this.mapService.getVisor().limpiar();
            }
            this.currentAction = nextAction;
        }, error => {
            this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
            this.processing = false;
        });
    }


    /** Método encargado de gestionar la paginación de la información de
    * la grilla usada en el componente
    */

   ngAfterViewChecked() {
        this.numberGridsLoaded = this.grids.toArray().length;
        if (this.firstGridsLoaded === true) {
            setTimeout(() => {
                this.seleccionarGrid(0);
            }, 500);
            this.firstGridsLoaded = false;
        }
        this.subscribePaginationAndSoort();
    }

    /** Método que se ejecuta una vez invocada la destrucción del componente */
    ngOnDestroy(): void {
        this.mapService.getVisor().pksRemoverPuntosControlEscala();
        this.mapService.disconectGrid();
    }

    /** Método público encargado de interconectar la grilla y el mapa
     * del tab seleccionado
     * @param tab número de posición del tab a mostrar
    */
    public seleccionarGrid(tab: number) {
        this._gridSeleccionada = this.grids.toArray()[tab];
        // const sql = this.tokenStorageService.getId();
        this.mapService.connectToGrid(this._gridSeleccionada);
    }

    /** Método encargado de dar valores default según la data evaluada */
    loadDataProgramacion(): void {
        this.defaultCriteria();
        if (this.dataSource) {
            this.dataSource.loadDataProgram(this.criteria);
        }

        if (typeof this.data.actividad !== 'undefined' &&
            typeof this.data.actividad.transiciones !== 'undefined') {
            this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
            this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
            this.columns = this.columns.filter(item => item !== 'select');
            if (this.transicionesMasivas.length > 0) {
                this.columns.unshift('select');
            }
        }
    }

    /** Método encargado de aplicar transición a documentos de mantenimiento
     * @param idTransicion variable numerica referida al ID de transición seleccionada
     * @param mantenimiento objeto mantenimiento que contiene documentos a usar
     */
    applyDocumentTransition(idTransicion: number, mantenimiento: WorkflowMantenimientoModel) {

        this.workflowService.detailTransicion(idTransicion).subscribe(
            transicion => {
                const transicionSeleccionada = transicion;
                if (transicion.transicionEstadoDocumento) {
                    let reporte;
                    let nombreArchivo;
                    let transicionDocumento = null;
                    for (const iTransicionDocumento of transicion.transicionEstadoDocumento) {
                        transicionDocumento = iTransicionDocumento;
                    }
                    let dataTipoReporte = [];
                    if (transicion.actividadInicial.tipoReporte !== null && transicionDocumento !== null) {
                        dataTipoReporte = transicion.actividadInicial.tipoReporte.split(';');
                        if (dataTipoReporte[1] === 'true') {
                            this.mapService.getVisor().imageUrlParameters$.subscribe(url => {
                                reporte = dataTipoReporte[0];
                                nombreArchivo = transicionSeleccionada.actividadInicial.url;
                                while (nombreArchivo.indexOf(' ') > 0) {
                                    nombreArchivo = nombreArchivo.replace(' ', '');
                                }
                                this.servicio.versionarDocumentoTran(mantenimiento.id, url, reporte, nombreArchivo,
                                    transicionDocumento.tipoDocumento.id, transicionDocumento.estadoDocumentoFinal.id,
                                    transicionSeleccionada.id.toString()
                                );
                            });
                        } else {
                            reporte = dataTipoReporte[0];
                            nombreArchivo = transicionSeleccionada.actividadInicial.url;
                            this.servicio.versionarDocumentoTran(mantenimiento.id, mantenimiento.posicionesBox,
                                reporte, nombreArchivo,
                                transicionDocumento.tipoDocumento.id, transicionDocumento.estadoDocumentoFinal.id,
                                transicionSeleccionada.id.toString()
                            );
                        }
                    }
                }

            });

    }
}
