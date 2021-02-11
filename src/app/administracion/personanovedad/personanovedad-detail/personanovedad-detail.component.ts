import { Component, OnInit, Inject } from '@angular/core';
import { Personanovedad } from '../models/personanovedad.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_PERSONANOVEDAD } from './../personanovedad.constant';

/** Componente encargado de gestionar la visualización de una novedad de persona*/
@Component({
  selector: 'sigma-administracion-personanovedad-detail',
  templateUrl: './personanovedad-detail.component.html'
})
export class PersonanovedadDetailComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONANOVEDAD;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  personanovedad: Personanovedad;


 /**
  * Método encargado de construir una instancia de la clase
  *
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<PersonanovedadDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Personanovedad
  ) {
    this.personanovedad = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
