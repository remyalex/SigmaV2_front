import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialog, MatDialogConfig, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { SolicitudPMT } from './models/solicitud-pmt.model';
import { SOLICITUD_PMT_CONSTANTS } from './solicitud-pmt.constants';
import { Archivo } from 'src/app/workflow/models/archivo.model';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { SolicitudPmtService } from 'src/app/intervencion/services/solicitudesPmt.service';
import { SolicitudPmtArchivo } from './models/solicitud-pmt-archivo.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { ViewFormPmtComponent } from './view-form-pmt/view-form-pmt.component';
import { KeyValuePair } from '../../../../shared/models/key-value-pair.model';

class PmtSolicitud {
  id: String;
  pk: number;
  civ: number;
  fechaRadicadoMovilidad: String;
  numeroRadicadoMovilidad: number;
  numeroRadicadoPmt: number;
}

@Component({
  selector: 'app-solicitud-pmt',
  templateUrl: './solicitud-pmt.component.html'
})
export class SolicitudPmtComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  mantenimiento: WorkflowMantenimientoModel;

  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán de forma predeterminada en este componente */
  defaultFilters: KeyValuePair[] = [];
  titleForm: string;
  labelButtonCancel: string;
  labelButtonSave: string;
  iconButtonCancel: string;
 /** Constantes a usar en el componente */
  constants = SOLICITUD_PMT_CONSTANTS;
  archivosSolicitudPMT: Archivo[];
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  formRadicado: FormGroup;
  formularioDetalleGestion: FormGroup;
  entradaConsultaRadicado: string;
  solicitudPmt: SolicitudPMT;
  numeroRadicadoPmt: number;
  listaItemPorSolicitar: ListaItem;
  listaItemPorAprobar:  ListaItem;
  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  listSolicitudesPMT: any;
  lengthList: Number;
  loader = false;
  noInfoToShow = false;
  formReadOnly = false;
  formReadOnlyMaVial = false;
  formReadOnlyResumePMT = false;
  pmtSolicitudBuild: PmtSolicitud;
  loadDataPMT: Array<PmtSolicitud> = new Array<PmtSolicitud>();
  numeroRadicadoPmtFlag = true;
  showRadicadoForm = false;
  readMode: boolean;
  soloLecturaRadicado: boolean;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: any;

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk',
    'civ',
    'radicadoIntervencion',
    'zona',
    'localidad',
    'cuadrante',
    'upla',
    'tipoIntervencion'
  ];

  columnsPMT = [
    'pk',
    'civ',
    'fechaRadicadoMovilidad',
    'pmt',
    'acciones'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk',
    'civ',
    'zona',
    'localidad',
    'upla',
    'directorDeObra',
    'tipoIntervencion',
    'radicadoIntervencion'
  ];

  columnsToExport = [
    'pk',
    'civ',
    'zona',
    'localidad',
    'cuadrante',
    'upla',
    'barrio',
    'ancho',
    'area',
    'longitud',
    'tipoMalla',
    'ejeVial',
    'desde',
    'hasta',
    'numeroCarriles',
    'tipoIntervencion',
    'estadoPk',
    'radicadoIntervencion',
    'estadoProgramacion'
  ];
  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente */
  acciones: GridAccion[] = [
    { nombre: 'adicionarSolicitud', label: 'Adicionar Solicitud', icono: 'note_add', color: 'primary' },
    { nombre: 'editarSolicitud', label: 'Editar Solicitud', icono: 'edit', color: 'primary' },
    { nombre: 'consultarSolicitud', label: 'Consultar Solicitud', icono: 'visibility', color: 'primary' }
  ];

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
    private _SolicitudPmtService: SolicitudPmtService
  ) {
    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.mapService.forceShowMap();
    // this.defaultFilters = [
    //   { 'key': 'actividadActualId', 'value': this.data.mantenimiento.actividadActual.id + '' }
    // ];
    // this.commonService.getCondicionByNombre('PK_SOLICITUD_PMT').subscribe(_condicion => {
    //   this.condicion = _condicion;
    // });

    this.commonService.getCondicionByNombre('PK_SOLICITUD_PMT').subscribe(_condicion => {
      this.condicion = _condicion;
    });
    this.commonService.getListaItemByNombreListaAndValorItem('ESTADO_SOLICITUD_PMT', 'POR APROBAR').subscribe(listaItem => {
      this.listaItemPorAprobar = listaItem;
    });
    this.commonService.getListaItemByNombreListaAndValorItem('ESTADO_SOLICITUD_PMT', 'POR SOLICITAR').subscribe(listaItem => {
      this.listaItemPorSolicitar = listaItem;
    });
    this.loadSolicitudPMT();
 }

 /**
  * Método encargado de gestionar la carga de los pks
  * de la grilla al iniciar el componente.
  */
  loadData(): void {
    if (this.mantenimiento.solicitudesPmt !== undefined) {
      this.buildData();
      this.loader = false;

      if (this.mantenimiento.solicitudesPmt.length > 0) {
        this.dataSource = new MatTableDataSource(this.loadDataPMT);
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
  }

  buildData() {
    this.loadDataPMT = [];
    // tslint:disable-next-line: forin
    for (const solicitudPmt in this.mantenimiento.solicitudesPmt) {
      // tslint:disable-next-line: forin
      for (const mantenimiento in this.mantenimiento.solicitudesPmt[solicitudPmt].mantenimientos) {
        // tslint:disable-next-line: max-line-length tslint:disable-next-line: radix
        if (parseInt(this.mantenimiento.solicitudesPmt[solicitudPmt].mantenimientos[mantenimiento].pk.toString()) === this.mantenimiento.pk) {
          this.pmtSolicitudBuild = new PmtSolicitud();
          this.pmtSolicitudBuild.id = solicitudPmt;
          this.pmtSolicitudBuild.fechaRadicadoMovilidad = this.mantenimiento.solicitudesPmt[solicitudPmt].fechaRadicadoMovilidad;
          this.pmtSolicitudBuild.numeroRadicadoMovilidad = this.mantenimiento.solicitudesPmt[solicitudPmt].numeroRadicadoMovilidad;
          this.pmtSolicitudBuild.numeroRadicadoPmt = this.mantenimiento.solicitudesPmt[solicitudPmt].numeroRadicadoPmt;
          this.pmtSolicitudBuild.pk = this.mantenimiento.solicitudesPmt[solicitudPmt].mantenimientos[mantenimiento].pk;
          this.pmtSolicitudBuild.civ = this.mantenimiento.solicitudesPmt[solicitudPmt].mantenimientos[mantenimiento].civ;
          this.loadDataPMT.push(this.pmtSolicitudBuild);
        }
      }
    }
  }

  loadSolicitudPMT() {
    this._SolicitudPmtService.list().subscribe((data) => {
      this.listSolicitudesPMT = data;
    });
  }

  executeSingleAction(event) {
    this.form = this.formBuilder.group({
      tipoPmt: [null],
      numeroRadicadoMovilidad: [null, Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15)])],
      tipoCierre: [null],
      fechaInicio: [null],
      fechaFin: [null],
      horaInicioCierre: [null],
      horaFinalCierre: [null],
      horaInicioTrabajo: [null],
      horaFinalTrabajo: [null],
      coi: [null],
      estadoPmt: [null, Validators.compose([Validators.required])],
      adjuntarPmt: [null],
      observaciones: [null, Validators.compose([Validators.maxLength(200)])],
    });

    this.formRadicado = this.formBuilder.group({
      entradaConsultaRadicado: [null],
      numeroRadicadoPmt: [null, Validators.compose([Validators.required])],
      fechaRadicadoMovilidad: [null, Validators.compose([Validators.required])],
    });
    this.formRadicado.get('fechaRadicadoMovilidad').disable();
    this.formRadicado.get('numeroRadicadoPmt').disable();
    this.data.mantenimiento = event.mantenimiento;
    switch (event.accion) {
      case 'adicionarSolicitud':
        this.validarcionPreviaAlRegistro();
        break;
      case 'editarSolicitud':
        this.editar();
        break;
      case 'consultarSolicitud':
        this.mostrar();
        break;
    }
    this.accion = this.currentAction;
    this.mapService.getVisor().visible = false;
  }

  validarcionPreviaAlRegistro() {
    this.formReadOnly = false;
    this.formReadOnlyMaVial = false;
    this.formReadOnlyResumePMT = false;
    if (!this.data.mantenimiento.intervenciones || this.data.mantenimiento.intervenciones.length < 1) {
      this.showMessageSnackBar('El PK no cuenta con una Intervención');
    } else {
      let tieneSolicitudesPendientes = false;
      if (this.data.mantenimiento.solicitudesPmt && this.data.mantenimiento.solicitudesPmt.length > 0) {
        for (const solicitudPmt of this.data.mantenimiento.solicitudesPmt) {
          if (
            solicitudPmt.estadoPmt.id === this.listaItemPorAprobar.id ||
            solicitudPmt.estadoPmt.id === this.listaItemPorSolicitar.id ) {
            tieneSolicitudesPendientes = true;
          }
        }
      }

      if (!tieneSolicitudesPendientes) {
        this.loadSolicitudPMT();
        this.currentAction = 'selectSolicitudPmt';
        this.utilitiesServices.scrollToTop();
      } else {
        this.snackBar.open(
          'Existe una solicitud PMT en curso, no se puede crear una nueva Solicitud', 'X', {
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
      }
    }

  }

  registrar() {
    this.titleForm = this.constants.tituloRegistar;
    this.labelButtonCancel = this.constants.cancelar;
    this.archivosSolicitudPMT = [];
    this.solicitudPmt = new SolicitudPMT();
    this.solicitudPmt.intervencionEncabezado = this.data.mantenimiento.intervenciones[0];
    this.solicitudPmt.estadoPmt = this.listaItemPorAprobar;
    this.solicitudPmt.mantenimientos = [];
    this.solicitudPmt.solicitudArchivos = [];
    const mantenimiento = new WorkflowMantenimientoModel();
    mantenimiento.id = this.data.mantenimiento.id;
    this.solicitudPmt.mantenimientos.push(mantenimiento);
    this.labelButtonCancel = this.constants.cancelar;
    this.iconButtonCancel = this.constants.iconCancel;
    this.readMode = false;
    this.soloLecturaRadicado = false;
    this.labelButtonSave = this.constants.guardar;
    this.currentAction = 'formSolicitudPmt';
  }

  editar() {
    this.formReadOnly = false;
    this.formReadOnlyMaVial = false;
    this.formReadOnlyResumePMT = false;
    if (!this.data.mantenimiento.solicitudesPmt || this.data.mantenimiento.solicitudesPmt.length < 1) {
      this.showMessageSnackBar('PK sin Solicitudes PMT para editar');
    } else {
      if (this.data.mantenimiento.solicitudesPmt[0].estadoPmt.descripcion === 'NO APROBADO' ||
        this.data.mantenimiento.solicitudesPmt[0].estadoPmt.descripcion === 'VIABILIZADO' ||
        this.data.mantenimiento.solicitudesPmt[0].estadoPmt.descripcion === 'APROBADO') {
        this.deshabilitarFormulario();
        if (this.data.mantenimiento.solicitudesPmt[0].estadoPmt.descripcion !== 'APROBADO') {
          this.showMessageSnackBar(
            'Pk con Estado PMT ' + this.data.mantenimiento.solicitudesPmt[0].estadoPmt.descripcion
            + ', debe crear una nueva Solicitud PMT '
          );
        }
      } else {
        this.form.get('estadoPmt').disable();
        if (this.data.mantenimiento.solicitudesPmt[0].estadoPmt.descripcion !== 'APROBADO' &&
        this.data.mantenimiento.solicitudesPmt[0].estadoPmt.descripcion !== 'NO APROBADO') {
          this.form.get('estadoPmt').enable();
        }
        this.titleForm = this.constants.tituloEditar;
        this.labelButtonCancel = this.constants.cancelar;
        this.iconButtonCancel = this.constants.iconCancel;
        this.labelButtonSave = this.constants.guardar;
        this.readMode = false;
        this.showRadicadoForm = true;
        this.soloLecturaRadicado = false;
      }
      this.solicitudPmt = this.data.mantenimiento.solicitudesPmt[0];
      this.extractArchivosBySolicitud();
      this.currentAction = 'formSolicitudPmt';
      this.utilitiesServices.scrollToTop();
    }
    this.labelButtonSave = this.constants.guardar;
  }

  mostrar() {
    this.pmtSolicitudBuild = null;
    this.formReadOnly = false;
    this.formReadOnlyMaVial = true;
    this.formReadOnlyResumePMT = true;
    if (!this.data.mantenimiento.solicitudesPmt || this.data.mantenimiento.solicitudesPmt.length < 1) {
      this.showMessageSnackBar('PK sin Solicitudes PMT para mostrar');
    } else {
      this.mantenimiento = this.data.mantenimiento;
      this.loadData();
      this.deshabilitarFormulario();
      this.labelButtonCancel = this.constants.atras;
      this.iconButtonCancel = this.constants.iconBack;
      this.solicitudPmt = this.data.mantenimiento.solicitudesPmt[0];
      this.extractArchivosBySolicitud();
      this.titleForm = this.constants.tituloLectura;
      this.readMode = true;
      this.showRadicadoForm = true;
      this.soloLecturaRadicado = true;
      this.currentAction = 'formSolicitudPmt';
      this.utilitiesServices.scrollToTop();
    }
  }

  asociar() {
    this.deshabilitarFormulario();
    this.extractArchivosBySolicitud();
    this.labelButtonCancel = this.constants.cancelar;
    this.iconButtonCancel = this.constants.iconCancel;
    this.labelButtonSave = this.constants.asociar;
    this.readMode = false;
    this.formReadOnly = true;
    this.showRadicadoForm = true;
    this.currentAction = 'formSolicitudPmt';
  }

  deshabilitarFormulario() {
    this.form.get('tipoPmt').disable();
    this.form.get('numeroRadicadoMovilidad').disable();
    this.form.get('tipoCierre').disable();
    this.form.get('fechaInicio').disable();
    this.form.get('fechaFin').disable();
    this.form.get('horaInicioCierre').disable();
    this.form.get('horaFinalCierre').disable();
    this.form.get('horaInicioTrabajo').disable();
    this.form.get('horaFinalTrabajo').disable();
    this.form.get('coi').disable();
    this.form.get('estadoPmt').disable();
    this.form.get('adjuntarPmt').disable();
    this.form.get('observaciones').disable();
    this.soloLecturaRadicado = true;
  }

  extractArchivosBySolicitud() {
    if (this.solicitudPmt.solicitudArchivos) {
      this.archivosSolicitudPMT = [];
      for (const solicitudArchivo of this.solicitudPmt.solicitudArchivos) {
        this.archivosSolicitudPMT.push(solicitudArchivo.archivo);
      }
    }
  }


  setArchivoSolicitud(event: any) {
    if (event && event.length > 0) {
      for (const archivo of event) {
        let existe = false;
        for (const solicitudArchivo of this.solicitudPmt.solicitudArchivos) {
          if (archivo.id === solicitudArchivo.archivo.id) {
            existe = true;
          }
        }
        if (!existe && archivo.id) {
          const solicitudArchivo = new SolicitudPmtArchivo();
          solicitudArchivo.fecha = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(new Date());
          solicitudArchivo.archivo = archivo;
          this.solicitudPmt.solicitudArchivos.push(solicitudArchivo);
        }

      }
    }

    if (event === '') {
      this.archivosSolicitudPMT = [];
      this.solicitudPmt.solicitudArchivos = [];
    }
  }

  tipoPmtValid(event) {
    if (event) {
      if (event.descripcion === 'MASIVO') {
        this.numeroRadicadoPmtFlag = false;
        this.formRadicado.controls['numeroRadicadoPmt'].clearValidators();
        this.form.controls['numeroRadicadoMovilidad'].clearValidators();
        this.formRadicado.controls['numeroRadicadoPmt'].updateValueAndValidity();
        this.form.controls['numeroRadicadoMovilidad'].updateValueAndValidity();
      } else {
        if (this.solicitudPmt.numeroRadicadoPmt == null) {
          this.numeroRadicadoPmtFlag = true;
        } else {
          this.numeroRadicadoPmtFlag = false;
        }
        this.formRadicado.controls['numeroRadicadoPmt'].setValidators([Validators.required]);
        // tslint:disable-next-line: max-line-length
        this.form.controls['numeroRadicadoMovilidad'].setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(15)]);
        this.formRadicado.controls['numeroRadicadoPmt'].updateValueAndValidity();
        this.form.controls['numeroRadicadoMovilidad'].updateValueAndValidity();
      }
    }
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.processingSelectPk = true;
    if (this.solicitudPmt.id == null) {
      this._SolicitudPmtService.create(this.solicitudPmt).subscribe(solicitud => {
        this.processingSelectPk = false;
        this.solicitudPmt = solicitud;
        this.currentAction = 'list';
        super.seleccionarGrid(0);
        this.mapService.getVisor().visible = true;
      }, error => {
        this.processingSelectPk = false;
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
      });
    } else {
      this._SolicitudPmtService.update(this.solicitudPmt).subscribe(solicitud => {
        this.processingSelectPk = false;
        this.solicitudPmt = solicitud;
        this.currentAction = 'list';
        super.seleccionarGrid(0);
        this.mapService.getVisor().visible = true;
      }, error => {
        this.processingSelectPk = false;
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
      });
    }
  }

  saveReadOnly() {
    this.solicitudPmt.mantenimientos.push(this.data.mantenimiento);
    this.processingSelectPk = true;
    if (this.solicitudPmt.id == null) {
      this._SolicitudPmtService.create(this.solicitudPmt).subscribe(solicitud => {
        this.processingSelectPk = false;
        this.solicitudPmt = solicitud;
        this.currentAction = 'list';
        setTimeout(() => {
          this.seleccionarGrid(0);
          this.mapService.getVisor().zoomQuerylocalizar(this.mapService.getVisor().definitionExpressionOriginal);
        }, 500);
        this.mapService.getVisor().visible = true;
      }, error => {
        this.processingSelectPk = false;
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
      });
    } else {
      this._SolicitudPmtService.update(this.solicitudPmt).subscribe(solicitud => {
        this.processingSelectPk = false;
        this.solicitudPmt = solicitud;
        this.currentAction = 'list';
        setTimeout(() => {
          this.seleccionarGrid(0);
          this.mapService.getVisor().zoomQuerylocalizar(this.mapService.getVisor().definitionExpressionOriginal);
        }, 500);
        this.mapService.getVisor().visible = true;
      }, error => {
        this.processingSelectPk = false;
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
      });
    }
  }

  showMessageSnackBar(message: string) {
    this.snackBar.open(
      message, 'X', {
        duration: 5000,
        panelClass: ['error-snackbar']
      }
    );
  }

  onChangeEstadoPmt() {
    if (this.solicitudPmt.estadoPmt.descripcion === 'APROBADO') {
      this.form.controls['coi'].setValidators([Validators.required]);
      this.form.controls['adjuntarPmt'].setValidators([Validators.required]);
      this.form.controls['coi'].updateValueAndValidity();
      this.form.controls['adjuntarPmt'].updateValueAndValidity();
    } else {
      this.form.controls['coi'].clearValidators();
      this.form.controls['adjuntarPmt'].clearValidators();
      this.form.controls['coi'].updateValueAndValidity();
      this.form.controls['adjuntarPmt'].updateValueAndValidity();
    }
  }

  toBack() {
    if (this.readMode) {
      this.formReadOnlyMaVial = false;
      this.formReadOnlyResumePMT = false;
      this.currentAction = 'list';
      this.mapService.getVisor().visible = true;
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'custom-modalbox';
      dialogConfig.width = '30%';
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

      dialogRef.beforeClosed().subscribe(
        val => {
          if (val === 1) {
            this.formReadOnlyMaVial = false;
            this.formReadOnlyResumePMT = false;
            this.currentAction = 'list';
            setTimeout(() => {
              this.seleccionarGrid(0);
              this.mapService.getVisor().zoomQuerylocalizar(this.mapService.getVisor().definitionExpressionOriginal);
            }, 500);
          }
        }
      );
    }
  }

  buscarRadicado() {
    this.numeroRadicadoPmtFlag = true;
    this.processingSelectPk = true;
    this.solicitudPmt.numeroRadicadoPmt = null;
    this.solicitudPmt.fechaRadicadoMovilidad = null;
    this.commonService.getRadicadoOrfeo(this.entradaConsultaRadicado).subscribe((item: any) => {
      this.solicitudPmt.numeroRadicadoPmt = parseInt(item.numeroRadicado, 10);
      this.solicitudPmt.fechaRadicadoMovilidad = item.fechaRadicado;
      this.entradaConsultaRadicado = null;
      this.showRadicadoForm = false;
      this.numeroRadicadoPmtFlag = false;
      setTimeout(() => {
        this.showRadicadoForm = true;
      }, 250);

      this.processingSelectPk = false;
    }, error => {
      this.showRadicadoForm = false;
      this.processingSelectPk = false;
      this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
    });

  }

  buscarSolicitudPmt() {
    if (this.numeroRadicadoPmt) {
      this._SolicitudPmtService.getByNumeroRadicadoPmt(this.numeroRadicadoPmt, this.data.mantenimiento.id).subscribe(solicitud => {
        this.solicitudPmt = solicitud;
        this.asociar();
      }, error => {
        this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
      });
    } else {
      this.snackBar.open(
        'Debe seleccionar una solicitud de PMT', 'X', {
          duration: 5000,
          panelClass: ['warning-snackbar']
        }
      );
    }
  }

  viewForm(solicitud) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      mantenimiento: this.mantenimiento,
      solicitudPmt: solicitud.id
    };

    const dialogRef = this.dialog.open(ViewFormPmtComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {

        }
      }
    );

  }
}