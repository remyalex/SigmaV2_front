import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Lista } from '../models/lista.model';
import { ListasService } from '../services/listas.service';
import { CONST_ADMINISTRACION_LISTAS } from '../listas.constant';
import { UtilitiesService } from '../../../shared/services/utilities.service';

/** Componente encargado de gestionar la eliminación de una lista */
@Component({
  selector: 'app-listas-delete',
  templateUrl: './listas-delete.component.html'
})
export class ListasDeleteComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LISTAS;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  lista: Lista;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;


   /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param _utilitiesService Componente de utilidades de peticiones a servicios
  * @param lista Objeto con los datos a eliminar de la lista
  * @param form formulario con con datos del modelo a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<ListasDeleteComponent>,
    private servicio: ListasService,
    private snackBar: MatSnackBar,
    private _utilitiesService: UtilitiesService,
    private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) data: Lista ) {
    this.lista = data;
    this.form = fb.group(
      {
        id: [this.lista.id, Validators.required]
      }
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
    this.lista.activo = false;
    this.servicio.update(this.lista).subscribe(
      data => {
        this.dialogRef.close(this.form.value);
        this.snackBar.open(this.constants.deleteSuccess, 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      }, error => {
        this._utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      });
  }

}
