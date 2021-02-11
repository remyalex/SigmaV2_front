import { ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatSnackBar, MatTableDataSource } from '@angular/material';
import { CdkTable } from '@angular/cdk/table';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { CondicionService } from 'src/app/administracion/transicioncondiciones/services/transicioncondiciones.services';
import { environment } from 'src/environments/environment';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { GridMantenimientoDatasource } from './datasources/grid-mantenimientos.datasource';
import { GridMantenimientoCriteria } from './model/grid-mantenimiento.criteria.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { SigmaSumatoriasComponent } from '../sigma-sumatorias/sigma-sumatorias.component';
import { PdfService } from '../../services/pdf.service';
import { GRID_MANTENIMIENTOS_CONSTANTS } from './grid-mantenimientos.constants';

export abstract class BaseGridComponent {

    constants = GRID_MANTENIMIENTOS_CONSTANTS;

    // Variables de la actividad
    data: WorkflowMantenimientoActividadModel;
    mantenimiento: WorkflowMantenimientoModel;
    accion: string;

    // estructura
    @ViewChild('table') table: CdkTable<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    // @ViewChild('tablePksSeleccionados') tablePksSeleccionados: CdkTable<any>;
    dataSourcePksSeleccionados = new MatTableDataSource<WorkflowMantenimientoModel>();
    @ViewChild('paginatorPksSeleccionados') paginatorPksSeleccinados: MatPaginator;
    @ViewChild('sortPksSeleccionados') sortPksSeleccionados: MatSort;

    transicionesMasivas = [];
    transicionesIndividuales = [];
    public procesandoElementosSeleccionados = false;
    // contenidos
    mantenimientos: WorkflowMantenimientoModel[] = [];
    PksSeleccionados: Array<number> = [];
    keepDefaultFilter = true;

    protected _mantenimientosSeleccionados: WorkflowMantenimientoModel[] = [];
    protected _mantenimientosSeleccionadosSubject = new BehaviorSubject<WorkflowMantenimientoModel[]>(this._mantenimientosSeleccionados);
    public mantenimientosSeleccionados$ = this._mantenimientosSeleccionadosSubject.asObservable();

    protected _mapQuery: string;
    protected _mapQuerySubject = new BehaviorSubject<string>(this._mapQuery);
    public mapQuery$ = this._mapQuerySubject.asObservable();

    protected _mantenimientoLocalizado: WorkflowMantenimientoModel;
    protected _mantenimientoLocalizadoSubject = new BehaviorSubject<WorkflowMantenimientoModel>(this._mantenimientoLocalizado);
    public mantenimientoLocalizado$ = this._mantenimientoLocalizadoSubject.asObservable();


    protected _mantenimientoSeleccionado: WorkflowMantenimientoModel;
    protected _mantenimientoSeleccionadoSubject = new BehaviorSubject<WorkflowMantenimientoModel>(this._mantenimientoSeleccionado);
    public mantenimientoSeleccionado$ = this._mantenimientoSeleccionadoSubject.asObservable();

    private _clearSubject = new BehaviorSubject<boolean>(true);
    public clear$ = this._clearSubject.asObservable();

    dataExport: any = [{}];

    // Services
    condicionService: CondicionService;
    workflowService: WorkflowService;
    mantenimientoService: MantenimientoService;
    excelService: ExcelService;
    pdfService: PdfService;
    utilitiesServices: UtilitiesService;
    commonService: CommonService;
    snackBar: MatSnackBar;
    subscription: Subscription;

    // Datasources
    dataSource: GridMantenimientoDatasource;
    dataSourceExport: GridMantenimientoDatasource;

    // criterials
    criteria: GridMantenimientoCriteria = new GridMantenimientoCriteria();
    criteriaExport: GridMantenimientoCriteria;

    // control de peticiones
    activeRequestSelectPk = null;
    processingSelectPk = false;

