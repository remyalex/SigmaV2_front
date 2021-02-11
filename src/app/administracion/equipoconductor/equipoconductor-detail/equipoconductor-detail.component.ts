
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_EQUIPOCONDUCTOR } from './../equipoconductor.constant';
import { CalendarEvent } from 'calendar-utils';
import { CalendariosUtilitiesService } from '../../recurso/services/calendariosUtilities.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { EquipoConductor } from '../models/equipoconductor.model';
import { EquipoConductorService } from '../services/equipoconductor.service';

/** Componente encargado de gestionar la visualización del detalle del equipo conductor */
@Component({
  selector: 'sigma-administracion-equipoconductor-detail',
  templateUrl: './equipoconductor-detail.component.html'
})
export class EquipoConductorDetailComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPOCONDUCTOR;
  /** Variable usada para gestionar el modelo del conductor del equipo */
  equipoConductor: EquipoConductor;
  /** Listado de eventos cargados en el calendario */
  events: CalendarEvent[] = [];
  /** Variable usada para gestionar el texto a mostrar al usuario */
  mostrar = '';
  /** Fecha de la consulta obtenida por el componente del calendario */
  fechaConsultaCalendario: string = '';
  /** Lista de elementos de calendario que presentara al usuario */
  listaCalendario: any;
  /** Bandera par identificar si el calenadrio se encuentra diligenciado totalmente */
  calendariocompletado = false;
  /** Bandera que permite identificar si el formulario aún esta cargando la disponibilidad */
  cargandoDisponibilidad = false;

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  **/
  constructor(
    private dialogRef: MatDialogRef<EquipoConductorDetailComponent>,
    private servicio: EquipoConductorService,
    private utilitiesService: UtilitiesService,
    @Inject(MAT_DIALOG_DATA) data: EquipoConductor
  ) {
    this.equipoConductor = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close () {
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.fechaConsultaCalendario = this.utilitiesService.getFechaServerFormatLite_ddMMaaaa(new Date());
    //this.loadCalendarios();
  }

  onChangeAutocompleteForm(equipo: any): void {
    if (typeof equipo !== 'undefined' && typeof equipo.id !== 'undefined') {
      //this.loadCalendarios();
    }
  }

}
