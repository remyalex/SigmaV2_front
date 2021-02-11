import { WorkCuadrillaObraComponent } from './../work-cuadrilla-obra/work-cuadrilla-obra.component';
import { ListaItem } from './../../../administracion/listas-items/models/listas-items.model';
import { CommonService } from './../../../shared/services/common.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WorkflowMantenimientoModel } from '../../../workflow/models/workflow-mantenimiento.model';
import { MatDialogConfig, MatDialog, MatSnackBar, MatStepper, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SigmaConfirmComponent } from '../../../shared/sigma-confirm/sigma-confirm.component';
import { CONST_REGISTRO_DIARIO_CUADRILLA } from '../registro-diario-trabajo-cuadrilla.constant';
import { CONST_REGISTRO_DIARIO_CUADRILLA_ESTADO_PETICION } from '../registro-diario-trabajo-cuadrilla.constant';
import { CuadrillaGeneralService } from '../services/cuadrilla-general.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { CuadrillaGeneralModel } from '../models/cuadrilla-general.model';
import { WorkCuadrillaPersonalComponent } from '../work-cuadrilla-personal/work-cuadrilla-personal.component';
import { WorkCuadrillaMaterialComponent } from '../work-cuadrilla-material/work-cuadrilla-material.component';
import { MapService } from '../../../shared/services/map.service';
import { WorkCuadrillaPetreosRapComponent } from '../work-cuadrilla-petreos-rap/work-cuadrilla-petreos-rap.component';
import { WorkCuadrillaEquipoComponent } from '../work-cuadrilla-equipo/work-cuadrilla-equipo.component';
import { WorkCuadrillaRetiroComponent } from '../work-cuadrilla-retiro/work-cuadrilla-retiro.component';
import { WorkCuadrillaCalidadComponent } from '../work-cuadrilla-calidad/work-cuadrilla-calidad.component';
import { WorkCuadrillaObservacionesComponent } from '../work-cuadrilla-observaciones/work-cuadrilla-observaciones.component';


@Component({
  selector: 'sigma-work-cuadrilla-admin',
  templateUrl: './work-cuadrilla-admin.component.html'
})
export class WorkCuadrillaAdminComponent implements OnInit {

  @Input() mantenimiento: WorkflowMantenimientoModel;
  @Input() onlyRead: Boolean;
  @Input() componentVisible: Boolean;

  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();
  @Output() vieMap = new EventEmitter();
  @Output() saveAllForm = new EventEmitter();

  @ViewChild('stepper') private myStepper: MatStepper;
  @ViewChild('personal') private personal: WorkCuadrillaPersonalComponent;
  @ViewChild('material') private material: WorkCuadrillaMaterialComponent;
  @ViewChild('petreos') private petreos: WorkCuadrillaPetreosRapComponent;
  @ViewChild('equipos') private equipos: WorkCuadrillaEquipoComponent;
  @ViewChild('retiros') private retiros: WorkCuadrillaRetiroComponent;
  @ViewChild('calidad') private calidad: WorkCuadrillaCalidadComponent;
  @ViewChild('observaciones') private observaciones: WorkCuadrillaObservacionesComponent;
  @ViewChild('obra') private obra: WorkCuadrillaObraComponent;

  cuadrillaGeneral: CuadrillaGeneralModel;
  /** Constantes a usar en el componente */
  constants = CONST_REGISTRO_DIARIO_CUADRILLA;
  constantsEstadoPeticion = CONST_REGISTRO_DIARIO_CUADRILLA_ESTADO_PETICION;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: any;
  lengthList: Number;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  sixthFormGroup: FormGroup;
  seventhFormGroup: FormGroup;
  eighthFormGroup: FormGroup;
  ninthFormGroup: FormGroup;
  tenthFormGroup: FormGroup;
  eleventhFormGroup: FormGroup;
  twelfthFormGroup: FormGroup;
  thirteenthFormGroup: FormGroup;
  fourteenthFormGroup: FormGroup;
  fiveteenthFormGroup: FormGroup;
  sixteenthFormGroup: FormGroup;
  currentAction: any;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  enviadaAll = false;
  loader = false;
  isOptional = false;
  action = 'list';
  noInfoToShow = false;
  climaManiana: any;
  climaTarde: any;
  climaNoche: any;
  serviceVigilancia: any;
  serviceVigilanciaHoras: any;
  avanceDiarioObra: any;
  avanceAcumuladoObra: any;
  apruebaCuadrilla: any;
  acumuladoPorcentaje: any;
  public petitionCreate = null;
  public petitionUpdate = null;
  estadoRegistroDiarioElaborado: ListaItem;
  /** Definición de las columnas presentadas en la grilla */
  columns = [];
  volumenesPorMaterial = [];

