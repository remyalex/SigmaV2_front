import { Component, OnInit, Inject } from '@angular/core';
import {CONST_ADMINISTRACION_CUADRANTE} from '../models/cuadrante.constants';
import { Cuadrante } from '../models/cuadrante.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

/** Componente encargado de gestionar la visualización de un cuadrante*/
@Component({
  selector: 'app-cuadrante-detail',
  templateUrl: './cuadrante-detail.component.html'
})
export class CuadranteDetailComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_CUADRANTE;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  cuadrante: Cuadrante;


 /**
  * Método encargado de construir una instancia de la clase
  *
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<CuadranteDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Cuadrante
  ) {
    this.cuadrante = data;
   }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close();
  }

}
