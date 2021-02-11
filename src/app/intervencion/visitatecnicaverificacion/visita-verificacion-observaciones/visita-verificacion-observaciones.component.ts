import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { CONST_INTERVENCION_VISITA_VERIFICACION } from '../visitatecnicaverificacion.constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';



@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-visita-verificacion-observaciones',
  templateUrl: './visita-verificacion-observaciones.component.html'
})
export class VisitaVerificacionObservacionesComponent implements OnInit {
  @Input() mantenimiento: WorkflowMantenimientoModel;
  @Output() saveObservaciones = new EventEmitter;
  @Input() isEditable = true;
  @Input() loading = false;

  mantenimientoInternal: WorkflowMantenimientoModel;

 /** Constantes a usar en el componente */
  constants = CONST_INTERVENCION_VISITA_VERIFICACION;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  @Output() saveRegistro = new EventEmitter;


  /**
  * Método encargado de construir una instancia
  */
  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar) {
   }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.mantenimientoInternal = JSON.parse(JSON.stringify(this.mantenimiento));
    this.form = this.formBuilder.group({
      observaciones: [null, Validators.compose([Validators.required, Validators.maxLength(600)])]
    });
    if (!this.isEditable) {
      this.form.get('observaciones').disable();
    }
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.disableSubmit = true;
    if (this.formIsValid() === true) {
      this.disableSubmit = true;
      this.saveSeccion();
    } else {
      this.disableSubmit = false;
      this.enviada = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }
    /**
  * Marks all controls in a form group as touched and validate
  * @param formGroup - The form group to touch
  */
 private markAndValidateAllInputs(anyForm: FormGroup) {
  // tslint:disable-next-line: forin
  for (const inner in anyForm.controls) {
    anyForm.get(inner).markAsTouched();
    anyForm.get(inner).updateValueAndValidity();
  }
}

public getFormValue(): any {
  return this.form.value;
}

public formIsValid() {
  return this.form.valid;
}

  saveSeccion() {
    this.saveRegistro.emit({mantenimiento: JSON.parse(JSON.stringify(this.mantenimientoInternal))});
  }

}
