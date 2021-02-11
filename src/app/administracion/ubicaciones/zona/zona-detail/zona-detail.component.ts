import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Zona } from '../models/zona.model';
import { CONST_ADMINISTRACION_ZONA } from '../models/zona.constants';

/** Componente encargado de gestionar la visualización de una zona*/
@Component({
  selector: 'app-zona-detail',
  templateUrl: './zona-detail.component.html'
})
export class ZonaDetailComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_ZONA;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  zona: Zona;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<ZonaDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Zona
  ) {
    this.zona = data;
   }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close () {
    this.dialogRef.close();
  }

}
