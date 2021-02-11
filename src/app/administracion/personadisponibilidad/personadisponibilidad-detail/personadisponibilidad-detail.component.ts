import { PersonadisponibilidadService } from './../services/personadisponibilidad.service';
import { Component, OnInit, Inject } from '@angular/core';
import { Personadisponibilidad } from '../models/personadisponibilidad.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_PERSONADISPONIBILIDAD } from './../personadisponibilidad.constant';
import { CalendariosUtilitiesService } from '../../recurso/services/calendariosUtilities.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { CalendarEvent } from 'calendar-utils';

/** Componente encargado de gestionar la visualización de persona disponibilidad */
@Component({
  selector: 'sigma-administracion-personadisponibilidad-detail',
  templateUrl: './personadisponibilidad-detail.component.html'
})
export class PersonadisponibilidadDetailComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONADISPONIBILIDAD;
  /** Objeto usado para enviar al servicio de CRUD*/
  personadisponibilidad: Personadisponibilidad;
  /** Valor mínimo permitido para la fecha  */
  public minDate: any = null;
  /** Valor máximo permitido para la fecha  */
  public maxDate: any = null;
  /** objeto array CalendarEvents */
  events: CalendarEvent[] = [];
  /** Variable usada para procesar el mensaje que se presentará al usuario */
  mostrar = '';
  /** variable tipo String usada en el componente */
  fechaConsultaCalendario: string = '';
  /** lista que recibe datos del componente sigma-schedule */
  listaCalendario: any;
  /** Bandera usada para mantener habilitado o desabilitado el botón -Ocultar o Disponibilidad*/
  calendariocompletado = false;
  /** Bandera usada para mantener habilitado o desabilitado el ícono del botón */
  cargandoDisponibilidad = false;

  /**
  * Método encargado de construir una instancia de la clase
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  * @param calendariosUtilitiesService Servicio Calendarios usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<PersonadisponibilidadDetailComponent>,
    private servicio: PersonadisponibilidadService,
    private utilitiesService: UtilitiesService,
    private calendariosUtilitiesService: CalendariosUtilitiesService,
    @Inject(MAT_DIALOG_DATA) data: Personadisponibilidad
  ) {
    this.personadisponibilidad = data;
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

  /** Método encargado de validar dato persona del formulario y cargar calendarios
  * @param persona objeto que será validado
  */
  onChangeAutocompleteForm(persona: any): void {
    if (typeof persona !== 'undefined' && typeof persona.id !== 'undefined') {
      this.loadCalendarios();
    }
  }

  /** Método encargado de cargar los calendarios */
  loadCalendarios(): void {
    this.calendariocompletado = false;
    this.cargandoDisponibilidad = true;
    this.events = [];
    this.servicio.listCalendariosByPersonaAndFecha(this.personadisponibilidad.persona.id,
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

  /** Método encargado para retornar fecha con formato y cargar calendarios
   * @param dateCalendar fecha seleccionada
   */
  getEventMonthChanged(dateCalendar: any) {
    this.fechaConsultaCalendario = this.utilitiesService.getFechaServerFormatLite_ddMMaaaa(dateCalendar);
    this.loadCalendarios();
  }

}
