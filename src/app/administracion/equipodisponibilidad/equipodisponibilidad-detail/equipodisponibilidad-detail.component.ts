import { EquipodisponibilidadService } from './../services/equipodisponibilidad.service';
import { PersonadisponibilidadService } from './../../personadisponibilidad/services/personadisponibilidad.service';
import { Component, OnInit, Inject } from '@angular/core';
import { Equipodisponibilidad } from '../models/equipodisponibilidad.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_EQUIPODISPONIBILIDAD } from './../equipodisponibilidad.constant';
import { CalendarEvent } from 'calendar-utils';
import { CalendariosUtilitiesService } from '../../recurso/services/calendariosUtilities.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/**
 * Componente encargado de gestionar la presentación de
 * información de disponibilidad de un equipo
 **/
@Component({
  selector: 'sigma-administracion-equipodisponibilidad-detail',
  templateUrl: './equipodisponibilidad-detail.component.html'
})
export class EquipodisponibilidadDetailComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPODISPONIBILIDAD;
  /** Objeto de tipo model con el cual se procesará la información */
  equipoDisponibilidad: Equipodisponibilidad;
  /** Listado de eventos generados por el calendario */
  events: CalendarEvent[] = [];
  /** Variable usada para mostrar mensajes al usuario */
  mostrar = '';
  /** fecha en la cual se realizará la consulta del calendario */
  fechaConsultaCalendario: string = '';
  /** Listado de calendarios usados */
  listaCalendario: any;
  /** Bandera de control para identificar si el calendario fue conpletado */
  calendariocompletado = false;
  /** Bandera de control para identificar si se encuentra cargando
   * la disponibilidad del equipo */
  cargandoDisponibilidad = false;

  /**
  * Método encargado de construir una instancia de la clase
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param data Información a procesar
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param fb Componente usado para Agrupar elementos en el formulario
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   * @param calendariosUtilitiesService Servicio usado para gestionar acciones del calendario
   **/
  constructor(
    private dialogRef: MatDialogRef<EquipodisponibilidadDetailComponent>,
    private servicio: EquipodisponibilidadService,
    private utilitiesService: UtilitiesService,
    private calendariosUtilitiesService: CalendariosUtilitiesService,
    @Inject(MAT_DIALOG_DATA) data: Equipodisponibilidad
  ) {
    this.equipoDisponibilidad = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.fechaConsultaCalendario = this.utilitiesService.getFechaServerFormatLite_ddMMaaaa(new Date());
    this.loadCalendarios();
  }

  /** Método encargado de cargar los calendarios cuando se cambia el equipo */
  onChangeAutocompleteForm(equipo: any): void {
    if (typeof equipo !== 'undefined' && typeof equipo.id !== 'undefined') {
      this.loadCalendarios();
    }
  }

  /** Método encargado de cargar los calendarios de los equipos de la fecha */
  loadCalendarios(): void {
    this.calendariocompletado = false;
    this.cargandoDisponibilidad = true;
    this.events = [];
    this.servicio.listCalendariosByEquipoAndFecha(this.equipoDisponibilidad.equipo.id,
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

  /**
   * Método encargado de cargar los calendarios de
   * accuerdo a la fecha registrada en el formulario
   */
  getEventMonthChanged(dateCalendar: any) {
    this.fechaConsultaCalendario = this.utilitiesService.getFechaServerFormatLite_ddMMaaaa(dateCalendar);
    this.loadCalendarios();
  }

}
