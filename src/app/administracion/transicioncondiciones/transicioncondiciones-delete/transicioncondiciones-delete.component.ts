import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { CONST_ADMINISTRACION_TRANSICIONCONDICIONES } from '../transicioncondiciones.constants';
import { CondicionService } from '../services/transicioncondiciones.services';
import { Condiciones } from '../models/condiciones.model';

/** Componente encargado de gestionar la eliminación de una condición de transición */
@Component({
  selector: 'app-transicioncondiciones-delete',
  templateUrl: './transicioncondiciones-delete.component.html'
})
export class TransicioncondicionesDeleteComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TRANSICIONCONDICIONES;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  condicion: Condiciones;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera usada para ocultar el botón */
  disabled = false;
  /** Variable usada para identificar el origen del pk */
  origen = '';

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
    private dialogRef: MatDialogRef<TransicioncondicionesDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private servicio: CondicionService,
    private snackBar: MatSnackBar,
    private utilitiesServices: UtilitiesService
  ) {
    this.condicion = data.condicion;
    this.origen = data.origen;
    this.form = fb.group( { id: [this.condicion.id, Validators.required] }
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
    if(this.origen === 'deleteOnModal') {
      this.disabled = true;
      this.servicio.delete(this.condicion.id).subscribe(
        data => {
          this.servicio.updateGroupList(data);
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
    } else {
      this.dialogRef.close(this.form.value);
    }
  }

}
