import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Formatoseccioncampo } from '../models/formatoseccioncampo.model';
import { FormatoseccioncampoService } from '../services/formatoseccioncampo.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_FORMATOSECCIONCAMPO } from '../formatoseccioncampo.constant';
import { Formato } from '../../../models/formato.model';
import { FormatoService } from '../../../services/formato.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Clase encargada de la eliminación del componente */
@Component({
  selector: 'sigma-administracion-formatoseccioncampo-delete',
  templateUrl: './formatoseccioncampo-delete.component.html'
})
export class FormatoseccioncampoDeleteComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_FORMATOSECCIONCAMPO;
  /** Variable usada para recibir un valor de data */
  keyCampo;
  /** Variable usada para recibir un valor de data */
  keySection;
  /** Objeto usado para enviar al servicio de CRUD*/
  formato: Formato;
  /** Objeto Seccion Campo usado para enviar al servicio de CRUD*/
  formatoseccioncampo: Formatoseccioncampo;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;


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
    private dialogRef: MatDialogRef<FormatoseccioncampoDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private servicio: FormatoService,
    private snackBar: MatSnackBar,
    private utilitiesServices: UtilitiesService
  ) {
    this.keyCampo = data.keyCampo;
    this.keySection = data.keySection;
    this.formato = data.formato;
    this.formatoseccioncampo = data.formatoseccioncampoToDetail;
    this.form = fb.group( { id: [this.formatoseccioncampo.id, Validators.required] }
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
    this.formato.secciones[this.keySection].campos.splice(this.keyCampo, 1);
    this.servicio.update(this.formato).subscribe(
      data => {
        this.servicio.updateDataFormato(data);
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
