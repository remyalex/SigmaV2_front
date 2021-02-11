import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatSnackBar, MatTableDataSource } from '@angular/material';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { CONST_APROBAR_ACTAS } from '../aprobar-actas.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { Router } from '@angular/router';
import { ActasCriteria } from '../../actas-vecindad/models/actas-vecindad-criteria.model';
import { ActasVecindadDatasource } from '../../actas-vecindad/services/actas-vecindad.datasource';
import { ActasService } from '../../actas-vecindad/services/actas-vecindad.service';
import { Acta } from '../../actas-vecindad/models/actas-vecindad.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { Subscription } from 'rxjs';
import { WorkflowActividadModel } from 'src/app/workflow/models/workflow-actividad.model';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'sigma-aprobar-actas-aprove',
    templateUrl: './aprobar-actas-aprove.component.html'
})

export class AprobarActasAproveComponent implements OnInit, AfterViewInit {
   /** Constantes a usar en el componente */
  constants = CONST_APROBAR_ACTAS;
    dataSource: ActasVecindadDatasource;
    dataSourceExport: ActasVecindadDatasource;
    workflowService: WorkflowService;
    data: WorkflowMantenimientoActividadModel;
    disableSubmit = false;
    disableSaveAll = true;
    showGestion = false;
    cargandoExcel = false;
    criteria = new ActasCriteria();
    criteriaExport = new ActasCriteria();
    disabledButton = false;
    countAprobar: number;
    countAprobados: number;
    fecha: string;
    consecutivo: string;
    actividad: WorkflowActividadModel;
    transiciones = [];
    private subscription: Subscription;

    columns = [
        'checked',
        'numeralAscendente',
        'noActaVecindad',
        'fecha',
        'aprobado'
    ];

    headers = [{
        numeralAscendente: 'Numeral ascendente',
        noActaVecindad: 'Identificador',
        fecha: 'Fecha registro',
        aprobado: 'Aprobada',
    }];

    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort

    @Output() irAtras = new EventEmitter();

    constructor(
        private servicio: ActasService,
        private dialog: MatDialog,
        private excelService: ExcelService,
        private snackBar: MatSnackBar,
        private utillilb: UtilitiesService,
        private utilitiesServices: UtilitiesService,
        private router: Router,
        workflowService: WorkflowService,
    ) {
        this.workflowService = workflowService;
    }

    loader = true;
    noInfoToShow = false;
    exportOption = true;
    dataEnsayosExport: any = [];