    // estados de la grid
    processing = false;
    cargandoExcel = false;
    masiveChecked = false;

    tipoGrid = 'Invisible';
    calcularSumatoria: SigmaSumatoriasComponent;

    private FieldMatch = [
        { source: 'ACTIVIDAD', target: 'ACTIVIDAD' },
        { source: 'ACTIVIDAD_AGRUPADA', target: 'ACTIVIDAD_AGRUPADA' },
        { source: 'ANCHO', target: 'ANCHOCALZADA' },
        { source: 'AREA', target: 'AREACALZADA' },
        { source: 'CIV', target: 'CIV' },
        { source: 'DESDE', target: 'DESDE' },
        { source: 'EJE_VIAL', target: 'EJE_VIAL' },
        { source: 'FECHA_REGISTRO_IDU', target: 'FECHAREGISTROIDU' },
        { source: 'FECHA_TERMINACION', target: 'FECHA_TERMINACION' },
        { source: 'FECHA_VISITA_TECNICA', target: 'FECHA_VISITA_TECNICA' },
        { source: 'HASTA', target: 'HASTA' },
        { source: 'LONGITUD', target: 'LONGITUDHORIZONTAL' },
        { source: 'PCI', target: 'PCI' },
        { source: 'PK', target: 'PK_ID_CALZADA' },
        { source: 'SOLICITUD_RADICADO_ENTRADA', target: 'NUMERO_RADICADO_ENTRADA' },
        { source: 'ACTIVIDAD_ACTUAL_ID', target: 'ACTIVIDAD_MANTENIMIENTO_ID' },
        { source: 'BARRIO_ID', target: 'ID_BARRIO' },
        { source: 'CUADRANTE_ID', target: 'ID_CUADRANTE' },
        { source: 'ESTADO_MANTENIMIENTO_ID', target: 'ESTADO_MANTENIMIENTO_ID' },
        { source: 'ESTADO_PK_VALOR', target: 'VALOR_ESTADO_PK' },
        { source: 'LOCALIDAD_ID', target: 'ID_LOCALIDAD' },
        { source: 'RESPONSABLE_ID', target: 'RESPONSABLE_MANTENIMIENTO_ID' },
        { source: 'RESPONSABLE_VISITA_TECNICA', target: 'RESPONSABLE_VISITA' },
        { source: 'SECTOR_ID', target: 'ID_BARRIO' },
        { source: 'TIPO_MALLA_ID', target: 'ID_TIPO_MALLA' },
        { source: 'TIPO_SECCION_VIAL_ID', target: 'ID_TIPO_SECCION_VIAL' },
        { source: 'TIPO_SUPERFICIE_ID', target: 'ID_TIPO_SUPERFICIE' },
        { source: 'UPLA_ID', target: 'ID_UPLA' },
        { source: 'ZONA_ID', target: 'ID_ZONA' },
        { source: 'ID', target: 'ID_MANTENIMIENTO_VIAL' },
        { source: 'TIENE_RESPONSABLE_ASIGNADO', target: 'TIENE_RESPONSABLE_ASIGNADO' },
        { source: 'TIENE_VEHICULO_ASIGNADO', target: 'TIENE_VEHICULO_ASIGNADO' },
        { source: 'TIENE_RUTA', target: 'TIENE_RUTA' },
        { source: 'TIENE_VISITA', target: 'TIENE_VISITA' },
        { source: 'ORIGEN_ID', target: 'ORIGEN_ID' },
        { source: 'RESPONSABLE_ID', target: 'RESPONSABLE_MANTENIMIENTO_ID' },
        { source: 'TIPO_ELEMENTO_ID', target: 'TIPO_ELEMENTO_ID' },
        { source: 'TIPO_ELEMENTO', target: 'DESCRIPCION_ELEMENTO' },
        { source: 'INGENIERO_DISENIO_ID', target: 'INGENIERO_DISENIO_ID' },
        { source: 'ESTADO_PMT_ID', target: 'ESTADO_PMT_ID' },
        { source: 'ACT_ACTUAL_GESTION_SOCIAL_ID', target: 'ACT_ACTUAL_GESTION_SOCIAL_ID' },
        { source: 'ACT_ACTUAL_GESTION_AMBIEN_ID', target: 'ACT_ACTUAL_GESTION_AMBIEN_ID' },
        { source: 'ACT_ACTUAL_GESTION_SST_ID', target: 'ACT_ACTUAL_GESTION_SST_ID' },
        { source: 'ACT_GEST_AMB_SUB_ID', target: 'ACT_GEST_AMB_SUB_ID' },
        { source: 'ESTA_PROC_GEST_AMBI_ID', target: 'ESTA_PROC_GEST_AMBI_ID' },
        { source: 'RESIDENTE_AMBIENTAL_ID', target: 'RESIDENTE_AMBIENTAL_ID' },
        { source: 'RESIDENTE_SOCIAL_ID', target: 'RESIDENTE_SOCIAL_ID' },
        { source: 'RESIDENTE_SST_ID', target: 'RESIDENTE_SST_ID' },
        { source: 'DIRECTOR_OBRA_ID', target: 'DIRECTOR_OBRA_ID' },
        { source: 'TIENE_SOLICITUD_ENSAYO', target: 'TIENE_SOLICITUD_ENSAYO' },
        { source: 'TIENE_SOLICITUD_APIQUE', target: 'TIENE_SOLICITUD_APIQUE' },
        { source: 'TIENE_SOLICITUD_AFORO', target: 'TIENE_SOLICITUD_AFORO' }
    ];

