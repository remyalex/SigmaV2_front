import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogConfig, MatSnackBar, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_MEJORAMIENTO_PREDISENIO } from '../predisenio.constants';
import { Predisenio } from '../models/predisenio.model';
import { UbicarApiqueComponent } from '../ubicar-apique/ubicar-apique.component';
import { PredisenioService } from '../service/predisenio.service';
import { WorkflowMantenimientoModel } from '../../../workflow/models/workflow-mantenimiento.model';

@Component({
  selector: 'sigma-predisenio-detail',
  templateUrl: './predisenio-detail.component.html'
})
export class PredisenioDetailComponent implements OnInit {

  @Input() predisenio: Predisenio;
  @Input() mantenimiento: WorkflowMantenimientoModel;
  @Output() saveFuncion = new EventEmitter();
  @Input() showCancelar = true;
  @Input() forceDisableApique = false;

  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();

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
  requerido = true;
  currentAction: any;
  disabledApique = true;
  predisenioEdit: Predisenio;
  ubicarAction: any;
  levantamientoTopografico;
  modulacionLosas;
  superficieAgrupacion = false;

  options = [
    { value: true, name: 'SI' },
    { value: false, name: 'NO' }
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
  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private dialog: MatDialog, private servicio: PredisenioService) {

    this.form = this.formBuilder.group({
      apiques: [{ value: null, disabled: true }],
      aforos: [{ value: null, disabled: true }],
      solicitud: [{ value: null, disabled: true }],
      observacionSolicitud: [{ value: null, disabled: true }],
      viableIntervencion: [{ value: null, disabled: true }],
      observacionIntervencion: [{ value: null, disabled: true }],
      observacionGestion: [{ value: null, disabled: true }],
      actividades: [{ value: null, disabled: true }],
      levantamientoTopografico: [{ value: null, disabled: true }],
      modulacionLosas: [{ value: null, disabled: true }]
    });

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    if (this.predisenio === undefined || this.predisenio === null) {
      this.predisenioEdit = new Predisenio();
    } else {
      this.predisenioEdit = this.predisenio;
      if (this.mantenimiento.tipoSuperficie.descripcion === 'RÍGIDO' && this.mantenimiento.actividadAgrupada === 'RH') {
        this.superficieAgrupacion = true;
      }
    }
  }

  loadData() {

  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.saveFuncion.emit({ mantenimiento: this.mantenimiento });
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
    } else {
      this.disableSubmit = false;
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
          this.currentAction = 'list';
          this.back.emit({ currentAction: this.currentAction });
        }
      }
    );
  }

  viewStatus(event) {
    this.ubicarAction = 1;
    this.disabledApique = true;
    if (event === '1' && this.predisenio.apiques.length > 0) {
      this.disabledApique = false;
      this.ubicarAction = 1;
    } else if (event === '1') {
      this.disabledApique = false;
      this.ubicarAction = '';
    }
  }

  ubicarApique(): void {
    this.mantenimiento.predisenio = this.predisenio;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.mantenimiento;

    const dialogRef = this.dialog.open(UbicarApiqueComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.servicio.serviceListener$.subscribe((data: any) => this.mantenimiento = data);
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
