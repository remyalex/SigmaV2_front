import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatSnackBar, MatTableDataSource } from '@angular/material';
import { ActasService } from '../services/actas-vecindad.service';
import { ActasCriteria } from '../models/actas-vecindad-criteria.model';
import { ActasVecindadDatasource } from '../services/actas-vecindad.datasource';
import { Acta } from '../models/actas-vecindad.model';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
// import { SolicitudEnsayosEditComponent } from '../solicitud-ensayos-edit/solicitud-ensayos-edit.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { CONST_ACTAS_VECINDAD } from '../actas-vecindad.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { SolicitudModule } from 'src/app/mejoramiento/solicitud/solicitud.module';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { Router } from '@angular/router';
import { ActasVecindadEditComponent } from '../actas-vecindad-edit/actas-vecindad-edit.component';

@Component({
    selector: 'app-actas-vecindad-list',
    templateUrl: './actas-vecindad-list.component.html'
})
export class ActasVecindadListComponent implements OnInit, AfterViewInit {
    /** Constantes a usar en el componente */
    @Output() onBackInit = new EventEmitter();
    constants = CONST_ACTAS_VECINDAD;
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
        'numeralAscendente',
        'noActaVecindad',
        'fecha',
        'aprobado',
        'acciones'
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
        this.criteria.pk = CONST_ACTAS_VECINDAD.mPK;
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

    edit(acta: Acta): void {
        CONST_ACTAS_VECINDAD.aID = acta.id;
        this.currentAction = 'edit';
    }

    attach(acta: Acta): void {
        CONST_ACTAS_VECINDAD.aID = acta.id;
        this.currentAction = 'attach';
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
                    this.onBackInit.emit();
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

    accionIrAtras() {
        this.currentAction = 'list';
    }

    goToHome() {
        this.onBackInit.emit();
    }
}
