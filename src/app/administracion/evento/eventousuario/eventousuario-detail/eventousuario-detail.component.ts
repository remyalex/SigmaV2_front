import { Component, OnInit, Inject } from '@angular/core';
import { Eventousuario } from '../models/eventousuario.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_EVENTOUSUARIO } from '../eventousuario.constant';

/** Clase encargada del detalle del componente */
@Component({
  selector: 'sigma-administracion-eventousuario-detail',
  templateUrl: './eventousuario-detail.component.html'
})
export class EventousuarioDetailComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EVENTOUSUARIO;
  /** Objeto usado para enviar al servicio de CRUD*/
  eventousuario: Eventousuario;

  /**
  * Método encargado de construir una instancia de la clase
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<EventousuarioDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Eventousuario
  ) {
    this.eventousuario = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
