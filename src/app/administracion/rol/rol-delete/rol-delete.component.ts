import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Rol } from '../models/rol.model';
import { RolService } from '../services/rol.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_ROL } from './../rol.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar la eliminación de un rol */
@Component({
  selector: 'sigma-administracion-rol-delete',
  templateUrl: './rol-delete.component.html'
})
export class RolDeleteComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_ROL;
  /** Objeto usado para enviar al servicio de CRUD*/
  rol: Rol;
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
    private dialogRef: MatDialogRef<RolDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Rol,
    private servicio: RolService,
    private snackBar: MatSnackBar,
    private utilitiesServices: UtilitiesService
  ) {
    this.rol = data;
    this.form = fb.group({ id: [this.rol.id, Validators.required] }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close(0);
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    //this.dialogRef.close(this.form.value);
    this.servicio.delete(this.rol.id).subscribe(
      data => {
        this.dialogRef.close(this.form.value);
        this.snackBar.open('¡Se elimino el elemento!', 'X', {
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