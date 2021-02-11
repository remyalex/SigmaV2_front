import { Component, OnInit, Input, KeyValueChanges, KeyValueDiffer, KeyValueDiffers, ChangeDetectionStrategy, ViewChild, Optional, Self, ChangeDetectorRef, ElementRef } from '@angular/core';
import * as _moment from 'moment';
// Date time completo
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeIntl } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { FormControl, ControlValueAccessor, NgControl, FormControlName, AbstractControl, Validators } from '@angular/forms';
import { CONST_SHARED } from '../../constantes-shared';
import { MatFormFieldControl, MatInput, MatSnackBar } from '@angular/material';
import { DefaultIntl } from '../../models/default-intl.model';

/** Variable encargada de gestionar la propiedad momento de una hora  */
const moment = (_moment as any).default ? (_moment as any).default : _moment;
/** Constante con posibles valores de formatos de fecha/hora aceptados por el componente */
export const MY_CUSTOM_FORMATS = {
  parseInput: 'DD-MM-YYYY',
  fullPickerInput: 'DD-MM-YYYY HH:mm:00',
  datePickerInput: 'DD-MM-YYYY',
  timePickerInput: 'HH:mm:00',
  monthYearLabel: 'MMM YYYY',
  monthYearA11yLabel: 'MMMM YYYY',
  // Logicos de respuesta 
  YYYYMMDDHHmm: 'YYYY-MM-DD HH:mm:00',
  DDMMYYYYHHmm: 'DD-MM-YYYY HH:mm:00',
  YYYYMMDD: 'YYYY-MM-DD',
  DDMMYYYY: 'DD-MM-YYYY',
  HHmmss: '+00 HH:mm:00'
};
/** lista de constantes de días reflejados en numeros */
const DIAS_HABILES = [
  0,  // DOMINGO
  1,  // LUNES
  2,  // MARTES
  3,  // MIERCCLES
  4,  // JUEVES
  5,  // VIERNES
  6,  // SABADO
];

