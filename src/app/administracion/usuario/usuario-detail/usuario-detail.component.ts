import { Component, OnInit, Inject } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_USUARIO } from './../usuario.constant';

/** Componente encargado de gestionar la visualización de un usuario */
@Component({
  selector: 'sigma-administracion-usuario-detail',
  templateUrl: './usuario-detail.component.html'
})
export class UsuarioDetailComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_USUARIO;
  /** Objeto usado para enviar al servicio de CRUD*/
  usuario: Usuario;

  /**
  * Método encargado de construir una instancia de la clase
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<UsuarioDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Usuario
  ) {
    this.usuario = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
