import { Component, OnInit, Inject } from '@angular/core';
import { Evento } from '../models/evento.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_EVENTO } from './../evento.constant';

/** Clase encargada del detalle de eventos */
@Component({
  selector: 'sigma-administracion-evento-detail',
  templateUrl: './evento-detail.component.html'
})
export class EventoDetailComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EVENTO;
  /** Objeto usado para enviar al servicio de CRUD*/
  evento: Evento;

  /**
  * Método encargado de construir una instancia de la clase
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<EventoDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Evento
  ) {
    this.evento = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
