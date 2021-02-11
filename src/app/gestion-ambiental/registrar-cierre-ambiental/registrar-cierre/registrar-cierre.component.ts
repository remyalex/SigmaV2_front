import { Component, OnInit, OnDestroy, AfterViewInit, Input, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { CONST_GESTION_AMBIENTAL } from '../../gestion.ambiental.constants';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CierreAmbientalModel } from '../../models/cierre.ambiental.model';
import { InputFileMaxValidator } from 'src/app/shared/form/input.file';
import { CierreAmbientalArchivoModel } from '../../models/cierre.ambiental.archivo.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { ListasService } from 'src/app/administracion/listas/services/listas.service';

@Component({
  selector: 'sigma-registrar-cierre',
  templateUrl: './registrar-cierre.component.html'
})
export class RegistrarCierreComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  /** Constantes a usar en el componente */
  public  constants = CONST_GESTION_AMBIENTAL;

  @Input('mantenimiento') mantenimiento: WorkflowMantenimientoModel = new WorkflowMantenimientoModel();
  @Input('data') data: WorkflowMantenimientoActividadModel;
  @Input('transicionesIndividuales') transicionesIndividuales = [];
  @Input('disabledForm') disabledForm: boolean = false;
  @Input('cierre') cierre: CierreAmbientalModel = new CierreAmbientalModel();

  // outputs
  @Output() closeRegistro: any = new EventEmitter();

  public cloneCierre: {};

  /**Contenedor de los elementos del formulario */
  public form: FormGroup;
  public disableSubmit = false;
  public tipoArchivos: Array<ListaItem> = [];
  public loading: boolean = true;

  public opciones = [
    { name: this.constants.si, value: 1, id: 1 },
    { name: this.constants.no, value: 0, id: 2 }
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
    private listasService: ListasService
  ) {
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);

    this.mantenimiento ? this.mantenimiento : new WorkflowMantenimientoModel();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    if (this.cierre.id > 0) {
      this.cloneCierre = JSON.parse(JSON.stringify(this.cierre));
    }

    this.setForm();
    if (this.cierre.id) {
      this.cierre.sumiderosSelect = { value: this.cierre.sumideros, id: this.cierre.sumideros ? 1 : 2 };
      this.cierre.senalizacionSelect = { value: this.cierre.senalizacion, id: this.cierre.senalizacion ? 1 : 2 };
      this.cierre.libreResiduosSelect = { value: this.cierre.libreResiduos, id: this.cierre.libreResiduos ? 1 : 2 };
      this.cierre.retiroProteccionSelect = { value: this.cierre.retiroProteccion, id: this.cierre.retiroProteccion ? 1 : 2 };
    }

    this.listasService.listByNombre('TIPO_ARCHIVOS').subscribe((items) => {
      for (let item of items) {
        this.tipoArchivos[item.valor] = item;
      }

      this.loading = false;
    },
      error => {
        this.loading = false;
      });

    this.cierre.fechaCierre = this.utilitiesServices.convertDateToString(new Date(), 'DD-MM-YYYY');
  }

  setForm() {
    this.form = this.formBuilder.group({
      tipoIntervencionTotal: [{ value: null, disabled: true }, Validators.compose([Validators.required])],
      otroTipoIntervencion: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      fechaCierre: [{ value: null, disabled: true }, Validators.compose([Validators.required])],
      localidad: [{ value: null, disabled: true }, Validators.compose([Validators.required])],
      upla: [{ value: null, disabled: true }, Validators.compose([Validators.required])],
      barrio: [{ value: null, disabled: true }, Validators.compose([Validators.required])],
      civ: [{ value: null, disabled: true }, Validators.compose([Validators.required])],
      pk: [{ value: null, disabled: true }, Validators.compose([Validators.required])],
      escombros: [{ value: null, disabled: false }, Validators.compose([Validators.required, Validators.min(1), Validators.max(1000)])],
      destinoEscombros: [{ value: null, disabled: false }, Validators.compose([Validators.required, Validators.maxLength(100)])],
      retiroProteccionZonaVerde: [{ value: null, disabled: false }, Validators.compose([Validators.required])],
      libreResiduoZonaVerde: [{ value: null, disabled: false }, Validators.compose([Validators.required])],
      registroFotograficoLibreResiduo: [{ value: null, disabled: false }, Validators.compose([Validators.required, InputFileMaxValidator(2)])],
      retiroProteccionSumidero: [{ value: null, disabled: false }, Validators.compose([Validators.required, Validators.maxLength(100)])],
      registroFotograficoSumidero: [{ value: null, disabled: false }, Validators.compose([Validators.required, InputFileMaxValidator(2)])],
      retiroProteccionSenalizacion: [{ value: null, disabled: false }, Validators.compose([Validators.required])],
      registroFotograficoSenalizacion: [{ value: null, disabled: false }, Validators.compose([Validators.required, InputFileMaxValidator(2)])],
      registroFotograficoVistaGeneral: [{ value: null, disabled: false }, Validators.compose([Validators.required, InputFileMaxValidator(2)])]
    });
  }

  /**
     * Marks all controls in a form group as touched and validate
     * @param formGroup - The form group to touch
     */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    // tslint:disable-next-line:forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    this.markAndValidateAllInputs(this.form);
    // this.disableSubmit = true;

    if (this.form.valid) {
      // this.disableSubmit = true;
      this.cierre.transicionEjecutada = true;
      this.save();
    } else {
      this.disableSubmit = false;
      this.snackBar.open(this.constants.errorForm, 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.cierre.retiroProteccion = this.cierre.retiroProteccionSelect.value;
    this.cierre.libreResiduos = this.cierre.libreResiduosSelect.value;
    this.cierre.sumideros = this.cierre.sumiderosSelect.value;
    this.cierre.senalizacion = this.cierre.senalizacionSelect.value;

    if (!this.cierre.id) {
      this.cierre.mantenimiento = { id: this.mantenimiento.id };
      this.mantenimiento.cierresAmbientales = [];
      this.mantenimiento.cierresAmbientales.push(this.cierre);
      this.mantenimiento.intervenciones[0].programacionesDiarias = [];
    }

    this.applyChange(this.mantenimiento);
  }

  public applyChange(mantenimiento: WorkflowMantenimientoModel) {
    const mantenimientosActividad: WorkflowMantenimientoActividadModel[] = [];
    const mantenimientoActividad = new WorkflowMantenimientoActividadModel();
    mantenimientoActividad.mantenimiento = mantenimiento;
    mantenimientosActividad.push(mantenimientoActividad);

    this.workflowService.createList(mantenimientosActividad).subscribe((data: any) => {
      this.mantenimiento = data[0].mantenimiento;

      this.utilitiesServices.scrollToTop();
      this.processing = false;
      this.disableSubmit = false;

      var message = this.constants.successSave;
      if (this.cierre.id) {
        message = this.constants.successEdit;
      }

      this.snackBar.open(message, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });

      if (data[0].mantenimiento) {
        if (data[0].mantenimiento.cierresAmbientales.length > 0) {
          this.cierre.id = data[0].mantenimiento.cierresAmbientales[data[0].mantenimiento.cierresAmbientales.length - 1].id;
          this.cloneCierre = JSON.parse(JSON.stringify(this.cierre));
        }
      }
    }, error => {
      this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
      this.processing = false;
      this.disableSubmit = false;
    });
  }

  setCierreAmbietal(elemento, valor) {
    if (valor.id) {
      elemento.cierreAmbiental = { id: 0 };
      elemento.cierreAmbiental.id = valor.id;
    }
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.data = {
      mensaje: this.constants.deseaSalir
    };
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val == 1) {
        this.emitClose(true);
        this.utilitiesServices.scrollToTop();
      }
    });
  }

  emitClose(value, restore = true) {
    if (restore) {
      try {
        this.mantenimiento.cierresAmbientales.map(item => {
          if (item.id == this.cloneCierre['id']) {
            for (let key in this.cloneCierre) {
              item[key] = this.cloneCierre[key];
            }
          }
        });
      } catch (error) { }
    }

    this.closeRegistro.emit({ close: value });
  }

  executeTransition(): void {
    this.cierre.transicionEjecutada = true;
    this.data.mantenimiento = this.mantenimiento;
    this.data.mantenimiento.intervenciones[0].programacionesDiarias = [];
    this.applySingleTransitionTo();
  }

  public applySingleTransitionTo(): void {
    this.workflowService.update(this.data).subscribe(
      data => {
        this.data = data;
        this.processing = false;

        this.snackBar.open(this.constants.successSave, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });

        this.emitClose(true, false);
      },
      error => {
        this.processing = false;
        this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
      });
  }

  addFoto(elementos, tipoArchivo) {

    let archivo = new CierreAmbientalArchivoModel();
    this.setCierreAmbietal(archivo, this.cierre);
    archivo.fechaRegistro = this.utilitiesServices.convertDateToString(new Date(), "DD-MM-YYYY");
    archivo.tipoArchivo = tipoArchivo;

    elementos.push(archivo);
  }

}
