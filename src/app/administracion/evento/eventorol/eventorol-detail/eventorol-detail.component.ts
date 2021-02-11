import { Component, OnInit, Inject } from '@angular/core';
import { Eventorol } from '../models/eventorol.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_EVENTOROL } from '../eventorol.constant';

/** Clase encargada del detalle del componente */
@Component({
  selector: 'sigma-administracion-eventorol-detail',
  templateUrl: './eventorol-detail.component.html'
})
export class EventorolDetailComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EVENTOROL;
  /** Objeto usado para enviar al servicio de CRUD*/
  eventorol: Eventorol;

  /**
  * Método encargado de construir una instancia de la clase
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<EventorolDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Eventorol
  ) {
    this.eventorol = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
