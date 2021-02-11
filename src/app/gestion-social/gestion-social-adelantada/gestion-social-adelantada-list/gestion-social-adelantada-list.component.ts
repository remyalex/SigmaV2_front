import { GestionSocialAdelantadaModel } from './../models/gestion-social-adelantada.model';
import { MapService } from './../../../shared/services/map.service';
import { TokenStorageService } from './../../../seguridad/services/token-storage.service';
import { WorkflowService } from './../../../workflow/services/workflow-service.service';
import { FormBuilder } from '@angular/forms';
import { MantenimientoService } from './../../../workflow/services/mantenimiento.service';
import { WorkflowMantenimientoModel } from './../../../workflow/models/workflow-mantenimiento.model';
import { SigmaConfirmComponent } from './../../../shared/sigma-confirm/sigma-confirm.component';
import { UtilitiesService } from './../../../shared/services/utilities.service';
import { ExcelService } from './../../../shared/services/excel.service';
import { ViewChild, Component, Inject, OnInit, AfterViewInit, Input, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { GestionSocialAdelantadaService } from '../services/gestion-social-adelantada.service';
import { GestionSocialAdelantadaCriteria } from '../models/gestion-social-adelantada-criteria.model';
import { GestionSocialAdelantadaDatasource } from '../services/gestion-social-adelantada.datasource';
import { CONST_SOCIAL_REGISTRAR_GESTION_ADELANTADA } from './../gestion-social-adelantada.constant';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'sigma-social-gestion-social-adelantada-list',
    templateUrl: './gestion-social-adelantada-list.component.html'
})

export class GestionSocialAdelantadaListComponent extends BaseComponent implements OnInit, AfterViewChecked {
   /** Constantes a usar en el componente */
  constants = CONST_SOCIAL_REGISTRAR_GESTION_ADELANTADA;

    // inputs
    @Input() mantenimiento: WorkflowMantenimientoModel = new WorkflowMantenimientoModel();
    
  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();

    dataSourceSocial: GestionSocialAdelantadaDatasource;
    dataSourceSocialExport: GestionSocialAdelantadaDatasource;
    cargandoExcel = false;
    criteriaSocial = new GestionSocialAdelantadaCriteria();
    criteriaSocialExport = new GestionSocialAdelantadaCriteria();
    disabledButton = false;
    disabledReport = false;
    lengthList: Number;
    pagAux: number;

    dataExport: any = [{}];
    columns = [
        'cantidadActasVecindad',
        'fechaRegistro',
        'accionesAdelantadas',
        'acciones'
    ];

    headers = [{
        cantidadActasVecindad: 'Numeral ascendente',
        fechaRegistro: 'Fecha registro Gestión',
        accionesAdelantadas: 'Acciones adelantadas',
    }];

    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort

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

        private servicioGestionSocial: GestionSocialAdelantadaService,
        private dialog: MatDialog,
        private router: Router,
        private _route: ActivatedRoute,
    ) {
         // Invocación del constructor padre
        super(servicio, commonService, formBuilder, workflowService, excelService,
            utilitiesServices, snackBar, tokenStorageService, mapService);
     }

    loader = true;
    noInfoToShow = false;
    exportOption = true;

    ngOnInit(): void {
        this.criteriaSocial.pk = this.mantenimiento.pk;
        this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
        this.dataSourceSocial = new GestionSocialAdelantadaDatasource(this.servicioGestionSocial);
        this.loadData();
    }

    search(): void {
        this.paginator.pageIndex = 0;
        this.criteriaSocial.page = 0;
        this.loadData();
    }

    Limpiar(): void {
        this.paginator.pageIndex = 0;
        this.criteriaSocial.page = 0;
        const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
        for (const key in this.criteriaSocial) {
            if (!noLimpiar.includes(key)) {
                this.criteriaSocial[key] = '';
            }
        }
        this.paginator.pageIndex = 0;
        this.loadData();
    }

    loadData(): void {
        this.dataSourceSocial.loadData(this.criteriaSocial);
    }

    ngAfterViewInit(): void {
        this.paginator.page.subscribe(() => {
            this.criteriaSocial.page = this.paginator.pageIndex;
            this.criteriaSocial.size = this.paginator.pageSize;
            this.loadData();
        });

        this.sort.sortChange.subscribe(() => {
            this.criteriaSocial.sortBy = this.sort.active;
            this.criteriaSocial.sortOrder = this.sort.direction || 'asc';
            this.loadData();
        });
    }

    selectAll(event: any) {
        if (this.dataSourceSocial.encuestaData != undefined && this.dataSourceSocial.encuestaData != null) {
            for (let i = 0; i < this.dataSourceSocial.encuestaData.length; i++) {
                this.dataSourceSocial.encuestaData[i].check = event.checked;
            }
        }
    }


    edit(encuesta: GestionSocialAdelantadaModel): void {
        CONST_SOCIAL_REGISTRAR_GESTION_ADELANTADA.gObject = encuesta;
        CONST_SOCIAL_REGISTRAR_GESTION_ADELANTADA.currentActionString = 'editarGestionSocial';
        this.servicioGestionSocial.updateGestionData( encuesta );
    }

    exportarPDF(encuesta: GestionSocialAdelantadaModel) {
        this.disabledReport = true;
        // this.servicio.generarPDF(encuesta.id, CONST_SOCIAL_REGISTRAR_GESTION_ADELANTADA.mTurno);
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
                    CONST_SOCIAL_REGISTRAR_GESTION_ADELANTADA.currentActionString = 'consultaGestionSocial';
                    const gestion = new GestionSocialAdelantadaModel();
                    gestion.id = 0;
                    this.servicioGestionSocial.updateGestionData(  gestion  );
                    // window.location.href = location.pathname;
                }
            }
        );
    }


    exportAsXLSX(): void {
        this.disabledButton = true;
        this.dataSourceSocialExport = new GestionSocialAdelantadaDatasource(this.servicioGestionSocial);
        const total = this.dataSourceSocial.totalelementsSubject.value;

        this.cargandoExcel = true;

        this.criteriaSocialExport.size = total;
        this.criteriaSocialExport.page = 0;
        this.criteriaSocialExport.sortBy = this.criteriaSocial.sortBy;
        this.criteriaSocialExport.sortOrder = this.criteriaSocial.sortOrder;

        this.dataSourceSocialExport.loadData(this.criteriaSocialExport);

        this.cargandoExcel = true;
        this.dataSourceSocialExport.loading$.subscribe(response => {
            this.disabledButton = false;
            if (!response) {
                const content = this.dataSourceSocialExport.encuestaData.map((encuesta: GestionSocialAdelantadaModel) => {
                    return {
                        cantidadActasVecindad: encuesta.cantidadActasVecindad,
                        fechaRegistro: encuesta.fechaRegistro,
                        accionesAdelantadas: encuesta.accionesAdelantadas
                    };
                });
                this.dataExport = [...this.headers, ...content];
                const order = ['cantidadActasVecindad', 'fechaRegistro', 'accionesAdelantadas'];
                this.excelService.exportAsExcelFileCustom(this.dataExport, 'ActasVecindad', true, order);
                this.cargandoExcel = false;
            }
        });
    }
}