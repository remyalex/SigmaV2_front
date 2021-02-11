import { Component, OnInit, Inject } from '@angular/core';
import { Orfeo } from '../models/orfeo.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_ORFEO } from './../orfeo.constant';

/** Componente encargado de presentar el detalle de un registro de Orfeo*/
@Component({
  selector: 'sigma-administracion-orfeo-detail',
  templateUrl: './orfeo-detail.component.html'
})
export class OrfeoDetailComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_ORFEO;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  orfeo: Orfeo;


 /**
  * Método encargado de construir una instancia de la clase
  *
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<OrfeoDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Orfeo
  ) {
    this.orfeo = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
