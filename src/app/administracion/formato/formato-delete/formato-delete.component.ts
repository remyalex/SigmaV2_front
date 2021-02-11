import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Formato } from '../models/formato.model';
import { FormatoService } from '../services/formato.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_FORMATO } from './../formato.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Clase encargada de la eliminación del componente */
@Component({
  selector: 'sigma-administracion-formato-delete',
  templateUrl: './formato-delete.component.html'
})
export class FormatoDeleteComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_FORMATO;
  /** Objeto usado para enviar al servicio de CRUD*/
  formato: Formato;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;

  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param data Información a procesar
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesServices Componente de utilidades de peticiones a servicios
  */
  constructor(
    private dialogRef: MatDialogRef<FormatoDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Formato,
    private servicio: FormatoService,
    private snackBar: MatSnackBar,
    private utilitiesServices: UtilitiesService,
    private dataGenericService:  DataGenericService
  ) {
    this.formato = data;
    this.form = fb.group({ id: [this.formato.id, Validators.required] }
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
    this.servicio.delete(this.formato.id).subscribe(
      data => {
        this.dataGenericService.removeCacheListContain(this.constants.path_administracion_formato);
        this.dialogRef.close(this.form.value);
        this.snackBar.open(this.constants.deleteSuccess, 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

}
