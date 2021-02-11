import { Component, OnInit, Inject } from '@angular/core';
import { Persona } from '../models/persona.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_PERSONA } from './../persona.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Componente encargado de gestionar la visualización de una persona */
@Component({
  selector: 'sigma-administracion-persona-detail',
  templateUrl: './persona-detail.component.html'
})
export class PersonaDetailComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONA;
  /** Objeto usado para enviar al servicio de CRUD*/
  persona: Persona;

  /**
  * Método encargado de construir una instancia de la clase
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private dialogRef: MatDialogRef<PersonaDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Persona,
    private utilitiesService: UtilitiesService,
  ) {
    this.persona = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() { }

  /** Método encargado de darle formato a las fechas del formulario 
   * @param value fecha seleccionada
  */
  formatHora(value): string {
    return this.utilitiesService.formatoHora(value);
  }
}
