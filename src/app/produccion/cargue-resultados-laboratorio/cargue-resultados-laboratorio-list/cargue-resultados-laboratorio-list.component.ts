import { Component, OnInit, ViewChild, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { ExcelService } from 'src/app/shared/services/excel.service';
// tslint:disable-next-line: max-line-length
import { CargueResultadosLaboratorioEditComponent } from '../cargue-resultados-laboratorio-edit/cargue-resultados-laboratorio-edit.component';
import { CONST_PRODUCCION_SOLICITUD_ENSAYOS } from '../../solicitud-ensayos/solicitud-ensayos.constant';
import { SolicitudEnsayosDatasource } from '../../solicitud-ensayos/services/solicitud-ensayos.datasource';
import { SolicitudEnsayosCriteria } from '../../solicitud-ensayos/models/solicitud-ensayos-criteria.model';
import { SolicitudEnsayosService } from '../../solicitud-ensayos/services/solicitud-ensayos.service';
import { SolicitudEnsayos } from '../../solicitud-ensayos/models/solicitud-ensayos.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { BehaviorSubject } from 'rxjs';
import * as FileSaver from 'file-saver';
// tslint:disable-next-line: max-line-length
import { CargueResultadosLaboratorioDetailComponent } from '../cargue-resultados-laboratorio-detail/cargue-resultados-laboratorio-detail.component';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/shared/services/common.service';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-prod-cargue-resultados-list',
  templateUrl: './cargue-resultados-laboratorio-list.component.html'
})
export class CargueResultadosLaboratorioListComponent implements OnInit, AfterViewInit {

  /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_SOLICITUD_ENSAYOS;
  // inputs
  @Input() mantenimiento: WorkflowMantenimientoModel = new WorkflowMantenimientoModel();
  @Input() mapService: MapService ;
  @Input() generico = false;

  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();
  @Output() detalleGen = new EventEmitter();

  dataSourceSE: SolicitudEnsayosDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExportSE: SolicitudEnsayosDatasource;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  listEnsayos: any;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteriaSE = new SolicitudEnsayosCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExportSE = new SolicitudEnsayosCriteria();
  lengthList: Number;
  ensayos: SolicitudEnsayos[];
  pagAux: number;
  /** Columnas de los datos que se exportarán a presionar el botón exportar del componente*/
  dataExport: any = [];
  disabledButton = false;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [];

  order = [];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [];

  /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;
  private subscribeToUrlMap: any;

