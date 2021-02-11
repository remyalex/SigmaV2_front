import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

/** Componente encargado de gestionar la administración
 * de mensaje confirmar de las listas
 **/
@Component({
  selector: 'app-listas-confirm',
  templateUrl: './listas-confirm.component.html'
})
export class ListasCofirmComponent implements OnInit {


  /**
  * Método encargado de construir una instancia
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  */
  constructor(private dialogRef: MatDialogRef<ListasCofirmComponent> ) {
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog*/
  close() {
    this.dialogRef.close(0);
  }

  /** Metodo encargado de gestionar la acción de si seleccionada por el usuario */
  yes () {
    this.dialogRef.close(1);
  }

}
