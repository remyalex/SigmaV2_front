import { Component, OnInit, Inject } from '@angular/core';
import { Tipointervencion } from '../models/tipointervencion.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_TIPOINTERVENCION } from '../tipointervencion.constant';

/** Componente encargado de gestionar la visualización de un {}*/
@Component({
  selector: 'sigma-administracion-tipointervencion-detail',
  templateUrl: './tipointervencion-detail.component.html'
})
export class TipointervencionDetailComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOINTERVENCION;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  tipointervencion: Tipointervencion;


   /**
  * Método encargado de construir una instancia de la clase
  *
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<TipointervencionDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Tipointervencion
  ) {
    this.tipointervencion = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
