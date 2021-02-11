import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html'
})
export class ConfirmacionComponent implements OnInit {

   /** titulo usado en el componente*/
   titulo = 'Confirmando acción';

   /** Variable usada para procesar el mensaje que se presentará al usuario */
   mensaje = '¿Desea confirmar la acción actual?';

  /** variable usada para ingresar una descripcion de la accion ejecutada */
   observacion: string;

   /**
   * Método encargado de construir una instancia de la clase
   *
   * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
   */
   constructor(
     public dialogRef: MatDialogRef<ConfirmacionComponent>,
     @Inject(MAT_DIALOG_DATA) data: any,
   ) {}

   /** Método encargado de inicializar el componente */
   ngOnInit() {
   }

   /** Método encargado de gestionar el cierre del dialog*/
   close() {
     this.dialogRef.close({accion: 0});
   }

   /** Metodo encargado de gestionar la acción de si seleccionada por el usuario */
   yes() {
     this.dialogRef.close({accion: 1, observacion: this.observacion});
   }

   validarObservacion() {
     return this.observacion !== undefined && this.observacion !== null && this.observacion !== '';
   }

}
