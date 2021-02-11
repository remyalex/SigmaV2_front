import { CONST_PRODUCCION_REGISTRO_INSUMO_EXISTENCIA } from './../insumoExistencia.constant';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InsumoExistencia } from '../models/insumo-existencia.model';
import { InsumoExistenciaService } from '../services/insumo-existencia.service';
import { MatSnackBar } from '@angular/material';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

@Component({
  selector: 'sigma-produccion-insumo-existencia-delete',
  templateUrl: './insumo-existencia-delete.component.html'
})
export class InsumoExistenciaDeleteComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_REGISTRO_INSUMO_EXISTENCIA;
  registro: InsumoExistencia;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dialogRef: MatDialogRef<InsumoExistenciaDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: InsumoExistencia,
    private servicio: InsumoExistenciaService,
    private snackBar: MatSnackBar,
    private utilitiesServices: UtilitiesService
  ) {
    this.registro = data;
    this.form = fb.group( { id: [this.registro.id, Validators.required] }
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
    this.servicio.delete(this.registro.id).subscribe(
      data => {
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
