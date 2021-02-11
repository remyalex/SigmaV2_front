import { Component, OnInit, Inject } from '@angular/core';
import { Formato } from '../models/formato.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_FORMATO } from './../formato.constant';

/** Clase encargada del detalle del componente */
@Component({
  selector: 'sigma-administracion-formato-detail',
  templateUrl: './formato-detail.component.html'
})
export class FormatoDetailComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_FORMATO;
  /** Objeto usado para enviar al servicio de CRUD*/
  formato: Formato;

  /**
  * Método encargado de construir una instancia de la clase
  * 
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<FormatoDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Formato
  ) {
    this.formato = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
