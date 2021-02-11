import { Component, OnInit, Inject } from '@angular/core';
import {CONST_ADMINISTRACION_LOCALIDAD} from '../models/localidad.constants';
import { Localidad } from '../models/localidad.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

/** Componente encargado de gestionar la visualización de una localidad*/
@Component({
  selector: 'app-localidad-detail',
  templateUrl: './localidad-detail.component.html'
})
export class LocalidadDetailComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LOCALIDAD;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  localidad: Localidad;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<LocalidadDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Localidad
  ) {
    this.localidad = data;
   }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close();
  }

}