/** Componente encargado de gestionar el calendario */
@Component({
  selector: 'sigma-form-calendar',
  templateUrl: './sigma-form-calendar.component.html',
  providers: [
    // `MomentDateTimeAdapter` can be automatically provided by importing
    // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateTimeAdapter,
      useClass: MomentDateTimeAdapter,
      deps: [OWL_DATE_TIME_LOCALE]
    },
    {
      provide: OWL_DATE_TIME_FORMATS,
      useValue: MY_CUSTOM_FORMATS
    },
    {
      provide: MatFormFieldControl,
      useExisting: SigmaFormCalendarComponent,
      multi: true
    },
    {
      provide: OwlDateTimeIntl,
      useClass: DefaultIntl
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigmaFormCalendarComponent implements OnInit, ControlValueAccessor {

  /** Constantes a usar en el componente */
  constants = CONST_SHARED;
  /** variable tipo String que recibe fecha del componente */
  date: string = '';
  /** variable tipo String que recibe fecha a convertir */
  fechaConvert: string = '';
  /** Objeto control del formulario */
  control: FormControl = new FormControl();
  /** Variable usada para determinar si será requerido el componente */
  required: boolean = false;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  customerDiffer: KeyValueDiffer<string, any>;
  /** variale tipo string */
  target: string = 'target';
  /** Valor máximo permitido para la fecha  */
  maxDate: any;
  /** Valor mínimo permitido para la fecha  */
  minDate: any;
  /** Bandera para indicar si el componente se encuentra en procesamiento por el servicio  */
  change: boolean = false;
  /** variable tipo boolean y hace referencia a la limpieza de las entradas del componente */
  clearInput: boolean = false;
  /** objeto que contiene lista de errores posibles */
  basicErrors = [
    { name: 'required', message: this.constants.campoRequerido },
    { name: 'errorHoraMinMayor', message: this.constants.horaInicioMayor },
    { name: 'owlDateTimeParse', message: this.constants.formatoFecha },
    { name: 'owlDateTimeMin', message: this.constants.fechaMinima },
    { name: 'owlDateTimeMax', message: this.constants.fechaMaxima },
  ];

  /** Variable usada para recibir objeto en la invocación del componente */
  @Input('objeto') objeto = {};
  /** Variable usada para recibir minTarget en la invocación del componente */
  @Input('minTarget') minTarget: string;
  /** Variable usada para recibir maxTarget en la invocación del componente */
  @Input('maxTarget') maxTarget: string;
  /** Variable usada para recibir type en la invocación del componente */
  @Input('type') type: string;
  /** Variable usada para recibir lista de errores posibles en la invocación del componente */
  @Input('errors') errors: [] = [];
  /** Variable usada para recibir startAt en la invocación del componente */
  @Input('startAt') startAt: string = null;
  /** Variable usada para recibir modelo de formato en la invocación del componente */
  @Input() formatToModel: string;
  /** Variable usada para recibir lista con número de días habiles en la invocación del componente */
  @Input('diasHabiles') diasHabiles: number[] = DIAS_HABILES;

  /** Variable usada para retornar o setear valor del placeholder
   * en la invocación del componente */
  @Input()
  get placeholder() {
    //return this.input.placeholder;
    return this.input.nativeElement.placeholder;
  }
  set placeholder(plh) {
    //this.input.placeholder = plh;
    this.input.nativeElement.placeholder = plh;
  }

  /** Variable usada para retornar o setear valores de entrada 
   * en la invocación del componente */
  @Input()
  get value() {
    // return this.input.value;
    return this.input.nativeElement.value;
  }
  set value(val) {
    //this.input.value = val;
    this.input.nativeElement.value = val;
  }

  /** Componente hijo tipo ElemntRef para uso del componente */
  @ViewChild('input') input: ElementRef;  // MathInput
  /** Variable que recibe valores en el método 'registerOnChange' */
  onChange = (_: any) => { }
  /** Variable que recibe valores en el método 'registerOnTouched' */
  onTouch = () => { }

  /**
    * Método encargado de construir una instancia de la clase
    *
    * @param ngControl Componente gráfico usado para presentar cuadros de dialogo
    * @param _controlName Componente tipo FormControlName para uso del formulario
    * @param utilitiesService Componente de utilidades de peticiones a servicios
    * @param differs Elemento usado para mantener la información clonada
    * @param cdRef Componente usado para detectar los cambios del componente
    * @param snackBar Componente usado para abrir un recuadro modal
    */
  constructor(
    @Optional() @Self() ngControl: NgControl,
    @Optional() private _controlName: FormControlName,
    private utilitiesService: UtilitiesService,
    private differs: KeyValueDiffers,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar,
  ) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.customerDiffer = this.differs.find(this.objeto).create();
    if (this._controlName) {
      this.control = this._controlName.control;
    }

    this.activeRequired(this.control);
    this.addErrors();

    if (this.minTarget) {
      this.setMinDate();
    }

    if (this.maxTarget) {
      this.setMaxDate();
    }

    if (this.startAt) {
      const fechaControl = this.utilitiesService.convertDateToString(this.startAt, MY_CUSTOM_FORMATS.YYYYMMDDHHmm);
      let fechaModel = '';
      if (this.formatToModel) {
        fechaModel = this.utilitiesService.convertDateToString(this.startAt, this.formatToModel);
      } else {
        fechaModel = this.utilitiesService.convertDateToString(this.startAt, MY_CUSTOM_FORMATS.HHmmss);
      }
      this.setValue(fechaControl, fechaModel);
    }

    if (this.date) {
      this.formatoFechas();
    }

  }

  /** Método encargado de añadir los errores a lista */
  addErrors() {
    if (this.errors.length > 0) {
      this.errors.map(item => {
        this.basicErrors.push(item);
      });
    }
  }

  /** Método encargado de validar sí el parámetro recibido obliga a la
   *  variable required a cambiar su valor a verdadero
   * @param control objeto formulario recibido
   */
  activeRequired(control: FormControl) {
    if (control.validator != undefined) {
      const validator = control.validator({} as AbstractControl);

      if (validator && validator.required) {
        this.required = true;
      }
    }
  }

  /** Método encargado de notificar los cambios del componente hacia el modelo */
  ngDoCheck() {
    const changes = this.customerDiffer.diff(this.objeto);
    if (changes) {
      this.customerChanged(changes);
    }
  }

  /**
   * Método en cargado de actualizar el modelo del componente una
   * vez notificado un cambio en los campos
   *
   * @param changes Diccionario de claves que se modificaron
   */
  customerChanged(changes: KeyValueChanges<string, any>) {
    changes.forEachChangedItem((record: any) => {
      if (record.key == this.minTarget) {
        this.setMinDate();
      }

      if (record.key == this.maxTarget) {
        this.setMaxDate();
      }
    });

    changes.forEachAddedItem((record: any) => {
      if (record.key == this.minTarget) {
        this.setMinDate();
      }

      if (record.key == this.maxTarget) {
        this.setMaxDate();
      }
    });
    /* If you want to see details then use
      changes.forEachRemovedItem((record) => ...);
      changes.forEachAddedItem((record) => ...);
    */
  }

  /** Método encargado de sobreescribir la variable maxDate */
  setMaxDate() {
    if (this.objeto[this.maxTarget]) {
      let value = this.objeto[this.maxTarget];
      this.maxDate = this.utilitiesService.convertStringToDate(value, MY_CUSTOM_FORMATS.DDMMYYYYHHmm);
    } else {
      this.maxDate = null;
    }
  }

  /** Método encargado de sobreescribir la variable minDate */
  setMinDate() {
    if (this.objeto[this.minTarget]) {
      let value = this.objeto[this.minTarget];
      this.minDate = this.utilitiesService.convertStringToDate(value, MY_CUSTOM_FORMATS.DDMMYYYYHHmm);
    } else {
      this.minDate = null;
    }
  }

  /** Método encargado de ajustar formato del calendario y retorna valor
   * @param value valor tipo String limpiando horas
   */
  ajustarFormato(value: string): string {
    let data = value;
    if (this.type == this.constants.datepicker.types.timer) {
      data = this.utilitiesService.clearHora(value);
    }
    return data;
  }

  /** Método encargado de limpiar los valores del calendario */
  clearInputCalendar() {
    this.date = null;
    this.control.setValue(null);
    this.fechaConvert = null;

    this.responseInfo();
  }

  /** Método encargado de cambiar los valores del formulario con el parámetro
   * @param event objeto con los valores a cambiar
  */
  changeValue(event) {
    const diaSeleccionado = event.value.day();
    if (this.diasHabiles.indexOf(diaSeleccionado) === -1) {
      this.clearInputCalendar();
      this.snackBar.open('Día de fecha no válido', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    if (this.type == this.constants.datepicker.types.timer) {
      this.date = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.HHmmss);

      let fechaControl = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.YYYYMMDDHHmm);
      let fechaModel = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.HHmmss);
      this.setValue(fechaControl, fechaModel);
    } else if (this.type == this.constants.datepicker.types.fullCalendar) {
      this.date = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.DDMMYYYYHHmm);

      let fechaControl = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.YYYYMMDDHHmm);
      let fechaModel = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.DDMMYYYYHHmm);
      this.setValue(fechaControl, fechaModel);
    } else {
      this.date = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.parseInput);

      let fechaControl = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.YYYYMMDDHHmm);
      let fechaModel = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.DDMMYYYY);
      this.setValue(fechaControl, fechaModel);
    }
  }

  /** Método encargado de sobreescribir la fecha
   * y ejecutar método 'responseInfo'
   * @param fechaControl fecha asignada en el valor de variable 'control'
   * @param fechaResponse fecha que sobreescribe la variable 'date'
   */
  setValue(fechaControl, fechaResponse) {
    if (!this.change) {
      if (this._controlName) {
        this.control = this._controlName.control;
      }
    }

    setTimeout(_ => {
      if (!this.change) {
        this.control.setValue(fechaControl);
        this.date = fechaResponse;
        this.change = true;
      }
      this.responseInfo();
    }, 1);
  }

  /** Método encargado de ejecutar los métodos 'onTouch' y 'onChange' */
  responseInfo() {
    if (!this.control.disabled) {
      this.onTouch();
      this.onChange(this.date);
    }
  }

  /** Método encargado de gestionar las fechas y horas del formulario */
  formatoFechas() {
    if (this.type == this.constants.datepicker.types.timer) {
      this.fechaConvert = moment(this.utilitiesService.clearHora(this.date));
      this.createNuevoControl(this.fechaConvert);
    } else if (this.type == this.constants.datepicker.types.fullCalendar) {
      this.fechaConvert = this.utilitiesService.convertDateToString(this.date, MY_CUSTOM_FORMATS.YYYYMMDDHHmm);
      this.createNuevoControl(this.fechaConvert);
    } else {
      this.fechaConvert = this.utilitiesService.convertDateToString(this.date, MY_CUSTOM_FORMATS.YYYYMMDD);
      this.createNuevoControl(this.fechaConvert);
    }
  }

  /** Método encargado de crear nuevo control de formulario
   * @param value objeto a usar en el valor del nuevo controlador
   */
  createNuevoControl(value) {
    this.control = new FormControl({
      value: value,
      disabled: this._controlName.control.disabled
    });
  }

  /**
   * Método encargado de establecer el valor digitado por el usuario
   * a la variable del modelo del componente
   *
   * @param value valor digitado por el usuario en el campo del formulario
   **/
  writeValue(value: any) {
    this.date = value;
    if (value === '') {
      setTimeout(_ => {
        if (!this.required) {
          this.clearInputCalendar();
        }
      }, 200);
    }
  }

  /**
   * Método encargado de registar la funcion ingresada al onchange
   * del componente
   *
   * @param fn Funcion con la que se definirá la acción onchange
   * del control del formulario
   **/
  registerOnChange(fn){
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

  /** Método encargado de enfocar las entradas del componente */
  setFocusInput() {
    this.input.nativeElement.focus();
  }
}
