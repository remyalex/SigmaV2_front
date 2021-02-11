import { Component, OnInit, Inject } from '@angular/core';
import { Lugardisponibilidad } from '../models/lugardisponibilidad.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_LUGARDISPONIBILIDAD } from './../lugardisponibilidad.constant';
import { CalendariosUtilitiesService } from '../../recurso/services/calendariosUtilities.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { LugardisponibilidadService } from '../services/lugardisponibilidad.service';
import { CalendarEvent } from 'calendar-utils';

/** Clase encargada de la detalle del componente */
@Component({
  selector: 'sigma-administracion-lugardisponibilidad-detail',
  templateUrl: './lugardisponibilidad-detail.component.html'
})
export class LugardisponibilidadDetailComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LUGARDISPONIBILIDAD;
  /** Objeto usado para enviar al servicio de CRUD*/
  lugardisponibilidad: Lugardisponibilidad;
  /** Array que recibe objetos Calendar*/
  events: CalendarEvent[] = [];
  /** Objeto usado para mostrar diferente texto en el botón */
  mostrar: string = '';
  /** variable que recibe fechas con formato */
  fechaConsultaCalendario: string = '';
  /** Objeto que para indicar si el ícono se muestra */
  cargandoDisponibilidad = false;
  /** Objeto que recibe eventos del componente - sigma-schedule */
  listaCalendario: any;
  /** Objeto que para indicar si el botón se muestra */
  calendariocompletado: boolean = false;

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  * @param calendariosUtilitiesService Componente Calendario de utilidades de peticiones a servicios
  * @param data Información a procesar
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  */
  constructor(
    private servicio: LugardisponibilidadService,
    private utilitiesService: UtilitiesService,
    private calendariosUtilitiesService: CalendariosUtilitiesService,
    private dialogRef: MatDialogRef<LugardisponibilidadDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Lugardisponibilidad
  ) {
    this.lugardisponibilidad = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.fechaConsultaCalendario = this.utilitiesService.getFechaServerFormatLite_ddMMaaaa(new Date());
    this.loadCalendarios();
  }

  /** Método encargado de cargar los calendarios */
  loadCalendarios(): void {
    this.calendariocompletado = false;
    this.cargandoDisponibilidad = true;
    this.events = [];
    this.servicio.listCalendariosByLugarAndFecha(this.lugardisponibilidad.lugar.id,
      this.fechaConsultaCalendario).subscribe((calendarios: any) => {
        this.events = this.calendariosUtilitiesService.obtenerEventosDeCalendario(calendarios);
        this.cargandoDisponibilidad = false;
        this.calendariocompletado = true;
      }
        , error => {
          this.cargandoDisponibilidad = false;
          this.calendariocompletado = true;
        }
      );
  }

  /** Método encargado de cambiar el formato para la fecha consulta y llama método loadCalendarios()
   * @param dateCalendar objeto fecha que se reemplazará con un nuevo formato de fecha.
  */
  getEventMonthChanged(dateCalendar: any) {
    this.fechaConsultaCalendario = this.utilitiesService.getFechaServerFormatLite_ddMMaaaa(dateCalendar);
    this.loadCalendarios();
  }
}
