import { CONST_REGISTRAR_CHEQUEOSST } from './registrar-chequeo-sst.constant';
import { MatDialog } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { ListaChequeoSstArchivo } from './../../../models/ListaChequeoSstArchivo.model';
import { ListaChequeoSst } from './../../../models/listaChequeoSst.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { Component, OnInit, AfterViewInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialogConfig } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { Intervencion } from 'src/app/intervencion/models/intervencionModel.model';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { InputFileMaxValidator } from 'src/app/shared/form/input.file';
import { ProfileService } from 'src/app/seguridad/services/profile.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-registrar-chequeo-sst',
  templateUrl: './registrar-chequeo-sst.component.html'
})
export class RegistrarChequeoSSTComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  /** Constantes a usar en el componente */
  public constants = CONST_REGISTRAR_CHEQUEOSST;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'posicion',
    'pk',
    'civ',
    'fechaProgramacionIntervencion',
    'turnoEjecucionIntervencion',
    'zona',
    'localidad',
    'nombreResidenteSST'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'zona',
    'localidad',
    'upla',
    'cuadrante',
    'pk',
    'civ',
    'barrio',
    'fechasIntervencion'
  ];
  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente */
  acciones: GridAccion[] = [];

  public opciones = [
    { name: this.constants.si, value: 1, id: 1 },
    { name: this.constants.no, value: 0, id: 2 }
  ];

  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  listaChequeoSst: ListaChequeoSst;
  public listaChequeoSstInfo: ListaChequeoSst = new ListaChequeoSst();
  listaChequeoSstArchivo: ListaChequeoSstArchivo;
  requerido = true;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  fecha: string;
  mantenimiento: WorkflowMantenimientoModel;

  /**Contenedor de los elementos del formulario */
  public form: FormGroup;
  public disableSubmit = true;
  public disabledForm = false;
  showTransition = false;

  defaulFilters: KeyValuePair[] = [];

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
    private profileService: ProfileService,
  ) {
    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
  }

  setFormulario(disabled = false) {
    this.form = this.formBuilder.group({
      fecha: [{ value: null, disabled: true }, [Validators.required]],
      tieneCarpa: [{ value: null, disabled: disabled }, [Validators.required]],
      cantidadCarpa: [{ value: null, disabled: disabled }, Validators.compose([Validators.min(1), Validators.max(99), Validators.pattern('[0-9]*')])],
      tieneBotiquin: [{ value: null, disabled: disabled }, Validators.compose([Validators.required])],
      cantidadBotiquin: [{ value: null, disabled: disabled }, Validators.compose([Validators.min(1), Validators.max(99), Validators.pattern('[0-9]*')])],
      tieneCamilla: [{ value: null, disabled: disabled }, Validators.compose([Validators.required])],
      cantidadCamilla: [{ value: null, disabled: disabled }, Validators.compose([Validators.min(1), Validators.max(99), Validators.pattern('[0-9]*')])],
      tieneInmovilizadores: [{ value: null, disabled: disabled }, Validators.compose([Validators.required])],
      cantidadInmovilizadores: [{ value: null, disabled: disabled }, Validators.compose([Validators.min(1), Validators.max(99), Validators.pattern('[0-9]*')])],
      tieneExtintor: [{ value: null, disabled: disabled }, Validators.compose([Validators.required])],
      cantidadExtintor: [{ value: null, disabled: disabled }, Validators.compose([Validators.min(1), Validators.max(99), Validators.pattern('[0-9]*')])],
      tieneSenalizacionSst: [{ value: null, disabled: disabled }, Validators.compose([Validators.required])],
      cantidadSenalizacionSst: [{ value: null, disabled: disabled }, Validators.compose([Validators.min(1), Validators.max(99), Validators.pattern('[0-9]*')])],
      tieneMaquinaria: [{ value: null, disabled: disabled }, Validators.compose([Validators.required])],
      cantidadMaquinaria: [{ value: null, disabled: disabled }, Validators.compose([Validators.min(1), Validators.max(99), Validators.pattern('[0-9]*')])],
      tieneAuxiliaresTrafico: [{ value: null, disabled: disabled }, Validators.compose([Validators.required])],
      cantidadAuxiliaresTrafico: [{ value: null, disabled: disabled }, Validators.compose([Validators.min(1), Validators.max(99), Validators.pattern('[0-9]*')])],
      coi: [{ value: null, disabled: disabled }, Validators.compose([Validators.required])],
      fechaCoi: [{ value: null, disabled: disabled }, Validators.compose([Validators.required])],
      usoEpp: [{ value: null, disabled: disabled }, Validators.compose([Validators.required])],
      cantidadUsoEpp: [{ value: null, disabled: disabled }, Validators.compose([Validators.min(1), Validators.max(99), Validators.pattern('[0-9]*'), Validators.required])],
      senalizacionPmt: [{ value: null, disabled: disabled }, Validators.compose([Validators.required])],
      cantidadSenalizacionPmt: [{ value: null, disabled: disabled }, Validators.compose([Validators.min(1), Validators.max(99), Validators.pattern('[0-9]*'), Validators.required])],
      archivoId: [{ value: null, disabled: disabled }, Validators.compose([Validators.required])],
      registroFotografico: [{ value: null, disabled: disabled }, Validators.compose([Validators.required, InputFileMaxValidator(5)])],
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.defaulFilters.push({ key: 'actividadActualProcesoParaleloId', value: this.data.actividad.id.toString() });

    this.profileService.isGranted(this.constants.permiso_registrar_chequeoSST_create).subscribe(data => {
      if (data.state) {
        this.acciones.push({ nombre: 'registrarChequeoSst', label: 'Registrar Chequeo SSt', icono: 'note_add', color: 'primary' });
      }
    });

    this.profileService.isGranted(this.constants.permiso_registrar_chequeoSST_view).subscribe(data => {
      if (data.state) {
        this.acciones.push({ nombre: 'verRegistroChequeoSst', label: 'Registrar Chequeo SSt', icono: 'visibility', color: 'primary' });
      }
    });

    this.enviada = false;
    this.listaChequeoSst = new ListaChequeoSst();
    this.listaChequeoSstArchivo = new ListaChequeoSstArchivo();

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

  executeSingleAction(event) {
    switch (event.accion) {
      case 'registrarChequeoSst':
        this.disabledForm = false;
        this.setFormulario(this.disabledForm);
        this.mantenimiento = event.mantenimiento;
        this.currentAction = 'registrarChequeoSst';
        this.registrarChequeoSst(event.mantenimiento);
        this.mapService.getVisor().visible = false;
        break;
      case 'verRegistroChequeoSst':
        this.disabledForm = true;
        this.setFormulario(this.disabledForm);
        this.mantenimiento = event.mantenimiento;
        this.registrarChequeoSst(event.mantenimiento);
        this.mapService.getVisor().visible = false;
        break;
    }
  }

  registrarChequeoSst(mantenimiento: WorkflowMantenimientoModel) {
    this.listaChequeoSst = new ListaChequeoSst();
    this.data.mantenimiento = mantenimiento;

    if (!this.data.mantenimiento.intervenciones) {
      this.data.mantenimiento.intervenciones = [];
    }

    if (this.data.mantenimiento.intervenciones.length > 0) {
      if (this.data.mantenimiento.intervenciones[0].listaChequeoSst.length > 0) {
        this.listaChequeoSst = this.data.mantenimiento.intervenciones[0].listaChequeoSst[0];
        // tslint:disable-next-line: max-line-length
        this.listaChequeoSst.tieneCarpaSelect = { value: this.listaChequeoSst.tieneCarpa ? 1 : 0, id: this.listaChequeoSst.tieneCarpa ? 1 : 2 };
        // tslint:disable-next-line: max-line-length
        this.listaChequeoSst.tieneBotiquinSelect = { value: this.listaChequeoSst.tieneBotiquin ? 1 : 0, id: this.listaChequeoSst.tieneBotiquin ? 1 : 2 };
        // tslint:disable-next-line: max-line-length
        this.listaChequeoSst.tieneCamillaSelect = { value: this.listaChequeoSst.tieneCamilla ? 1 : 0, id: this.listaChequeoSst.tieneCamilla ? 1 : 2 };
        // tslint:disable-next-line: max-line-length
        this.listaChequeoSst.tieneInmovilizadoresSelect = { value: this.listaChequeoSst.tieneInmovilizadores ? 1 : 0, id: this.listaChequeoSst.tieneInmovilizadores ? 1 : 2 };
        // tslint:disable-next-line: max-line-length
        this.listaChequeoSst.tieneExtintorSelect = { value: this.listaChequeoSst.tieneExtintor ? 1 : 0, id: this.listaChequeoSst.tieneExtintor ? 1 : 2 };
        // tslint:disable-next-line: max-line-length
        this.listaChequeoSst.tieneSenalizacionSstSelect = { value: this.listaChequeoSst.tieneSenalizacionSst ? 1 : 0, id: this.listaChequeoSst.tieneSenalizacionSst ? 1 : 2 };
        // tslint:disable-next-line: max-line-length
        this.listaChequeoSst.tieneMaquinariaSelect = { value: this.listaChequeoSst.tieneMaquinaria ? 1 : 0, id: this.listaChequeoSst.tieneMaquinaria ? 1 : 2 };
        // tslint:disable-next-line: max-line-length
        this.listaChequeoSst.tieneAuxiliaresTraficoSelect = { value: this.listaChequeoSst.tieneAuxiliaresTrafico ? 1 : 0, id: this.listaChequeoSst.tieneAuxiliaresTrafico ? 1 : 2 };
      } else {
        this.data.mantenimiento.intervenciones[0].listaChequeoSst = [];
      }

      this.currentAction = 'registrarChequeoSst';

    } else {
      this.showMessageSnackBar('El PK no cuenta con una Intervención');
    }

  }

  back(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          this.disableSubmit = true;
          this.showTransition = false;
          this.currentAction = 'list';
          setTimeout(() => {
            this.mapService.getVisor().visible = true;
          }, 100);
        }
      }
    );
  }

  validateUploadFile(boolean) {
    this.requerido = boolean;
  }

  changeTiene(value, tieneAttr, cantidadAttr) {
    if (value) {
      this.listaChequeoSst[tieneAttr] = value.value;

      if (this.listaChequeoSst[tieneAttr]) {
        // this.listaChequeoSst[cantidadAttr] = 1;
        const rank = this.validatorData(cantidadAttr);
        // tslint:disable-next-line: max-line-length
        this.form.get(cantidadAttr).setValidators([Validators.required, Validators.min(rank.min), Validators.max(rank.max), Validators.pattern('[0-9]*')]);
      } else {
        // this.listaChequeoSst[cantidadAttr] = 0;
        this.form.get(cantidadAttr).setValidators([Validators.min(0), Validators.max(99), Validators.pattern('[0-9]*')]);
      }
    }
  }

  validatorData(attr) {
    const object: any = [];
    object.min = 1;
    object.max = 99;

    switch (attr) {
      case 'cantidadBotiquin':
        object.max = 5;
        break;
      case 'cantidadInmovilizadores':
        object.max = 1;
        break;
      case 'cantidadExtintor':
        object.max = 10;
        break;
      case 'cantidadSenalizacionSst':
        object.max = 20;
        break;
      case 'cantidadAuxiliaresTrafico':
        object.max = 10;
        break;
    }

    return object;
  }

  saveAllShow() {
    this.showTransition = true;
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    if (this.validate(this.form)) {
      if (this.data.mantenimiento.intervenciones[0].listaChequeoSst.length === 0) {
        this.listaChequeoSst.intervencionEncabezado = new Intervencion();
        this.listaChequeoSst.intervencionEncabezado.id = this.data.mantenimiento.intervenciones[0].id;
        this.listaChequeoSst.intervencionEncabezado.mantenimiento = new WorkflowMantenimientoModel();
        this.listaChequeoSst.intervencionEncabezado.mantenimiento.id = this.data.mantenimiento.id;
        this.data.mantenimiento.intervenciones[0].listaChequeoSst.push(this.listaChequeoSst);
      } else {
        // La posición cero siempre traera la ultima visita prediseño activa
        this.listaChequeoSst = this.data.mantenimiento.intervenciones[0].listaChequeoSst[0];
        this.listaChequeoSst.intervencionEncabezado = new Intervencion();
        this.listaChequeoSst.intervencionEncabezado.id = this.data.mantenimiento.intervenciones[0].id;
        this.listaChequeoSst.intervencionEncabezado.mantenimiento = new WorkflowMantenimientoModel();
        this.listaChequeoSst.intervencionEncabezado.mantenimiento.id = this.data.mantenimiento.id;
        this.mantenimiento.intervenciones[0].listaChequeoSst[0] = this.listaChequeoSst;
      }

      this.utilitiesServices.scrollToTop();
      this.applyChange(this.mantenimiento);
    } else {
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  public applyChange(mantenimiento: WorkflowMantenimientoModel) {
    const mantenimientosActividad: WorkflowMantenimientoActividadModel[] = [];
    const mantenimientoActividad = new WorkflowMantenimientoActividadModel();
    mantenimientoActividad.mantenimiento = mantenimiento;
    mantenimientosActividad.push(mantenimientoActividad);

    this.processing = true;

    this.workflowService.createList(mantenimientosActividad).subscribe((data: any) => {
      this.mantenimiento = data[0].mantenimiento;

      this.utilitiesServices.scrollToTop();
      this.processing = false;
      this.disableSubmit = false;

      var message = this.constants.successSave;
      if (this.listaChequeoSst.id) {
        message = this.constants.successEdit;
      }

      this.snackBar.open(message, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });

      this.listaChequeoSst.id = data[0].mantenimiento.intervenciones[0].listaChequeoSst[0].id;
    }, error => {
      this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
      this.processing = false;
      this.disableSubmit = true;
    });
  }

  saveAll(): void {
    this.utilitiesServices.scrollToTop();
    super.saveAll();
  }

  addFoto(elementos) {
    let archivo = new ListaChequeoSstArchivo();
    archivo.fechaRegistro = this.utilitiesServices.convertDateToString(new Date(), "DD-MM-YYYY");

    elementos.push(archivo);
  }

  showMessageSnackBar(message: string) {
    this.snackBar.open(
      message, 'X', {
      duration: 5000,
      panelClass: ['error-snackbar']
    }
    );
  }
}