    constructor(
        servicio: CondicionService,
        commonService: CommonService,
        workflowService: WorkflowService,
        excelService: ExcelService,
        pdfService: PdfService,
        utilitiesServices: UtilitiesService,
        snackBar: MatSnackBar,
    ) {
        this.condicionService = servicio;
        this.commonService = commonService;
        this.workflowService = workflowService;
        this.excelService = excelService;
        this.pdfService = pdfService;
        this.utilitiesServices = utilitiesServices;
        this.snackBar = snackBar;
        this.criteria = new GridMantenimientoCriteria();
        this.criteriaExport = new GridMantenimientoCriteria();
        this.initDataSource();
    }

    initDataSource() {
        this._mantenimientosSeleccionados = [];
        this.PksSeleccionados = [];
        this.dataSource = new GridMantenimientoDatasource(this.condicionService);
        this.dataSourceExport = new GridMantenimientoDatasource(this.condicionService);

        if (this.paginator) {
            this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
        }
        this.dataSource = new GridMantenimientoDatasource(this.condicionService);

        this.dataSource.mantenimientos$.subscribe(_mantenimiento => {
            this.mantenimientos = _mantenimiento;
            this.utilitiesServices.scrollToTop();
            // _mantenimiento.map(dataMantenimiento => {
            //     if (dataMantenimiento) {
            //         this.mantenimientos.push(dataMantenimiento);
            //         this.utilitiesServices.scrollToTop();
            //     }
            // });
        });
        this.dataSourceExport = new GridMantenimientoDatasource(this.condicionService);
    }

    public validarMantenimientoDuplicado(mewMantenimiento: any): boolean {
        let result = true;
        this._mantenimientosSeleccionados.forEach(item => {
            if (item.pk === mewMantenimiento.pk) {
                result = false;
            }
        });
        return result;
    }

    subscribePaginationAndSoort(): void {
        this.paginator.page.subscribe(() => {
            this.criteria.page = this.paginator.pageIndex;
            this.criteria.size = this.paginator.pageSize;
            this.loadData();
            this.masiveChecked = false;
        });
        this.sort.sortChange.subscribe(() => {
            this.criteria.sortBy = this.sort.active;
            this.criteria.sortOrder = this.sort.direction || 'asc';
            this.keepDefaultFilter = false;
            this.loadData();
        });
    }

