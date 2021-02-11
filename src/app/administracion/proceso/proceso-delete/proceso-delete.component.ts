import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Proceso } from '../models/proceso.model';
import { ProcesoService } from '../services/proceso.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_PROCESO } from './../proceso.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Componente encargado de gestionar la eliminación del proceso */
@Component({
  selector: 'sigma-administracion-proceso-delete',
  templateUrl: './proceso-delete.component.html'
})
export class ProcesoDeleteComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PROCESO;
  /** Objeto usado para enviar al servicio de CRUD*/
  proceso: Proceso;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera usada para ocultar el botón */
  disabled = false;


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param data Información a procesar
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesServices Componente de utilidades de peticiones a servicios
  */
  constructor(
    private dialogRef: MatDialogRef<ProcesoDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Proceso,
    private servicio: ProcesoService,
    private snackBar: MatSnackBar,
    private utilitiesServices: UtilitiesService
  ) {
    this.proceso = data;
    this.form = fb.group({ id: [this.proceso.id, Validators.required] }
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
    this.disabled = true;
    this.servicio.delete(this.proceso.id).subscribe(
      data => {
        this.servicio.sendNewDataSelection(data);
        this.dialogRef.close(this.form.value);
        this.snackBar.open('¡Se elimino el elemento!', 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.disabled = false;
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

}
