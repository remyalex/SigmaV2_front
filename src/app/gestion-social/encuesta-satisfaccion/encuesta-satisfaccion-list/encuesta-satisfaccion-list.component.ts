import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatSnackBar, MatTableDataSource } from '@angular/material';
import { EncuestaSatisfaccionService } from '../services/encuesta-satisfaccion.service';
import { EncuestaSatisfaccionCriteria } from '../models/encuesta-satisfaccion-criteria.model';
import { EncuestaSatisfaccionDatasource } from '../services/encuesta-satisfaccion.datasource';
import { EncuestaSatisfaccion } from '../models/encuesta-satisfaccion.model';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { CONST_ENCUESTA_SATISFACCION } from '../encuesta-satisfaccion.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { SolicitudModule } from 'src/app/mejoramiento/solicitud/solicitud.module';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-encuesta-satisfaccion-list',
    templateUrl: './encuesta-satisfaccion-list.component.html'
})

export class EncuestaSatisfaccionListComponent implements OnInit, AfterViewInit {
   /** Constantes a usar en el componente */
  constants = CONST_ENCUESTA_SATISFACCION;
  @Output() irAlGrid = new EventEmitter();
  @Output() accionEncuestaSatisfaccion = new EventEmitter();
    dataSource: EncuestaSatisfaccionDatasource;
    dataSourceExport: EncuestaSatisfaccionDatasource;
    cargandoExcel = false;
    listActas: any;
    criteria = new EncuestaSatisfaccionCriteria();
    criteriaExport = new EncuestaSatisfaccionCriteria();
    disabledButton = false;
    disabledReport = false;
    lengthList: Number;
    pagAux: number;

    columns = [
        'checked',
        'id',
        'fecha',
        'acciones'
    ];

    headers = [{
        numeralAscendente: 'Numeral ascendente',
        fecha: 'Fecha de registro de gestión social',
    }];

    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort

    constructor(
        private servicio: EncuestaSatisfaccionService,
        private dialog: MatDialog,
        private excelService: ExcelService,
        private snackBar: MatSnackBar,
        private utillilb: UtilitiesService,
        private utilitiesServices: UtilitiesService,
        //private router: Router,
    ) { }

    loader = true;
    noInfoToShow = false;
    exportOption = true;
    dataEnsayosExport: any = [];

    ngOnInit(): void {
        this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
        this.dataSource = new EncuestaSatisfaccionDatasource(this.servicio);
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
        this.criteria.pk = CONST_ENCUESTA_SATISFACCION.mPK;
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
        if (this.dataSource.encuestaData != undefined && this.dataSource.encuestaData != null) {
            for (var i = 0; i < this.dataSource.encuestaData.length; i++) {
                this.dataSource.encuestaData[i].check = event.checked;
            }
        }
    }

    edit(encuesta: EncuestaSatisfaccion): void {
        CONST_ENCUESTA_SATISFACCION.aID = encuesta.id;
        this.accionEncuestaSatisfaccion.emit({accion: 'edit'});
    }

    attach(encuesta: EncuestaSatisfaccion): void {
        CONST_ENCUESTA_SATISFACCION.aID = encuesta.id;
        this.accionEncuestaSatisfaccion.emit({accion: 'attach'});
    }

    exportarPDF(encuesta: EncuestaSatisfaccion) {
        this.disabledReport = true;
        if (CONST_ENCUESTA_SATISFACCION.mTurno === 'DIURNA') {
            this.servicio.generarPDF(encuesta.id, 'DIURNO');
        } else if (CONST_ENCUESTA_SATISFACCION.mTurno === 'NOCTURNA') {
            this.servicio.generarPDF(encuesta.id, 'NOCTURNO');
        }
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
                    this.irAlGrid.emit();
                }
            }
        );
    }

    dataExport: any = [{}];

    exportAsXLSX(): void {
        this.disabledButton = true;
        this.dataSourceExport = new EncuestaSatisfaccionDatasource(this.servicio);
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
                const content = this.dataSourceExport.encuestaData.map((encuesta: EncuestaSatisfaccion) => {
                    return {
                        numeralAscendente: encuesta.id,
                        fecha: encuesta.fecha,
                    };
                });
                this.dataExport = [...this.headers, ...content];
                const order = ['numeralAscendente', 'fecha'];
                this.excelService.exportAsExcelFileCustom(this.dataExport, 'ActasVecindad', true, order);
                this.cargandoExcel = false;
            }
        });
    }
}