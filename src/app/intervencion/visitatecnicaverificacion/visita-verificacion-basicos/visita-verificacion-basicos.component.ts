import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CONST_INTERVENCION_VISITA_VERIFICACION } from '../visitatecnicaverificacion.constants';
import { FormGroup, FormBuilder,   Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { WorkflowMantenimientoModel } from '../../../workflow/models/workflow-mantenimiento.model';
import { Intervencion } from '../../models/intervencionModel.model';
import { BehaviorSubject } from 'rxjs';
import { SigmaFormSelectComponent } from 'src/app/shared/component/sigma-form-select/sigma-form-select.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-visita-verificacion-basicos',
  templateUrl: './visita-verificacion-basicos.component.html'
})
export class VisitaVerificacionBasicosComponent implements OnInit {

  @Input() mantenimiento: WorkflowMantenimientoModel;
  @Input() isEditable = true;
  @Output() saveBasico = new EventEmitter;
  @Input() loading = false;

  @ViewChild('tipoViaComponente') tipoViaComponente: SigmaFormSelectComponent
  private sectionBasico = new BehaviorSubject({});
  public sectionBasico$ = this.sectionBasico.asObservable();

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
  campos: any;
  dataAux: any;

  /**
  * Método encargado de construir una instancia
  */
  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar) {
    this.loadForm();
  }

  loadForm() {
    this.campos = {
      tipoSuperficie: [null, Validators.compose([Validators.required])],
      rutaTransporte: [null, Validators.compose([Validators.required])],
      nroActa: [null, Validators.compose([Validators.required])],
      tipoEjecucion: [null, Validators.compose([Validators.required])],
      clase: [null, Validators.compose([Validators.required])],
      tipoVia: [null, Validators.compose([Validators.required])],
      // Habiitar cuando se defina el tipo de ejecición (por el sistema)
      // tipoEjecucion: [{value: null, disabled: true}, null],
    };
    this.form = this.formBuilder.group(this.campos);
  }

  public getFormValue(): any {
    this.validateTipoVia();
    return this.form.value;
  }

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.mantenimiento.intervenciones[0].activo = true;
    this.saveBasico.emit( {mantenimiento: JSON.parse(JSON.stringify(this.mantenimiento)) } );
  }


  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    this.markAndValidateAllInputs(this.form);
    // this.enviada = true;
    this.disableSubmit = true;
    if (this.formIsValid() === true) {
      this.disableSubmit = true;
      this.save();
    } else {
      this.disableSubmit = false;
      this.enviada = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  validateTipoVia(): any {
    const valTipoVia = this.tipoViaComponente.optionsList.filter(item => item.id === this.mantenimiento.tipoVia.id);
    if (valTipoVia.length === 0) {
      this.mantenimiento.tipoVia = null;
    }
  }

  public formIsValid() {
    this.validateTipoVia();
    return this.form.valid;
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
}
