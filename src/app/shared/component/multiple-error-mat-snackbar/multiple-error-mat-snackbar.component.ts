import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';
import { CONST_SHARED } from '../../constantes-shared';

/** Componente encargado de gestionar los multiples errores */
@Component({
  selector: 'app-multiple-error-mat-snackbar',
  templateUrl: './multiple-error-mat-snackbar.component.html'
})
export class MultipleErrorMatSnackbarComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_SHARED;
  /** Variable usada para recibir valor de error 500 */
  errores;
  /** mensaje Default para mostrar */
  messageDefault: string = '';

  /**
   * Método encargado de construir una instancia de componente
   * @param data Información a procesar
   */
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {
    this.errores = data;
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    if (!Array.isArray(this.errores)) {
      this.messageDefault = this.constants.error500;
    }
  }

}
