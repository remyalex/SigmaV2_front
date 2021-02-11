import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CONST_PRODUCCION_MEZCLA } from '../produccion-mezcla.constants';

@Component({
  selector: 'app-confirm-capacidad',
  templateUrl: './confirm-capacidad.component.html'
})
export class ConfirmCapacidadComponent implements OnInit {

  public constants = CONST_PRODUCCION_MEZCLA;
  titulo = '';
  mensaje = 'Confirme que cuenta con los recursos necesarios para programar la producción de mezcla';

  insumos: boolean;
  personal: boolean;
  capacidad: boolean;

  constructor(
    public dialogRef: MatDialogRef<ConfirmCapacidadComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.titulo = this.constants.confirmar.titulo;
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  close () {
    this.dialogRef.close(0);
  }
  yes () {
    this.dialogRef.close(1);
  }

}
