import { Component, OnInit, Inject } from '@angular/core';
import { Formatoseccioncampo } from '../models/formatoseccioncampo.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_FORMATOSECCIONCAMPO } from '../formatoseccioncampo.constant';

/** Clase encargada de la detalle del componente */
@Component({
  selector: 'sigma-administracion-formatoseccioncampo-detail',
  templateUrl: './formatoseccioncampo-detail.component.html'
})
export class FormatoseccioncampoDetailComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_FORMATOSECCIONCAMPO;
  /** Objeto Seccion usado para enviar al servicio de CRUD*/
  formatoseccioncampo: Formatoseccioncampo;
  /** Variable usada para recibir un valor de data */
  seccionSelected;

  /**
  * Método encargado de construir una instancia de la clase
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<FormatoseccioncampoDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.seccionSelected = data.formatoseccion;
    this.formatoseccioncampo = data.formatoseccioncampoToDetail;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
