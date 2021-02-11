import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { CONST_SHARED } from '../constantes-shared';

/** Componente encargado de gestionar el componente de confirmación */
@Component({
  selector: 'app-sigma-confirm',
  templateUrl: './sigma-confirm.component.html',
  styleUrls: ['./sigma-confirm.component.scss']
})
export class SigmaConfirmComponent implements OnInit {

  /**  Constantes que utiliza el componente */
  constants = CONST_SHARED;
  /** titulo usado en el componente*/
  titulo = '';

  /** Variable usada para procesar el mensaje que se presentará al usuario */
  mensaje = '';

  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  */
  constructor(
    public dialogRef: MatDialogRef<SigmaConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.titulo = this.constants.confirmar.titulo;
    this.mensaje = this.constants.confirmar.mensaje;
    if (data) {
      if (typeof data.titulo != 'undefined') {
        this.titulo = data.titulo;
      }
      if (typeof data.mensaje != 'undefined') {
        this.mensaje = data.mensaje;
      }
    }
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog*/
  close() {
    this.dialogRef.close(0);
  }

  /** Metodo encargado de gestionar la acción de si seleccionada por el usuario */
  yes() {
    this.dialogRef.close(1);
  }
}