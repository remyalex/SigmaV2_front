import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogConfig, MatSnackBar, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_MEJORAMIENTO_PREDISENIO } from '../predisenio.constants';
import { Predisenio } from '../models/predisenio.model';
import { UbicarApiqueComponent } from '../ubicar-apique/ubicar-apique.component';
import { PredisenioService } from '../service/predisenio.service';
import { WorkflowService } from '../../../workflow/services/workflow-service.service';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { UtilitiesService } from '../../../shared/services/utilities.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-predisenio-create',
  templateUrl: './predisenio-create.component.html'
})
export class PredisenioCreateComponent implements OnInit {

  @Input() mantenimiento: WorkflowMantenimientoModel;
  @Input() data: any;
  @Output() saveFuncion = new EventEmitter();

  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();
  @Output() valApiques = new EventEmitter();

  /** Constantes a usar en el componente */
  constants = CONST_MEJORAMIENTO_PREDISENIO;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  guardado = false;
  requerido = true;
  disabledApique = true;
  predisenio: Predisenio;
  ubicarAction: any = 1;
  currentAction: any;
  solicitudesApiqueData: any;
  levantamientoTopografico;
  modulacionLosas;
  validarApiques = false;
  superficieAgrupacion = false;
  public petitionList = null;


  options = [
    { value: true, name: 'SI' },
    { value: false, name: 'NO' }
  ];

  optionsSi = [
    { value: true, name: 'SI' }
  ];


  optionsList = [
    { value: '1', name: 'SI' },
    { value: '0', name: 'NO' },
    { value: '2', name: 'ALEDAÑO' }
  ];

  // tslint:disable-next-line: max-line-length

  /**
  * Método encargado de construir una instancia
  */
  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private dialog: MatDialog, private servicio: PredisenioService, private workflowService: WorkflowService, private utilitiesServices: UtilitiesService) {

    this.predisenio = new Predisenio();
    this.ubicarAction = this.predisenio ? this.predisenio.requiereApique : '';

    this.form = this.formBuilder.group({
      apiques: [null],
      aforos: [null],
      solicitud: [null],
      ubicarAction: [null, Validators.compose([Validators.required])],
      observacionSolicitud: [null, Validators.compose([Validators.maxLength(300)])],
      viableIntervencion: [null],
      observacionIntervencion: [null, Validators.compose([Validators.maxLength(300)])],
      observacionGestion: [null, Validators.compose([Validators.maxLength(300)])],
      actividades: [null],
      levantamientoTopografico: [null],
      modulacionLosas: [null]
    });

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    if (this.mantenimiento.predisenio === null) {
      this.guardado = false;
    } else if (this.mantenimiento.predisenio.id != null) {
      this.guardado = true;
    } else {
      this.guardado = false;
    }
    if (this.mantenimiento.tipoSuperficie.descripcion === 'RÍGIDO' && this.mantenimiento.actividadAgrupada === 'RH') {
      this.superficieAgrupacion = true;
    }
  }

  /** Método que se ejecuta una vez invocada la destrucción del componente */
  ngOnDestroy(): void {
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    if (this.mantenimiento.predisenio !== this.predisenio) {
      this.mantenimiento.predisenio = this.predisenio;
    }
    if (this.predisenio.requiereApique === '0') {
      this.mantenimiento.predisenio.apiques = [];
    }

    this.data.mantenimiento = this.mantenimiento;
    this.data.transicion = null;

    this.workflowService.update(this.data).subscribe((mantenimientoActividad) => {
      this.form.get('apiques').disable();
      this.mantenimiento = mantenimientoActividad.mantenimiento;
      this.predisenio = this.mantenimiento.predisenio;
      this.snackBar.open(
        this.constants.successSave, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      }
      );
      this.enviada = false;
      this.saveFuncion.emit({ mantenimiento: this.mantenimiento });
      this.valApiques.emit({ validarApiques: this.validarApiques });
    },
      error => {
        this.enviada = true;
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
      });

  }

  validateUploadFile(boolean) {
    this.requerido = boolean;
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    this.disableSubmit = true;
    if (this.form.valid === true) {
      this.disableSubmit = true;
      this.save();
      this.guardado = true;
    } else {
      this.disableSubmit = false;
      this.enviada = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
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
          if (this.guardado === true || this.mantenimiento.predisenio === null) {
            this.currentAction = 'list';
            this.back.emit({ currentAction: this.currentAction });
          } else if (this.mantenimiento.predisenio.id != null) {
            this.limpiarPredisenio();
            this.updatePredisenio();
          } else {
            this.currentAction = 'list';
            this.back.emit({ currentAction: this.currentAction });
          }
        }
      }
    );
  }

  limpiarPredisenio() {
    this.predisenio.requiereAforo = null;
    this.predisenio.requiereApique = null;
    this.predisenio.apiques = null;
    this.predisenio.solicitudesAdicionales = null;
    this.predisenio.observacionSolicitud = null;
    this.predisenio.esViableIntervencion = null;
    this.predisenio.observacionIntervencion = null;
    this.predisenio.observacionGestion = null;
    this.mantenimiento.predisenio = this.predisenio;
  }

  updatePredisenio() {
    //this.processing = true;
    this.data.mantenimiento = this.mantenimiento;
    this.data.transicion = null;
    this.workflowService.update(this.data).subscribe((mantenimientoActividad) => {
      this.predisenio = mantenimientoActividad.mantenimiento.predisenio;
      if (this.mantenimiento.predisenio.apiques && this.mantenimiento.predisenio.apiques.length === 0) {
        this.predisenio.apiques = this.solicitudesApiqueData;
      }
      this.mantenimiento.predisenio = this.predisenio;
      this.currentAction = 'list';
      this.back.emit({ currentAction: this.currentAction });
    });
  }

  viewStatus(event) {
    this.ubicarAction = 1;
    this.disabledApique = true;
    this.validarApiques = true;

    if (this.mantenimiento.predisenio) {
      if (event === '1' && this.mantenimiento.predisenio.apiques.length > 0) {
        this.validarApiques = true;
      }
    } else if (event === '1') {
      this.disabledApique = false;
      this.validarApiques = false;
      this.ubicarAction = '';
    }
    this.valApiques.emit({ validarApiques: false });
  }

  ubicarApique(): void {
    this.mantenimiento.predisenio = this.mantenimiento.predisenio !== null ? this.mantenimiento.predisenio : this.predisenio;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.mantenimiento;

    const dialogRef = this.dialog.open(UbicarApiqueComponent, dialogConfig);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.petitionList = this.servicio.serviceListener$.subscribe((data: any) => {
            if (data !== '') {
              this.enviada = true;
              this.solicitudesApiqueData = data.predisenio.apiques;
              this.ubicarAction = 1;
              if (this.mantenimiento.predisenio.id == null) {
                this.mantenimiento.predisenio.apiques = [];
              }
              this.data.mantenimiento = this.mantenimiento;
              this.data.transicion = null;
              this.workflowService.update(this.data).subscribe((mantenimientoActividad) => {
                this.enviada = false;
                this.validarApiques = true;
                this.predisenio = mantenimientoActividad.mantenimiento.predisenio;
                if (this.mantenimiento.predisenio.apiques.length === 0) {
                  this.predisenio.apiques = this.solicitudesApiqueData;
                }
                this.mantenimiento.predisenio = this.predisenio;
              });
            }
          });
        }
      }
    );
  }

  patternString(attr, data) {
    const re = /[a-zA-z]/gi;
    const newstr = data.target.value.replace(re, '');
    this.predisenio[attr] = newstr.trim();
  }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    // tslint:disable-next-line: forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

}
