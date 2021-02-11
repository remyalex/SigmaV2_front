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

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'sigma-aprobar-actas-list',
    templateUrl: './aprobar-actas-list.component.html'
})

export class AprobarActasListComponent implements OnInit, AfterViewInit {
    /** Constantes a usar en el componente */
    constants = CONST_APROBAR_ACTAS;
    dataSource: ActasVecindadDatasource;
    dataSourceExport: ActasVecindadDatasource;
    cargandoExcel = false;
    listActas: any;
    currentAction = 'list';
    criteria = new ActasCriteria();
    criteriaExport = new ActasCriteria();
    disabledButton = false;
    disabledReport = false;
    lengthList: Number;
    pagAux: number;

    columns = [
        'consecutivoAprobacion',
        'cantidadPK',
        'fechaAprobacion',
        'acciones'
    ];

    headers = [{
        consecutivoAprobacion: 'Numero consecutivo',
        cantidadPK: 'Cantidad de PKs',
        fechaAprobacion: 'Fecha aprobación',
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
    ) { }

    loader = true;
    noInfoToShow = false;
    exportOption = true;
    dataEnsayosExport: any = [];

    ngOnInit(): void {
        this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
        this.dataSource = new ActasVecindadDatasource(this.servicio);
        this.loadData();
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
        this.criteria.aprobado = true;
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

    attach(acta: Acta): void {
        CONST_APROBAR_ACTAS.aID = acta.id;
        this.currentAction = 'attach';
        // this.router.navigate([this.constants.rutaBaseGestionSocial + 'attach']);
    }

    exportarPDF(acta: Acta) {
        this.disabledReport = true;
        this.servicio.generarPDF(acta.id);
        this.disabledReport = false;
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
                if (val === 1) {
                    //const urlBack = this.constants.rutaBaseGestionSocialWorkflow + 'aprobar-actas-vecindad';
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
                        consecutivoAprobacion: acta.consecutivoAprobacion,
                        cantidadPK: '1',
                        fechaAprobacion: acta.fechaAprobacion
                    };
                });
                this.dataExport = [...this.headers, ...content];
                const order = ['consecutivoAprobacion', 'cantidadPK', 'fechaAprobacion'];
                this.excelService.exportAsExcelFileCustom(this.dataExport, 'ActasVecindad', true, order);
                this.cargandoExcel = false;
            }
        });
    }

    accionIrAtras() {
        this.currentAction = 'list';
    }

    goToHome() {
        this.irAtras.emit();
    }
}