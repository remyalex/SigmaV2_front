import { Component, OnInit, Inject } from '@angular/core';
import {CONST_ADMINISTRACION_CUADRANTE} from '../models/cuadrante.constants';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Cuadrante } from '../models/cuadrante.model';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { CuadranteService } from '../services/cuadrante.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Componente encargado de gestionar la eliminación de un cuadrante */
@Component({
  selector: 'app-cuadrante-delete',
  templateUrl: './cuadrante-delete.component.html'
})
export class CuadranteDeleteComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_CUADRANTE;
  /** Formulario contenedor del componente */
  form: FormGroup;
  /** Bandera usada para ocultar el botón */
  disabledButton: boolean;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  cuadrante: Cuadrante;


 /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param _utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CuadranteDeleteComponent>,
    private servicio: CuadranteService,
    @Inject(MAT_DIALOG_DATA) data: Cuadrante,
    private snackBar: MatSnackBar,
    private _utilitiesService: UtilitiesService
  ) {
    this.cuadrante = data;
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.disabledButton = false;
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.disabledButton = true;
    this.servicio.delete(this.cuadrante.id).subscribe(
      data => {
        this.dialogRef.close(this.form.value);
        this.snackBar.open('¡Se elimino el elemento!', 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.disabledButton = false;
        this._utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close () {
    this.dialogRef.close(0);
  }

}
