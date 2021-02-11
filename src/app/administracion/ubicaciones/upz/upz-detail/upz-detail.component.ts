import { Component, OnInit, Inject } from '@angular/core';
import {CONST_ADMINISTRACION_UPZ} from '../models/upz.constants';
import { Upz } from '../models/upz.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

/** Componente encargado de gestionar la visualización de una upz*/
@Component({
  selector: 'app-upz-detail',
  templateUrl: './upz-detail.component.html'
})
export class UpzDetailComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_UPZ;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  upz: Upz;

  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<UpzDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Upz
  ) {
    this.upz = data;
   }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close();
  }

}
