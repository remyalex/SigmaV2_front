import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Formatoseccion } from '../models/formatoseccion.model';
import { FormatoseccionService } from '../services/formatoseccion.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_FORMATOSECCION } from '../formatoseccion.constant';
import { FormatoService } from '../../services/formato.service';
import { Formato } from '../../models/formato.model';
import { endOfDay } from 'date-fns';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Clase encargada de la eliminación del componente */
@Component({
  selector: 'sigma-administracion-formatoseccion-delete',
  templateUrl: './formatoseccion-delete.component.html',
})
export class FormatoseccionDeleteComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_FORMATOSECCION;
  /** Objeto usado para enviar al servicio de CRUD*/
  formato: Formato;
  /** Objeto Seccion usado para enviar al servicio de CRUD*/
  formatoSeccionToDelete: Formatoseccion;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera usada para ocultar el botón Guardar */
  disabled = false;
  /** Variable usada para recibir un valor de data */
  keyToDelete;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param data Información a procesar
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesServices Componente de utilidades de peticiones a servicios
  */
  constructor(
    private dialogRef: MatDialogRef<FormatoseccionDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private servicio: FormatoService,
    private snackBar: MatSnackBar,
    private utilitiesServices: UtilitiesService,
    private dataGenericService:  DataGenericService
  ) {
    this.keyToDelete = data.keyToDelete;
    this.formato = data.formato;
    this.formatoSeccionToDelete = data.formatoSeccionToDelete;
    this.form = fb.group({ id: [this.formatoSeccionToDelete.id, Validators.required] }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close(0);
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio */
  save() {
    this.disabled = true;
    if (this.formato.secciones[this.keyToDelete].campos.length <= 0) {
      this.formato.secciones.splice(this.keyToDelete, 1);
      this.servicio.update(this.formato).subscribe(
        data => {
          this.servicio.updateDataFormato(data);
          this.dataGenericService.removeCacheListContain(this.constants.path_administracion_formato_return);
          this.dialogRef.close(this.form.value);
          this.snackBar.open(this.constants.deleteSuccess, 'X', {
            duration: 6000,
            panelClass: ['success-snackbar']
          });
        },
        error => {
          this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
        }
      );
    } else {
      this.snackBar.open('Tiene registros dependientes', 'X', {
        duration: 6000,
        panelClass: ['error-snackbar']
      });
      this.dialogRef.close(this.form.value);
    }
  }
}