  /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;

  // tslint:disable-next-line: max-line-length

  /**
  * Método encargado de construir una instancia
  */
  // tslint:disable-next-line: max-line-length
  constructor(private _formBuilder: FormBuilder, private dialog: MatDialog, private snackBar: MatSnackBar, private serviceCuadrillaGeneral: CuadrillaGeneralService, private utilitiesServices: UtilitiesService, private mapService: MapService, private commonService: CommonService) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.columnsTableDataSource();
    this.loadData();
    this.formValidation();
    this.sumarVolumenPorMaterial();
    // tslint:disable-next-line: max-line-length
    this.commonService.getListaItemByNombreListaAndValorItem('UMV_CUADRILLA_INT_REGISTRO_DIARIO_CUADRILLA', 'ELABORADO').subscribe(listaItem => {
      this.estadoRegistroDiarioElaborado = listaItem;
    });
  }

  sumarVolumenPorMaterial() {
    if (this.mantenimiento.intervenciones && this.mantenimiento.intervenciones.length > 0) {
      for (const intervencion of this.mantenimiento.intervenciones) {
        if (intervencion.cuadrillas && intervencion.cuadrillas.length > 0) {
          for (const cuadrilla of intervencion.cuadrillas) {
            this.addVolumenMaterial(cuadrilla);
          }
        }
      }
    }
  }

  addVolumenMaterial(cuadrilla: any) {
    cuadrilla.petreos.forEach(petreo => {
      if (petreo.claseMaterial === null) {
        petreo.claseMaterial = undefined;
      }

      let index = -1;
      if (petreo.claseMaterial) {
        // tslint:disable-next-line: max-line-length
        index = this.volumenesPorMaterial.findIndex(vol => vol.claseMaterial !== undefined && vol.claseMaterial.id === petreo.claseMaterial.id);
      } else {
        index = this.volumenesPorMaterial.findIndex(volumen => volumen.claseMaterial === undefined);
      }

      if (index === -1) {
        this.volumenesPorMaterial.push({
          claseMaterial: petreo.claseMaterial,
          sumaVolumenEntrada: petreo.volumenEntrada,
          sumaVolumenSalida: petreo.volumenSalida,
          sumaVolumenUtilizado: petreo.volumenUtilizado
        });
      } else {
        this.volumenesPorMaterial[index].sumaVolumenEntrada += petreo.volumenEntrada;
        this.volumenesPorMaterial[index].sumaVolumenSalida += petreo.volumenSalida;
        this.volumenesPorMaterial[index].sumaVolumenUtilizado += petreo.volumenUtilizado;
      }
    });
  }


  formStatusView() {
    this.climaManiana = [null];
    this.climaTarde = [null];
    this.climaNoche = [null];
    this.serviceVigilancia = ['', Validators.required];
    this.serviceVigilanciaHoras = ['', Validators.required];
    // tslint:disable-next-line: max-line-length
    this.avanceDiarioObra = [null, Validators.compose([Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('[0-9]*')])];
    // tslint:disable-next-line: max-line-length
    this.avanceAcumuladoObra = [null, Validators.compose([Validators.required, Validators.min(0), Validators.max(999), Validators.pattern('[0-9]*')])];
    this.apruebaCuadrilla = [{ value: null, disabled: true }];

    if (!this.componentVisible) {
      this.climaManiana = [{ value: null, disabled: true }];
      this.climaTarde = [{ value: null, disabled: true }];
      this.climaNoche = [{ value: null, disabled: true }];
      this.serviceVigilancia = [{ value: null, disabled: true }];
      this.serviceVigilanciaHoras = [{ value: null, disabled: true }];
      this.avanceDiarioObra = [{ value: null, disabled: true }];
      this.avanceAcumuladoObra = [{ value: null, disabled: true }];
      this.apruebaCuadrilla = [null];
    }
  }

  formValidation() {
    this.formStatusView();
    this.firstFormGroup = this._formBuilder.group({
      civ: [{ value: null, disabled: true }],
      pk: [{ value: null, disabled: true }],
      barrio: [{ value: null, disabled: true }],
      localidad: [{ value: null, disabled: true }],
      upz: [{ value: null, disabled: true }],
      ejeVial: [{ value: null, disabled: true }],
      ejeVialDesde: [{ value: null, disabled: true }],
      ejeVialHasta: [{ value: null, disabled: true }],
      longitud: [{ value: null, disabled: true }],
      ancho: [{ value: null, disabled: true }],
      area: [{ value: null, disabled: true }],
      programa: [{ value: null, disabled: true }],
      areIntervencion: [{ value: null, disabled: true }],
      longitudTotalIntervencion: [{ value: null, disabled: true }],
      tipoIntervencion: [{ value: null, disabled: true }],
      tipoPmt: [{ value: null, disabled: true }],
      coi: [{ value: null, disabled: true }],
      fechaInicio: [{ value: null, disabled: true }],
      fechaHasta: [{ value: null, disabled: true }],
      climaManiana: this.climaManiana,
      climaTarde: this.climaTarde,
      climaNoche: this.climaNoche,
      serviceVigilancia: this.serviceVigilancia,
      serviceVigilanciaHoras: this.serviceVigilanciaHoras
    });
    this.secondFormGroup = this._formBuilder.group({
      fechaCreacionInforme: [{ value: null, disabled: true }],
      fechaInforme: [{ value: null, disabled: true }],
      jornada: [{ value: null, disabled: true }],
      noInforme: [{ value: null, disabled: true }],
      // tslint:disable-next-line: max-line-length
      avanceDiarioObra: this.avanceDiarioObra,
      // tslint:disable-next-line: max-line-length
      avanceAcumuladoObra: this.avanceAcumuladoObra,
      estadoObra: [{ value: null, disabled: true }],
      registroDiarioCuadrilla: [{ value: null, disabled: true }],
      fotoTerminacionObra: [null],
    });
    this.thirdFormGroup = this._formBuilder.group({
      successForm: ['', Validators.required]
    });
    this.fourthFormGroup = this._formBuilder.group({
      successForm: ['', Validators.required]
    });
    this.fifthFormGroup = this._formBuilder.group({
      successForm: ['', Validators.required]
    });
    this.sixthFormGroup = this._formBuilder.group({
      successForm: ['']
    });
    this.seventhFormGroup = this._formBuilder.group({
      successForm: ['']
    });
    this.eighthFormGroup = this._formBuilder.group({
      successForm: ['']
    });
    this.ninthFormGroup = this._formBuilder.group({
      successForm: ['']
    });
    this.tenthFormGroup = this._formBuilder.group({
      successForm: ['']
    });
    this.eleventhFormGroup = this._formBuilder.group({
      successForm: ['']
    });
    this.twelfthFormGroup = this._formBuilder.group({
      successForm: ['']
    });
    this.thirteenthFormGroup = this._formBuilder.group({
      successForm: ['']
    });
    this.fourteenthFormGroup = this._formBuilder.group({
      successForm: ['']
    });
    this.fiveteenthFormGroup = this._formBuilder.group({
      successForm: ['']
    });
    this.sixteenthFormGroup = this._formBuilder.group({
      apruebaCuadrilla: this.apruebaCuadrilla
    });
  }

  columnsTableDataSource() {
    if (!this.onlyRead) {
      this.columns = [
        'pk',
        'fechaCreacionInforme',
        'jornada',
        'directorObra',
        'acciones'
      ];
    } else {
      this.columns = [
        'posicion',
        'porcentajeAcumuladoObra',
        'pk',
        'areaTotal',
        'longitudTotal',
        'activo',
        'acciones'
      ];
    }

  }

  /**
   * Método encargado de gestionar la carga de los pks
   * de la grilla al iniciar el componente.
   */
  loadData(): void {
    if (this.mantenimiento.intervenciones[0].cuadrillas !== undefined) {
      this.loader = false;
      // tslint:disable-next-line: max-line-length
      this.acumuladoPorcentaje = this.mantenimiento.intervenciones[0].cuadrillas.sort((a, b) => b.id - a.id).find(avanceAcumulado => avanceAcumulado.avance.length > 0);
      this.dataSource = new MatTableDataSource(this.mantenimiento.intervenciones[0].cuadrillas);
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

  saveSeccionCuadrilla(event) {
    if (event.requestType === 'update') {
      this.updateRow(event);
    } else {
      this.createRow(event);
    }
  }

  saveAll() {
    if (this.cuadrillaGeneral.avance !== undefined && this.cuadrillaGeneral.avance !== null
      && this.cuadrillaGeneral.avance.length > 0 ) {
      this.cuadrillaGeneral.avance[0].estadoRegistroDiario = this.estadoRegistroDiarioElaborado;
      // tslint:disable-next-line: max-line-length
      const event = { requestType: 'update', evento: 'loadData', owner: 'obra', nextStepper: true, cuadrillaGeneral: this.cuadrillaGeneral };
      this.updateRow(event);
    }

    if (this.componentVisible) {
      this.saveAllForm.emit({ nextTransition: true });
    } else {
      this.saveAllForm.emit({ nextTransition: true });
    }
  }

  createRow(event) {
    if (this.petitionCreate) {
      this.petitionCreate.unsubscribe();
    }
    this.serviceCuadrillaGeneral.listenerSendStatus(this.constantsEstadoPeticion.enviando);
    this.cuadrillaGeneral = event.cuadrillaGeneral;
    this.petitionCreate = this.serviceCuadrillaGeneral.create(event.cuadrillaGeneral).subscribe((data) => {
      this.snackBar.open(
        this.constants.successEdit, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      }
      );
      this.mantenimiento.intervenciones[0].cuadrillas.push(data);
      this.cuadrillaGeneral = data;

      this.eventManagament(event);

      if (event.nextStepper) {
        this.nextStepper();
      }
      this.serviceCuadrillaGeneral.listenerSendStatus(this.constantsEstadoPeticion.ok);
    }, error => {
      this.utilitiesServices.formErrorMessages(error, this.firstFormGroup, this.snackBar);
      this.serviceCuadrillaGeneral.listenerSendStatus(this.constantsEstadoPeticion.error);
    });
  }

  updateRow(event) {
    if (this.petitionUpdate) {
      this.petitionUpdate.unsubscribe();
    }
    this.serviceCuadrillaGeneral.listenerSendStatus(this.constantsEstadoPeticion.enviando);
    this.cuadrillaGeneral = event.cuadrillaGeneral;
    this.petitionUpdate = this.serviceCuadrillaGeneral.update(event.cuadrillaGeneral).subscribe((data) => {
      this.snackBar.open(
        this.constants.successEdit, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      }
      );

      for (let i = 0; i < this.mantenimiento.intervenciones[0].cuadrillas.length; i++) {
        if (this.mantenimiento.intervenciones[0].cuadrillas[i].id === data.id) {
          this.mantenimiento.intervenciones[0].cuadrillas[i] = data;
          break;
        }
      }

      this.cuadrillaGeneral = data;

      this.eventManagament(event);

      if (event.nextStepper) {
        this.nextStepper();
      }
      this.serviceCuadrillaGeneral.listenerSendStatus(this.constantsEstadoPeticion.ok);
    }, error => {
      this.utilitiesServices.formErrorMessages(error, this.firstFormGroup, this.snackBar);
      this.serviceCuadrillaGeneral.listenerSendStatus(this.constantsEstadoPeticion.error);
    });
  }

  eventManagament(event) {
    if (event.evento === 'loadData' && event.owner === 'personal') {
      this.personal.loadData();
    } else if (event.evento === 'loadData' && event.owner === 'material') {
      this.material.loadData();
    } else if (event.evento === 'loadData' && event.owner === 'petreos') {
      this.petreos.loadData();
    } else if (event.evento === 'loadData' && event.owner === 'equipos') {
      this.equipos.loadData();
    } else if (event.evento === 'loadData' && event.owner === 'retiros') {
      this.retiros.loadData();
    } else if (event.evento === 'loadData' && event.owner === 'calidad') {
      this.calidad.loadData();
    } else if (event.evento === 'loadData' && event.owner === 'observaciones') {
      this.observaciones.loadData();
    } else if (event.evento === 'loadData' && event.owner === 'obra') {
      this.obra.loadData();
    }
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(cuadrilla: CuadrillaGeneralModel) {
    this.cuadrillaGeneral = cuadrilla;
    this.action = 'save';
    this.vieMap.emit({ show: false });
    this.componentVisible = false;
    this.formValidation();
  }

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(cuadrilla: CuadrillaGeneralModel) {
    this.cuadrillaGeneral = cuadrilla;
    this.action = 'save';
    this.vieMap.emit({ show: false });
    this.componentVisible = true;
    this.formValidation();
  }

  /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la creación de un objeto del componente.
   */
  create(): void {
    this.cuadrillaGeneral = null;
    this.action = 'save';
    this.vieMap.emit({ show: false });
    this.componentVisible = true;
    this.formValidation();
  }

  onBack() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);
    this.utilitiesServices.scrollToTop();

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.loadData();
        this.action = 'list';
        this.vieMap.emit({ show: false });
        this.saveAllForm.emit({ nextTransition: false });
      }
    });
  }

  onBackList() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.currentAction = 'list';
        this.back.emit({ currentAction: this.currentAction });
      }
    });
  }

  nextStepper() {
    this.myStepper.next();
  }

  nextToStepper(event) {
    if (event.nextToStepper) {
      this.myStepper.next();
    }
  }

  snackBackMsj() {
    this.snackBar.open(
      this.constants.successEdit, 'X', {
      duration: 5000,
      panelClass: ['success-snackbar']
    }
    );
  }

}