    ngOnInit(): void {
        this.data = new WorkflowMantenimientoActividadModel();
        this.data.mantenimiento = CONST_APROBAR_ACTAS.mObject;
        this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
        this.dataSource = new ActasVecindadDatasource(this.servicio);
        this.subscription = this.servicio.detailActividad(41).subscribe(data => {
            this.actividad = data;
            // this.transiciones = data.transiciones;
        }, error => {
            console.log(error);
        });
        this.loadData();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    search(): void {
        this.paginator.pageIndex = 0;
        this.criteria.page = 0;
        this.loadData();
    }

    Limpiar(): void {
        this.paginator.pageIndex = 0;
        this.criteria.page = 0;
        const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
        for (const key in this.criteria) {
            if (!noLimpiar.includes(key)) {
                this.criteria[key] = '';
            }
        }
        this.paginator.pageIndex = 0;
        this.loadData();
    }

    loadData(): void {
        this.criteria.pk = CONST_APROBAR_ACTAS.mPK;
        this.criteria.aprobado = null;
        this.dataSource.loadData(this.criteria);
    }

    ngAfterViewInit(): void {
        this.paginator.page.subscribe(() => {
            this.criteria.page = this.paginator.pageIndex;
            this.criteria.size = this.paginator.pageSize;
            this.loadData();
        });

        this.sort.sortChange.subscribe(() => {
            this.criteria.sortBy = this.sort.active;
            this.criteria.sortOrder = this.sort.direction || 'asc';
            this.loadData();
        });
    }

    selectAll(event: any) {
        if (this.dataSource.actasData != undefined && this.dataSource.actasData != null) {
            for (var i = 0; i < this.dataSource.actasData.length; i++) {
                this.dataSource.actasData[i].aprobado = event.checked;
            }
        }
    }

    aprobarActas() {
        var f = new Date();
        this.fecha = f.getDate() + "-" + (f.getMonth() + 1) + "-" + f.getFullYear();
        this.consecutivo = f.getDate() + "" + (f.getMonth() + 1) + "" + f.getFullYear();
        this.countAprobar = 0;
        this.countAprobados = 1;
        this.disableSubmit = true;
        this.disableSaveAll = true;

        if (this.dataSource.actasData != undefined && this.dataSource.actasData != null) {
            for (var i = 0; i < this.data.mantenimiento.actasVecindad.length; i++) {
                if (this.data.mantenimiento.actasVecindad[i].aprobado) {
                    this.countAprobados += 1;
                }
            }

            for (var i = 0; i < this.dataSource.actasData.length; i++) {
                for (var j = 0; j < this.data.mantenimiento.actasVecindad.length; j++) {
                    if (this.dataSource.actasData[i].id == this.data.mantenimiento.actasVecindad[j].id) {
                        if (this.dataSource.actasData[i].aprobado) {
                            this.data.mantenimiento.actasVecindad[j].aprobado = this.dataSource.actasData[i].aprobado;
                            this.data.mantenimiento.actasVecindad[j].fechaAprobacion = this.fecha;
                            this.data.mantenimiento.actasVecindad[j].consecutivoAprobacion = this.consecutivo + '-' + this.countAprobados.toString().padStart(4, "0");
                            this.countAprobar += 1;
                        }
                    }
                }
            }
        }

        if (this.countAprobar > 0) {
            this.workflowService.update(this.data).subscribe(
                data => {
                    this.data = data;
                    this.disableSubmit = true;
                    this.disableSaveAll = false;
                    this.snackBar.open('¡Registro(s) actualizados con exito!', 'X', {
                        duration: 5000,
                        panelClass: ['success-snackbar']
                    });
                },
                error => {
                    this.disableSubmit = false;
                    this.disableSaveAll = true;
                    this.snackBar.open(error.error, 'X', {
                        duration: 5000,
                        panelClass: ['error-snackbar']
                    });
                });
        }
        else {
            this.disableSubmit = false;
            this.disableSaveAll = true;
            this.snackBar.open('No ha seleccionado acta(s) para aprobar.', 'X', {
                duration: 5000,
                panelClass: ['error-snackbar']
            });
        }
    }

    gestionarSeleccion() {
        this.disableSaveAll = true;
        this.showGestion = true;
    }

    guardarTodo() {
        this.utilitiesServices.scrollToTop();
        this.data.actividad = this.actividad;
        this.workflowService.update(this.data).subscribe(
            data => {
                this.data = data;
                //const urlBack = this.constants.rutaBaseGestionSocialWorkflow + 'aprobar-actas-vecindad';
                //this.router.navigate([urlBack]);
                this.irAtras.emit();
            },
            error => {
                this.snackBar.open(error.error, 'X', {
                    duration: 5000,
                    panelClass: ['error-snackbar']
                });
            });
    }

    /** Método encargado de devolver a la página principal el componente */
  onBack(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'custom-modalbox';
        dialogConfig.width = '30%';
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

        dialogRef.beforeClosed().subscribe(
            val => {
                if (val == 1) {
                    //let urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin')
                    //this.router.navigate([urlBack]);
                    this.irAtras.emit();
                }
            }
        );
    }

    dataExport: any = [{}];

    exportAsXLSX(): void {
        this.disabledButton = true;
        this.dataSourceExport = new ActasVecindadDatasource(this.servicio);
        const total = this.dataSource.totalelementsSubject.value;

        this.cargandoExcel = true;

        this.criteriaExport.pk = this.criteria.pk;
        this.criteriaExport.size = total;
        this.criteriaExport.page = 0;
        this.criteriaExport.sortBy = this.criteria.sortBy;
        this.criteriaExport.sortOrder = this.criteria.sortOrder;

        this.dataSourceExport.loadData(this.criteriaExport);

        this.cargandoExcel = true;
        this.dataSourceExport.loading$.subscribe(response => {
            this.disabledButton = false;
            if (!response) {
                const content = this.dataSourceExport.actasData.map((acta: Acta) => {
                    return {
                        numeralAscendente: acta.numeralAscendente,
                        noActaVecindad: acta.noActaVecindad,
                        fecha: acta.fecha,
                        aprobado: acta.aprobado ? 'SI' : 'NO'
                    };
                });
                this.dataExport = [...this.headers, ...content];
                const order = ['numeralAscendente', 'noActaVecindad', 'fecha', 'aprobado'];
                this.excelService.exportAsExcelFileCustom(this.dataExport, 'ActasVecindad', true, order);
                this.cargandoExcel = false;
            }
        });
    }
}