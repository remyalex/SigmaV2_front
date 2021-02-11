import { Component, OnInit, Input, ViewChild, Optional, Self, ChangeDetectionStrategy } from '@angular/core';
import { CONST_SHARED } from '../../constantes-shared';
import { FormControl, NgControl, FormControlName, AbstractControl, ControlValueAccessor } from '@angular/forms';
import { MatInput, MatFormFieldControl } from '@angular/material';
import { SigmaFormInputComponent } from '../sigma-form-input/sigma-form-input.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-form-textarea',
  templateUrl: './sigma-form-textarea.component.html',
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: SigmaFormInputComponent
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigmaFormTextareaComponent implements OnInit, ControlValueAccessor {

  /** Constantes a usar en el componente */
  constants = CONST_SHARED;
  /** Valor de tipo string con el dat ingresado por el usuario*/
  valueString = '';
  /** Control de formulario al que se asocia el campo */
  control: FormControl = new FormControl();
  /** Bandera de control para saber si el campo es requerido en el formulario o no */
  required = false;
  /** Listado de errores personalizados que puede presentar el componente */
  basicErrors = [];

  /** Cantidad máxima de caracteres permitida en el campo*/
  @Input() maxlength = 0;
  /** Cantidad mínima de caracteres permitida en el campo*/
  @Input() minlength = 0;
  /** Bandera que indica si el campo se debe capturar en máyusculas */
  @Input() upper = false;
  /** Listado de errores personalizados permitidos por el componente */
  @Input() errors: [] = [];
  /** Clase a la que pertenece el campo input del formulario */
  @Input() class = '';
  /** Bandera que permite saber si el campo del formulario se pressentará solo de lectura */
  @Input() readonly = false;
  /**  Usado por un componente externo*/
  @Input() otherOriginFieldMsj = false;

  @Input() rows = 2;


  /** Propiedad Placeholder asociado al campo del formulario */
  @Input()
  get placeholder() {
    return this.input.placeholder;
  }
  set placeholder(plh) {
    this.input.placeholder = plh;
  }

  /** Propiedad value asociada al campo del formulario */
  @Input()
  get value() {
    return this.input.value;
  }
  set value(val) {
    this.input.value = val;
  }

  /** Entrada de tipo de componente que define el campo en el formulario */
  @ViewChild('input') input: MatInput;

  /** Definición del método que es llamado al momento de cambiar el dato del
   * campo del formulario */
  onChange = (_: any) => { };

  /** Definición del método que es llamado al momento de realizar acción sobre el
   * campo del formulario */
  onTouch = () => { };

  /**
   * Método encargado de construir una instancia de componente
   *
   * @param ngControl Control de tipo de ng del componente del formulario
   * @param _controlName Nombre del Control a usar en el formulario
   */
  constructor(
    @Optional() @Self() ngControl: NgControl,
    @Optional() private _controlName: FormControlName
  ) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    // tslint:disable-next-line: max-line-length
    this.basicErrors = [{ name: 'required', message: this.constants.campoRequerido }, { name: 'pattern', message: this.msjReturn() }];

    if (this._controlName) {
      this.control = this._controlName.control;
    }
    this.activeRequired(this.control);
    this.addErrors();
  }

  /**
   * Método encargado de asignar la bandera de activo al contol
   * indicado
   *
   * @param control Control al cual se le asignará la bandera de requerida
  */
  activeRequired(control: FormControl) {
    if (control.validator !== undefined) {
      const validator = control.validator({} as AbstractControl);

      if (validator && validator.required) {
        this.required = true;
      }
    }
  }

  /**
   * Método encargado de adicionar los errores identificados
   * en el validator a la sección de errores del campo del formulario
   */
  addErrors() {
    if (this.errors.length > 0) {
      this.errors.map(item => {
        this.basicErrors.push(item);
      });
    }
  }

  /**
  * Método encargado de establecer el valor digitado por el usuario
  * a la variable del modelo del componente
  *
  * @param value valor digitado por el usuario en el campo del formulario
  **/
  writeValue(value: any) {
    this.valueString = value;
  }

  /**
   * Método encargado de registar la funcion ingresada al onchange
   * del componente
   *
   * @param fn Funcion con la que se definirá la acción onchange
   * del control del formulario
   **/
  registerOnChange(fn) {
    this.onChange = fn;
  }

  /**
  * Método encargado de registar la funcion ingresada al ontouched
  * del componente
  *
  * @param fn Funcion con la que se definirá la acción ontouched
  * del control del formulario
  **/
  registerOnTouched(fn) {
    this.onTouch = fn;
  }

  /** Método encargado de establecer el estado de deshabilitado del
  * campo del formulario en el componente
  *
  * @param isDisabled Valor que indica si el campo se encuentra en estado
  * dehabilitado
  **/
  setDisabledState(isDisabled: boolean): void { }

  /**
   * Método encargado de asignar el valor al campo dl formulario
   * @param value Valor a asignar al campo del formulario
   */
  inputValue(value: string) {
    this.valueString = value;
    if (!this.control.disabled) {
      this.onTouch();
      this.onChange(this.valueString);
    }
  }

  msjReturn(): string {
    let msjResponse = this.constants.campoNoFormato;

    if (this.otherOriginFieldMsj) {
      if (this.placeholder === 'Cantidad(m3)') {
        msjResponse = 'La cantidad máxima de caracteres es de 14,2';
      }
      if (this.placeholder === 'Cantidad de personal por cada inspector') {
        msjResponse = 'La cantidad mínima debe ser mayor a cero';
      }
    }
    return msjResponse;
  }


}