    abstract defaultCriteria();

    loadData(): void {
        this.defaultCriteria();
        if (this.dataSource) {
            this.dataSource.loadData(this.criteria);
        }
    }

    loadTransicion(): void {
        if (typeof this.data.actividad !== 'undefined' &&
            typeof this.data.actividad.transiciones !== 'undefined') {
            this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
            this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);

        }
    }

    search(): void {
        this.paginator.pageIndex = 0;
        this.criteria.page = 0;
        this.loadData();
    }

    clear(tipoGridInternal: string): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.PksSeleccionados = [];
        this._mantenimientosSeleccionados = [];
        this._mantenimientosSeleccionadosSubject.next(this._mantenimientosSeleccionados);
        this._clearSubject.next(true);
        this.masiveChecked = false;
        this.paginator.pageIndex = 0;
        const baseQueryElements = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters', 'getMapQuery'];
        for (const key in this.criteria) {
            if (!baseQueryElements.includes(key)) {
                if ((key.toLowerCase().includes('fecha') && (key.includes('Desde') || key.includes('Hasta')))
                    || (key.toLowerCase().includes('fecha'))) {
                    this.criteria[key] = '';
                } else {
                    this.criteria[key] = null;
                }
            }
        }
        this.criteria.isExport = false;
        this.criteria.page = 0;
        this.keepDefaultFilter = true;
        this.sort.direction = '';
        this.getMapFilter();
        this.setConfigDataSourcePksSeleccionados();
        this.loadData();
        if (this.procesandoElementosSeleccionados) {
            this.procesandoElementosSeleccionados = false;
        }
    }

    public getMantenimientos() {
        const clone = JSON.parse(JSON.stringify(this.mantenimientos));
        return clone;
    }


    abstract elementToRow(element: any);

    exportToFile(headers: Array<any>, order: Array<any>, exportTo: string): void {
        let alreadyExport = false;
        let exportData: any = [];
        this.cargandoExcel = true;

        if (this.tipoGrid === 'Seleccionados') {
            const mantenimientosToExport = this._mantenimientosSeleccionados.map((mantenimiento: any) =>
                this.elementToRow(mantenimiento));
            exportData = [...headers, ...mantenimientosToExport];
            if (exportTo === this.constants.excel) {
                this.excelService.exportAsExcelFileCustom(exportData, 'Mantenimiento', true, order);
            } else {
                this.pdfService.exportPdf('Mantenimiento', headers, mantenimientosToExport);
            }
            this.cargandoExcel = false;
        } else {
            const total = this.dataSource.getTotalElements();
            const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
            for (const key in this.criteria) {
                if (!noLimpiar.includes(key)) {
                    this.criteriaExport[key] = this.criteria[key];
                }
            }
            this.criteriaExport.size = total > environment.grid.excel.maxExport ? environment.grid.excel.maxExport : total;
            this.criteriaExport.page = 0;
            this.criteriaExport.isExport = true;
            this.dataSourceExport.loadData(this.criteriaExport);
            this.dataSourceExport.loading$.subscribe(response => {
                if (!response && !alreadyExport) {
                    let content = [];
                    try {
                        content = this.dataSourceExport.getMantenimientos().map((mantenimiento: any) =>
                            this.elementToRow(mantenimiento));
                    } catch (error) {
                        console.log(error);
                    }
                    exportData = [...headers, ...content];
                    if (exportTo === this.constants.excel) {
                        this.excelService.exportAsExcelFileCustom(exportData, 'Mantenimiento', true, order);
                    } else {
                        const header = this.converArrayObjectToArray(headers, order);
                        const body = this.converArrayDataObjectToArray(content, order);
                        this.pdfService.exportPdf('Mantenimiento', header, body, false);
                    }
                    this.cargandoExcel = false;
                    alreadyExport = true;
                }
            });
        }

    }

    converArrayObjectToArray(obeject: any, order: Array<any>) {
        const array = [];
        const arrayInterno = [];
        for (let i = 0; i < order.length; i++) {
            // tslint:disable-next-line: forin
            for (const label in obeject[0]) {
                if (order[i] === label) {
                    arrayInterno.push(obeject[0][label]);
                }
            }
        }
        array.push(arrayInterno);
        return array;
    }

    converArrayDataObjectToArray(obeject: any, order: Array<any>) {
        const array = [];
        for (let x = 0; x < obeject.length; x++) {
            const arrayInterno = [];
            for (let i = 0; i < order.length; i++) {
                for (const label in obeject[x]) {
                    if (order[i] === label) {
                        arrayInterno.push(obeject[x][label]);
                    }
                }
            }
            array.push(arrayInterno);
        }
        return array;
    }

    async toggleChecks(mantenimiento: WorkflowMantenimientoModel, event: any) {
        if (event.checked) {
            this.addToMantenimientosSelected(mantenimiento);
        } else {
            this.removeFromMantenimientosSelected(mantenimiento);
        }
        if (this.PksSeleccionados.length === this.dataSource.getTotalElements()) {
            this.masiveChecked = true;
        } else {
            this.masiveChecked = false;
        }
    }

    async toggleChecksGridSeleccionados(mantenimiento: WorkflowMantenimientoModel, event: any) {
        this.removeFromMantenimientosSelected(mantenimiento);
    }

    async masterToggle(event) {
        if (!event.checked) {
            this.clearMantenimientosSelected();
            this.setConfigDataSourcePksSeleccionados();
        } else {
            // this.clearMantenimientosSelected();
            this.masiveChecked = true;
            this.setMantenimientosSelected(this.getMantenimientos());
        }
    }

    public clearMantenimientosSelected() {
        this.masiveChecked = false;
        for (const mantenimientoDataSource of this.getMantenimientos()) {
            const posicion = this._mantenimientosSeleccionados.findIndex(m => m.pk === mantenimientoDataSource.pk);
            if (posicion >= 0) {
                this._mantenimientosSeleccionados.splice(posicion, 1);
                this.PksSeleccionados.splice(this.PksSeleccionados.findIndex(pk => pk === mantenimientoDataSource.pk), 1);
            }
        }
        this._mantenimientosSeleccionadosSubject.next(this._mantenimientosSeleccionados);
    }

    public addToMantenimientosSelected(_mantenimiento: WorkflowMantenimientoModel) {
        this._mantenimientosSeleccionados.push(_mantenimiento);
        this._mantenimientosSeleccionadosSubject.next(this._mantenimientosSeleccionados);
        this.PksSeleccionados.push(_mantenimiento.pk);
        this.setConfigDataSourcePksSeleccionados();
    }

    public removeFromMantenimientosSelected(_mantenimiento: WorkflowMantenimientoModel) {
        this.PksSeleccionados.splice(this.PksSeleccionados.findIndex(pk => pk === _mantenimiento.pk), 1);
        const index: number =
            // tslint:disable-next-line: radix
            this._mantenimientosSeleccionados.findIndex(m => parseInt(m.pk.toString()) === parseInt(_mantenimiento.pk.toString()));
        this._mantenimientosSeleccionados.splice(index, 1);
        this._mantenimientosSeleccionadosSubject.next(this._mantenimientosSeleccionados);
        this.setConfigDataSourcePksSeleccionados();
    }

    public setMantenimientosSelected(_mantenimientos: WorkflowMantenimientoModel[]) {
        this.PksSeleccionados = [];
        _mantenimientos.forEach(element => {
            const pkInteger = Number(element.pk);
            this.PksSeleccionados.push(pkInteger);
        });
        this._mantenimientosSeleccionados = _mantenimientos;
        this._mantenimientosSeleccionadosSubject.next(this._mantenimientosSeleccionados);
        this.setConfigDataSourcePksSeleccionados();
    }

    public getMantenimientosSelected(): WorkflowMantenimientoModel[] {
        return this._mantenimientosSeleccionados;
    }

    public setPksSeleccionados(pks: string[]) {
        this.PksSeleccionados = [];
        this._mantenimientosSeleccionados = [];
        if (pks.length > 0) {
            let cantElementosSeleccionadosProcesados = 0;
            this.procesandoElementosSeleccionados = true;
            const _this = this;

            const pksString = pks.join(',');
            pks.forEach(pk => {
                this.PksSeleccionados.push(+pk);
            });
            this.subscription = this.commonService.getMantenimientoPorPKMultiple(pksString).subscribe(m => {

                this._mantenimientosSeleccionados =
                    [...this._mantenimientosSeleccionados, ...m];
                this._mantenimientosSeleccionadosSubject.next(this._mantenimientosSeleccionados);

                cantElementosSeleccionadosProcesados = this._mantenimientosSeleccionados.length + cantElementosSeleccionadosProcesados;
                //if (cantElementosSeleccionadosProcesados === pks.length) {
                this.setConfigDataSourcePksSeleccionados();
                _this.procesandoElementosSeleccionados = false;
                //}

            });
        } else {
            this.dataSourcePksSeleccionados.data = [];
        }
    }

    private setConfigDataSourcePksSeleccionados() {
        this.dataSourcePksSeleccionados.data = this._mantenimientosSeleccionados;
        this.dataSourcePksSeleccionados.paginator = this.paginatorPksSeleccinados;
        this.dataSourcePksSeleccionados.sort = this.sortPksSeleccionados;
        this.searchSeleccionados();
    }

    abstract searchSeleccionados();

    public mantenimientoIsSelected(mantenimiento: WorkflowMantenimientoModel): Boolean {
        return this.PksSeleccionados.includes(Number(mantenimiento.pk));
    }

    sortOnKeys(dict) {

        const sorted = [];
        // tslint:disable-next-line:forin
        for (const key in dict) {
            sorted[sorted.length] = key + ' : ' + dict[key] + '; ';
        }
        sorted.sort();
        return sorted;
    }

    public abstract getMapFilter(): string;

    public getFieldResponsableForMap() {
        const field = this.FieldMatch.find(x => x.source === 'RESPONSABLE_ID');
        return field.target;
    }

    public getQueryCondicion(condicion: WorkflowCondicionModel): string {

        let sql = '';
        let isInicialTerm = true;

        condicion.terminos.forEach(termino => {
            const field = this.FieldMatch.find(x => x.source === termino.atributo);
            if (field || termino.operadorLogico === 'AND (' || termino.operadorLogico === 'OR (' || termino.operadorLogico === ')'
                || termino.operadorLogico === 'AND NOT (' || termino.operadorLogico === 'OR NOT ('
            ) {

                if (termino.operadorLogico.includes('(') || termino.operadorLogico.includes(')')) {
                    if (isInicialTerm) {
                        if (termino.operadorLogico.includes('(')) {
                            if (termino.operadorLogico.includes('NOT')) {
                                sql += ' NOT (';
                            } else {
                                sql += ' (';
                            }
                        }
                    } else {
                        sql += ' ' + termino.operadorLogico;
                    }
                    if (termino.operadorLogico.includes('(')) {
                        isInicialTerm = true;
                    }
                } else {
                    if (!isInicialTerm) {
                        sql += ' ' + termino.operadorLogico;
                    }
                    isInicialTerm = false;
                    sql += ' ' + field.target;
                    if (termino.operador.includes('NULL')) {
                        sql += ' IS ' + termino.operador;
                    } else {
                        sql += ' ' + termino.operador;
                        sql += ' \'' + termino.valor + '\' ';
                    }
                }
            }
        });

        return sql;
    }

}

