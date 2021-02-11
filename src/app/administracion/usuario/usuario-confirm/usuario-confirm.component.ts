import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

/** Componente encargado de gestionar las confirmaciones de los componentes usuarios */
@Component({
  selector: 'sigma-administracion-usuario-confirm',
  templateUrl: './usuario-confirm.component.html'
})
export class UsuarioConfirmComponent implements OnInit {

  /**
  * Método encargado de construir una instancia
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  */
  constructor(private dialogRef: MatDialogRef<UsuarioConfirmComponent>) {
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog*/
  close() {
    this.dialogRef.close(0);
  }
  /** Método encargado de cerrar el dialog con respuesta Afirmativa */
  yes() {
    this.dialogRef.close(1);
  }


}
