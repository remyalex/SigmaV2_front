import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from '../services/usuario.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_USUARIO } from './../usuario.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Componente encargado de gestionar la eliminación de un usuario */
@Component({
  selector: 'sigma-administracion-usuario-delete',
  templateUrl: './usuario-delete.component.html'
})
export class UsuarioDeleteComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_USUARIO;
  /** Objeto usado para enviar al servicio de CRUD*/
  usuario: Usuario;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param utilitiesServices Componente de utilidades de peticiones a servicios
  */
  constructor(
    private dialogRef: MatDialogRef<UsuarioDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Usuario,
    private servicio: UsuarioService,
    private snackBar: MatSnackBar,
    private utilitiesServices: UtilitiesService
  ) {
    this.usuario = data;
    this.form = fb.group({ id: [this.usuario.id, Validators.required] }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog*/
  close() {
    this.dialogRef.close(0);
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.delete(this.usuario.id).subscribe(
      data => {
        this.dialogRef.close(this.form.value);
        this.snackBar.open(this.constants.deleteSuccess, 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar)
      }
    );
  }

}