  processingE = true;
  currentActionL = '';
  /** Variable usada para agrupar los elementos del formulario */
  formEdit: FormGroup;
  ensayo: SolicitudEnsayos;
  fechaRegistroEnsayo: string;
  usuarioNom: string;
  usuarioTramite: string;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disabledBtn_Login = false;

  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  formBuilder: FormBuilder;

  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    formBuilder: FormBuilder,
    private utilitiesServices: UtilitiesService,
    private snackBar: MatSnackBar,
    private tokenStorageService: TokenStorageService,
    private servicioSE: SolicitudEnsayosService,
    private dialog: MatDialog,
    private excelService: ExcelService,
//    private mapService: MapService,
  ) {

    this.formBuilder = formBuilder;
    this.formEdit = this.formBuilder.group({
      id: [null],
      fecha: [null, Validators.compose([Validators.required])],
      pk: [null],
      tipoEnsayo: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      fechaRegistroEnsayo: [null, Validators.compose([Validators.required])],
      archivo: [null, Validators.compose([Validators.required])],
      observaciones: [null, Validators.compose([Validators.maxLength(1000)])],
    });


  }

  loader = true;
  noInfoToShow = false;
  exportOption = true;
  dataEnsayosExport: any = [];

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    this.dataSourceSE = new SolicitudEnsayosDatasource(this.servicioSE);
    if (this.generico) {
      //this.mapService.getVisor().visible = false;
      this.columns = ['id', 'tipoEnsayo', 'fecha', 'usuario', 'fechaRegistroEnsayo', 'acciones'];
      this.order = ['id', 'tipoEnsayo', 'fecha', 'solicitante', 'fechaRegistroEnsayo'];
      this.headers = [{
        tipoEnsayo: 'Tipo de Ensayo',
        fecha: 'Fecha Solicitud',
        solicitante: 'Usuario Solicitud',
        fechaRegistroEnsayo: 'Fecha Ensayo'
      }];
    } else {
      this.columns = ['pk', 'tipoEnsayo', 'fecha', 'usuario', 'fechaRegistroEnsayo', 'acciones'];
      this.order = ['pk', 'tipoEnsayo', 'fecha', 'solicitante', 'fechaRegistroEnsayo'];
      this.headers = [{
        pk: 'PK',
        tipoEnsayo: 'Tipo de Ensayo',
        fecha: 'Fecha Solicitud',
        solicitante: 'Usuario Solicitud',
        fechaRegistroEnsayo: 'Fecha Ensayo'
      }];

    }
    this.currentActionL = 'listSolEn'
    this.loadData();
  }

  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.criteriaSE.page = this.paginator.pageIndex;
      this.criteriaSE.size = this.paginator.pageSize;
      this.loadData();
    });

    this.sort.sortChange.subscribe(() => {
      this.criteriaSE.sortBy = this.sort.active;
      this.criteriaSE.sortOrder = this.sort.direction || 'asc';
      this.loadData();
    });
  }

  /**
  * Método encargado de invocar la petición de consulta
  * al servicio según los criterios definidos
  */
  search(): void {
    this.paginator.pageIndex = 0;
    this.criteriaSE.page = 0;
    this.loadData();
  }

  Limpiar(): void {
    this.paginator.pageIndex = 0;
    this.criteriaSE.page = 0;
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteriaSE) {
      if (!noLimpiar.includes(key)) {
        this.criteriaSE[key] = '';
      }
    }
    this.paginator.pageIndex = 0;
  }

  /**
   * Método encargado de gestionar la carga de los pks
   * de la grilla al iniciar el componente.
   */
  loadData(): void {
    this.criteriaSE.generico = this.generico;
    this.criteriaSE.pk = this.generico ? null : this.mantenimiento.pk;
    this.criteriaSE.fecha = this.criteriaSE.fecha != null ? this.criteriaSE.fecha : '';
    this.criteriaSE.fechaRegistroEnsayo = this.criteriaSE.fechaRegistroEnsayo != null ? this.criteriaSE.fechaRegistroEnsayo : '';
    this.criteriaSE.tipoEnsayoId = this.criteriaSE.tipoEnsayoId != null ? this.criteriaSE.tipoEnsayoId : '';
    this.dataSourceSE.loadData(this.criteriaSE);
  }

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(ensayo: SolicitudEnsayos): void {
    this.ensayo = ensayo;
    this.cargarDatosForm();
    this.processingE = false;
    this.currentActionL = 'editResultado'
  }

  cargarDatosForm() {
    if (this.ensayo.fechaRegistroEnsayo == null) {
      this.fechaRegistroEnsayo = this.utilitiesServices.convertDateToString(new Date(), 'DD-MM-YYYY');
    } else {
      this.fechaRegistroEnsayo = this.ensayo.fechaRegistroEnsayo;
    }

    if (this.ensayo.usuarioTramite == null) {
      this.ensayo.usuarioTramite = this.tokenStorageService.getStorage('payload1');
    }
    this.usuarioNom = this.ensayo.usuario.nombres + ' ' + this.ensayo.usuario.apellidos;
    this.usuarioTramite = this.ensayo.usuarioTramite.nombres + ' ' + this.ensayo.usuarioTramite.apellidos;
    this.ensayo['fechaMaxima'] = this.utilitiesServices.convertDateToString(new Date());
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(ensayo: SolicitudEnsayos): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    ensayo.generico = this.generico;
    dialogConfig.data = ensayo;

    const dialogRef = this.dialog.open(CargueResultadosLaboratorioDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param {ensayo} Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detailGen(ensayo: SolicitudEnsayos): void {

    this.ensayo = ensayo;
    this.processingE = false;
    this.currentActionL = "detalleGenerico";
    this.detalleGen.emit({currentAction: this.currentActionL, ensayo: this.ensayo })
    this.utilitiesServices.scrollToTop();
  }

  onBack() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          this.currentActionL = 'list'
          this.back.emit({ currentAction: this.currentActionL });
          this.utilitiesServices.scrollToTop();
        }
      }
    );
  }

  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSX(): void {
    this.disabledButton = true;
    this.dataSourceExportSE = new SolicitudEnsayosDatasource(this.servicioSE);
    const total = this.dataSourceSE.totalelementsSubject.value;
    this.cargandoExcel = true;

    const noLimpiar = ['page', 'size', 'getUrlParameters'/*, 'sortBy', 'sortOrder'*/];
    for (const key in this.criteriaSE) {
      if (!noLimpiar.includes(key)) {
        this.criteriaExportSE[key] = this.criteriaSE[key] === null ? '' : this.criteriaSE[key];
      }
    }

    this.criteriaExportSE.size = total;
    this.criteriaExportSE.page = 0;

    this.dataSourceExportSE.loadDataExcel(this.criteriaExportSE);

    this.dataSourceExportSE.loading$.subscribe(response => {
      this.disabledButton = false;
      if (!response) {
        const content = this.dataSourceExportSE.ensayosData.content.map((ensayo: SolicitudEnsayos) => {
          return {
            tipoEnsayo: ensayo.tipoEnsayo != null ? ensayo.tipoEnsayo.descripcion : '',
            fecha: ensayo.fecha,
            solicitante: ensayo.usuario != null ? ensayo.usuario.nombres + ' ' + ensayo.usuario.apellidos : '',
            fechaRegistroEnsayo: ensayo.fechaRegistroEnsayo
          };
        });
        this.dataExport = [...this.headers, ...content];
        const order = ['tipoEnsayo', 'fecha', 'solicitante', 'fechaRegistroEnsayo'];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'SolicitudesEnsayos', true, order);
        this.cargandoExcel = false;
      }
    });
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.dataSourceSE = new SolicitudEnsayosDatasource(this.servicioSE);
        this.loadData();
        this.currentActionL = 'listSolEn';
        this.utilitiesServices.scrollToTop();
      }
    });
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.markAndValidateAllInputs(this.formEdit);
    this.enviada = true;
    if (this.formEdit.valid === true) {
      this.save();
    } else {
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 10000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    // tslint:disable-next-line:forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.ensayo.fechaRegistroEnsayo = this.fechaRegistroEnsayo;
    this.servicioSE.update(this.ensayo).subscribe(
      data => {
        this.disabledBtn_Login = false;
        this.currentActionL = 'listSol';
        this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.dataSourceSE = new SolicitudEnsayosDatasource(this.servicioSE);
        this.loadData();
        this.currentActionL = 'listSolEn';
      },
      error => {
        this.disabledBtn_Login = false;
        this.utilitiesServices.formErrorMessages(error, this.formEdit, this.snackBar);
        //this.currentAction = 'listSolEn';
      },
    );
  }


}
