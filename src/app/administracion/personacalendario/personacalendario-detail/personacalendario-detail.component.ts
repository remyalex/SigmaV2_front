import { Component, OnInit, Inject } from '@angular/core';
import { Personacalendario } from '../models/personacalendario.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_PERSONACALENDARIO } from './../personacalendario.constant';

/** Componente encargado de gestionar la visualización de persona calendario */
@Component({
  selector: 'sigma-administracion-personacalendario-detail',
  templateUrl: './personacalendario-detail.component.html'
})
export class PersonacalendarioDetailComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONACALENDARIO;
  /** Objeto usado para enviar al servicio de CRUD*/
  personacalendario: Personacalendario;

  /**
  * Método encargado de construir una instancia de la clase
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<PersonacalendarioDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Personacalendario
  ) {
    this.personacalendario = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
