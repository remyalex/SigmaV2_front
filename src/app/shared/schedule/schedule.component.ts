import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, HostListener } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { ScheduleDialogComponent } from './schedule-dialog/schedule-dialog.component';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { Subject } from 'rxjs/Subject';
import { blockTransition } from '../../theme/utils/app-animation';
import { UtilitiesService } from '../services/utilities.service';
import { BehaviorSubject } from 'rxjs';
// import { DateAdapter } from '../../date-adapters/date-adapter';

/** Array constante de colores a usar en el componente */
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};
/** Constante con posibles valores de formatos de fecha/hora aceptados por el componente */
export const MY_CUSTOM_FORMATS = {
  parseInput: 'DD-MM-YYYY',
  parseInputHours: '+00 HH:mm:ss',
  fullPickerInput: 'DD-MM-YYYY HH:mm:ss',
  datePickerInput: 'DD-MM-YYYY',
  timePickerInput: 'HH:mm',
  formatoInput: 'YYYY/MM/DD HH:mm:ss'
};

/** Componente encargado de gestionar el proceso de calendario */
@Component({
  selector: 'sigma-schedule',
  templateUrl: './schedule.component.html',
  animations: [blockTransition],
  host: {
    '[@blockTransition]': ''
  }
})
export class ScheduleComponent implements OnChanges {
  /** variable definiendo localidad para fechas */
  locale: string = 'es-CO';
  /** variable definiendo que tipo de vista mostrar en calendario */
  view: string = 'month';
  /** variable tipo numerico */
  d: number = 0;
  /** objeto fecha actual del sistema */
  viewDate: Date = new Date();
  /** variable booleana para activar dias abiertos */
  activeDayIsOpen: boolean = true;
  /** variable usada para recibir lista de calendarios en la invocación del componente */
  @Input('listaCalendario') events: CalendarEvent[];

  /**
   * Called when the view date is changed
   */
  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();

  actions: CalendarEventAction[] = [{
    label: '<i class="material-icons icon-sm white">close</i>',
    onClick: ({ event }: { event: CalendarEvent }): void => {
      this.events = this.events.filter(iEvent => iEvent !== event);
      this.snackBar.open('Event deleted successfully!', null, {
        duration: 1500
      });
    }
  }];
  /** objeto evento calendario a usar en el componente */
  EventoCalendario: CalendarEvent;
  /** objeto para usar refresco del componente */
  refresh: Subject<any> = new Subject();
  /** Variable usada para notificación a otros componentes de cambios */
  private loadSubject = new BehaviorSubject({});
  /** Variable usada para recibir notificaciones de componentes de cambios */
  public load$ = this.loadSubject.asObservable();
  /** objeto de configuracion standar de la aplicación */
  public settings: Settings;

  /**
  * Método encargado de construir una instancia del componente
  * @param appSettings Opciones de construcción del protocolo http para envio de petición al servidor
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  * @param snackBar Componente usado para abrir un recuadro modal
  */
  constructor(
    public appSettings: AppSettings,
    public dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    public snackBar: MatSnackBar) {
    this.settings = this.appSettings.settings;
  }

  /** Método encargado de limpiar valores de calendario
   * @param accion evento a evaluar
   */
  limpiarCalendario(accion) {
    if (typeof accion !== 'undefined') {

      if (accion == 'limpiarCalendario') {

        // this.events = this.events2;
      }
    }
  }

  /**
   * Método encargado de ejecutar método 'ngOnInit' al cargar el componente
   * @param changes Cambios detectados en el modelo
   */
  ngOnChanges(changes: SimpleChanges) {
    this.events = changes.events.currentValue;
  }

  /** Método encargado de enviar evento de cambio de fecha */
  sendEventMonthChanged(): void {
    this.viewDateChange.next(this.viewDate);
  }

  /** Método encargado de gestionar el día de seleccion de fecha 
   * @param date Fecha seleccionada
   * @param events evento a evaluar
  */
  dayClicked({ date, events }: { date: Date, events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen == true) || events.length == 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

}