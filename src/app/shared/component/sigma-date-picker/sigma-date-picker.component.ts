import { Component, OnInit, Input, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import * as _moment from 'moment';
// Date time completo
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { FormControl } from '@angular/forms';
import { CONST_SHARED } from '../../constantes-shared';

/** Variable encargada de gestionar la propiedad momento de una hora  */
const moment = (_moment as any).default ? (_moment as any).default : _moment;
/** Constante con posibles valores de formatos de fecha/hora aceptados por el componente */
export const MY_CUSTOM_FORMATS = {
  parseInput: 'DD-MM-YYYY',
  parseInputHours: '+00 HH:mm:00',
  fullPickerInput: 'DD-MM-YYYY HH:mm:00',
  datePickerInput: 'DD-MM-YYYY',
  timePickerInput: 'HH:mm',
  formatoInput: 'YYYY-MM-DD',
  formatoDateControl: 'YYYY-MM-DD HH:mm:00',
  monthYearLabel: 'MMM YYYY',
  monthYearA11yLabel: 'MMMM YYYY',
};

/** Componente encargado de gestionar el componente fechas */
@Component({
  selector: 'sigma-date-picker',
  templateUrl: './sigma-date-picker.component.html',
  providers: [
    // `MomentDateTimeAdapter` can be automatically provided by importing
    // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },

    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ]
})
export class SigmaDatePickerComponent implements OnInit {

  /**  Constantes que utiliza el componente */
  constans = CONST_SHARED;
  /** Variable usada para recibir objeto en la invocación del componente */
  @Input('objeto') objeto;
  /** Variable usada para recibir test en la invocación del componente */
  @Input('test') test;
  /** Variable usada para recibir target en la invocación del componente */
  @Input('target') target: string = 'target';
  /** Variable usada para recibir minTarget en la invocación del componente */
  @Input('minTarget') minTarget: string;
  /** Variable usada para recibir maxTarget en la invocación del componente */
  @Input('maxTarget') maxTarget: string;
  /** Variable usada para recibir type en la invocación del componente */
  @Input('type') type: string = this.constans.datepicker.types.calendar;
  /** Variable usada para recibir placeholder en la invocación del componente */
  @Input('placeholder') placeholder: string = this.constans.datepicker.placeholder;

  /** Objeto control de las entradas del componente */
  inputControl = new FormControl(moment(null));
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  customerDiffer: KeyValueDiffer<string, any>;
  /** Valor máximo permitido para la fecha  */
  maxDate: any;
  /** Valor mínimo permitido para la fecha  */
  minDate: any;


  /**
  * Método encargado de construir una instancia de la clase
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  * @param differs Elemento usado para mantener la información clonada
  */
  constructor(
    private utilitiesService: UtilitiesService,
    private differs: KeyValueDiffers,
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.customerDiffer = this.differs.find(this.objeto).create();
    if (this.objeto[this.target]) {
      this.formatoFechas();
    }

    if (this.minTarget) {
      this.setMinDate();
    }

    if (this.maxTarget) {
      this.setMaxDate();
    }
  }

  /** Método encargado de ejecutarse despues del método ngOnInit() */
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
    /* If you want to see details then use
      changes.forEachRemovedItem((record) => ...);
      changes.forEachAddedItem((record) => ...);
    */
  }

  /** Método encargado de limitar las fechas a la máxima opción*/
  setMaxDate() {
    if (this.objeto[this.maxTarget]) {
      this.maxDate = this.utilitiesService.convertStringToDate(this.objeto[this.maxTarget], MY_CUSTOM_FORMATS.fullPickerInput);
    } else {
      this.maxDate = null;
    }
  }

  /** Método encargado de limitar las fechas a la minima opción*/
  setMinDate() {
    if (this.objeto[this.minTarget]) {
      this.minDate = this.utilitiesService.convertStringToDate(this.objeto[this.minTarget], MY_CUSTOM_FORMATS.fullPickerInput);
    } else {
      this.minDate = null;
    }
  }

  /** Método encargado de limpiar las fechas seleccionadas
   *  de los calendarios */
  clearInputCalendar() {
    this.objeto[this.target] = '';
    this.inputControl.setValue([null, null]);

    if (this.type == this.constans.datepicker.types.timer) {
      try {
        this.objeto[`${this.target}Time`] = '';
      } catch (error) { }
    } else {
      try {
        this.objeto[`${this.target}Date`] = '';
      } catch (error) { }
    }
  }

  /** Método encargado de convertir formato y asignar fecha
   * seleccionada al objeto
   * @param event objeto con fecha seleccionada
  */
  changeValue(event) {
    if (!this.objeto) {
      return true;
    }

    if (this.type == this.constans.datepicker.types.timer) {
      this.objeto[this.target] = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.parseInputHours);
    } else if (this.type == this.constans.datepicker.types.dateTime) {
      this.objeto[this.target] = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.fullPickerInput);
    } else {
      this.objeto[this.target] = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.parseInput);
    }
  }

  /** Método encargado de gestionar las fechas y horas del formulario */
  formatoFechas() {
    if (this.type == this.constans.datepicker.types.timer) {
      this.objeto[`${this.target}Time`] = this.utilitiesService.clearHora(this.objeto[this.target]);
      this.inputControl = new FormControl(moment(this.objeto[`${this.target}Time`]));
    } else if (this.type == this.constans.datepicker.types.dateTime) {
      this.objeto[`${this.target}Date`] = this.objeto[this.target];
      this.inputControl = new FormControl(
        new Date(moment(this.utilitiesService.convertDateToString(this.objeto[`${this.target}Date`], MY_CUSTOM_FORMATS.formatoDateControl)))
      );
    } else {
      this.objeto[`${this.target}Date`] = this.objeto[this.target];
      this.inputControl = new FormControl(
        new Date(moment(this.utilitiesService.convertDateToString(this.objeto[`${this.target}Date`], MY_CUSTOM_FORMATS.formatoInput)))
      );
    }
  }
}