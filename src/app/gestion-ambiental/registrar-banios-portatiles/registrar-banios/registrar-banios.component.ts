import { Component, OnInit, Input, AfterViewInit, OnDestroy, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { BanosPortatilesModel } from '../../models/banos.portatiles.model';
import { CONST_GESTION_AMBIENTAL } from '../../gestion.ambiental.constants';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { rangoRegistroHorasValidator } from 'src/app/shared/form/time.validator';

@Component({
  selector: 'sigma-registrar-banios',
  templateUrl: './registrar-banios.component.html'
})
export class RegistrarBaniosComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  /** Constantes a usar en el componente */
  public constants = CONST_GESTION_AMBIENTAL;

  @Input('mantenimiento') mantenimiento: WorkflowMantenimientoModel = new WorkflowMantenimientoModel();
  @Input('data') data: WorkflowMantenimientoActividadModel;
  @Input('transicionesIndividuales') transicionesIndividuales = [];
  @Input('disabledForm') disabledForm: boolean = false;
  @Input('banoPortatiles') banoPortatiles: BanosPortatilesModel = new BanosPortatilesModel();

  // outputs
  @Output() closeRegistro: any = new EventEmitter();
  @Output() closeAll: any = new EventEmitter();

  public cloneBanio = {};

  /**Contenedor de los elementos del formulario */
  public form: FormGroup;
  public disableSubmit = false;

  public erroresHora = [
    { name: 'rangoHoraNotValid', message: this.constants.campoRangoHora },
  ];

  tipoIntervencion = '';

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
  ) {
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
    this.mantenimiento ? this.mantenimiento : new WorkflowMantenimientoModel();

    this.form = this.formBuilder.group({
      fechaNecesidadLLegada: [{ value: null, disabled: true }, Validators.compose([Validators.required])],
      horaNecesidadLLegada: [{ value: null, disabled: this.disabledForm }, Validators.compose([Validators.required, rangoRegistroHorasValidator()])],
      fechaNecesidadRetiro: [{ value: null, disabled: this.disabledForm }, Validators.compose([Validators.required])],
      horaNecesidadRetiro: [{ value: null, disabled: this.disabledForm }, Validators.compose([Validators.required])],
      direccion: [{ value: null, disabled: this.disabledForm }, Validators.compose([Validators.maxLength(300)])],
      firma: [{ value: null, disabled: this.disabledForm }, Validators.compose([Validators.required])],
      // No modificables
      localidad: [{ value: null, disabled: true }, Validators.compose([Validators.required])],
      upla: [{ value: null, disabled: true }, Validators.compose([Validators.required])],
      barrio: [{ value: null, disabled: true }, Validators.compose([Validators.required])],
      civ: [{ value: null, disabled: true }, Validators.compose([Validators.required])],
      pk: [{ value: null, disabled: true }, Validators.compose([Validators.required])],
      tipoIntervencion: [{ value: null, disabled: true }, Validators.compose([Validators.required])],
      mantenimiento: [{ value: null, disabled: true }, Validators.compose([Validators.required])]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.findTipoIntervencion();
    if (this.banoPortatiles.id > 0) {
      this.cloneBanio = JSON.parse(JSON.stringify(this.banoPortatiles));
    } else {
      this.banoPortatiles = new BanosPortatilesModel();
    }

    if (this.mantenimiento.intervenciones[0].programacionesDiarias[0].fechaProgramacion) {
      this.banoPortatiles.fechaLlegada = this.mantenimiento.intervenciones[0].programacionesDiarias[0].fechaProgramacion;
      this.banoPortatiles.fechaRetiro = this.banoPortatiles.fechaRetiro ? this.banoPortatiles.fechaRetiro : this.mantenimiento.intervenciones[0].programacionesDiarias[0].fechaProgramacion;
      this.banoPortatiles['fechaMinima'] = this.mantenimiento.intervenciones[0].programacionesDiarias[0].fechaProgramacion;
    } else {
      this.banoPortatiles['fechaMinima'] = this.utilitiesServices.convertDateToString(new Date(), 'DD-MM-YYYY');
    }

    this.banoPortatiles.transicionEjecutada = false;
  }

  findTipoIntervencion() {
    if (this.mantenimiento.actividad) {
      this.tipoIntervencion = this.mantenimiento.actividad;
    } else {
      switch (this.mantenimiento.actividadAgrupada) {
        case 'BA':
          this.tipoIntervencion = 'MP / BACHEO';
          break;
        case 'BE':
          this.tipoIntervencion = 'BUEN ESTADO';
          break;
        case 'CA':
          this.tipoIntervencion = 'MP / CAMBIO ADOQUÍN';
          break;
        case 'CC':
          if (this.mantenimiento.tipoSuperficie.id === 904) {
            this.tipoIntervencion = 'MR / CAMBIO PARCIAL DE CARPETA';
          } else if (this.mantenimiento.tipoSuperficie.id === 903) {
            this.tipoIntervencion = 'MP / CAMBIO DE CARPETA';
          }
          break;
        case 'CCP':
          this.tipoIntervencion = 'MP / CAMBIO PARCIAL CARPETA';
          break;
        case 'CL':
          if (this.mantenimiento.tipoSuperficie.id === 902) {
            this.tipoIntervencion = 'MP / CAMBIO LOSAS';
          } else if (this.mantenimiento.tipoSuperficie.id === 904) {
            this.tipoIntervencion = 'MP / CAMBIO DE LOSAS';
          }
          break;
        case 'CLP':
          this.tipoIntervencion = 'CAMBIO PARCIAL DE LOSA';
          break;
        case 'COP':
          this.tipoIntervencion = 'CONSTRUCCION PARCIAL';
          break;
        case 'FE':
          this.tipoIntervencion = 'MP / FRESADO ESTABILIZADO';
          break;
        case 'IN':
          this.tipoIntervencion = 'EN INTERVENCIÓN';
          break;
        case 'LS':
          this.tipoIntervencion = 'MR / LIMPIEZA DE SUMINDEROS';
          break;
        case 'NA':
          if (this.mantenimiento.tipoSuperficie.id === 905) {
            this.tipoIntervencion = 'NIVELACIÓN DE ADOQUÍN';
          } else if (this.mantenimiento.tipoSuperficie.id === 904) {
            this.tipoIntervencion = 'NIVELACION ADOQUIN';
          } else if (this.mantenimiento.tipoSuperficie.id === 906) {
            this.tipoIntervencion = 'NIVELACIÓN DE ADOQUÍN';
          }
          break;
        case 'PA':
          this.tipoIntervencion = 'MP / PARCHEO';
          break;
        case 'RC':
          this.tipoIntervencion = 'RECONSTRUCCIÓN';
          break;
        case 'RH':
          this.tipoIntervencion = 'REHABILITACIÓN';
          break;
        case 'RHP':
          this.tipoIntervencion = 'REHABILITACION PARCIAL';
          break;
        case 'SC':
          this.tipoIntervencion = 'MP / SOBRE CARPETA';
          break;
        case 'SF':
          this.tipoIntervencion = 'MR / SELLO DE FISURAS';
          break;
        case 'SG':
          this.tipoIntervencion = 'MR / SELLO DE GRIETAS';
          break;
        case 'SI':
          this.tipoIntervencion = 'SIN INTERVENCIÓN';
          break;
        case 'SJ':
          this.tipoIntervencion = 'MR / SELLO DE JUNTAS';
          break;

        default:
          this.tipoIntervencion = '';
          break;
      }
    }
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.disableSubmit = true;
    if (this.form.valid) {
      this.disableSubmit = true;
      this.banoPortatiles.transicionEjecutada = true;
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
    if (!this.banoPortatiles.id) {
      this.banoPortatiles.mantenimiento = { id: this.mantenimiento.id };
      if (this.mantenimiento.banioPortatiles === null) {
        this.mantenimiento.banioPortatiles = [];
      }
      this.mantenimiento.banioPortatiles.push(this.banoPortatiles);
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
      if (this.banoPortatiles.id) {
        message = this.constants.successEdit;
      }

      this.snackBar.open(message, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });

      if (data[0].mantenimiento) {
        if (data[0].mantenimiento.banioPortatiles.length > 0) {
          this.banoPortatiles = data[0].mantenimiento.banioPortatiles[data[0].mantenimiento.banioPortatiles.length - 1];
          this.cloneBanio = JSON.parse(JSON.stringify(this.banoPortatiles));
        }
      }
    }, error => {
      this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
      this.processing = false;
      this.disableSubmit = false;
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

  executeTransition(): void {
    this.banoPortatiles.transicionEjecutada = true;
    this.data.mantenimiento = this.mantenimiento;
    this.data.mantenimiento.baniosPortatiles = true;
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
        setTimeout(() => {
          this.closeAll.emit({ close: true });
        }, 10);
      },
      error => {
        this.processing = false;
        this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
      });
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
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
        this.mantenimiento.banioPortatiles.map(item => {
          if (item.id == this.cloneBanio['id']) {
            for (let key in this.cloneBanio) {
              item[key] = this.cloneBanio[key];
            }
          }
        });
      } catch (error) { }
    }

    this.closeRegistro.emit({ close: value });
  }
}