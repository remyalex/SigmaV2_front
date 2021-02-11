import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { RegistroMezclaInsumoCriteria } from '../models/registro-mezcla-insumos-criteria.model';
import { RegistroMezclaInsumoDatasource } from '../services/registro-mezcla-insumos.datasource';
import { RegistroMezclaInsumosService } from '../services/registro-mezcla-insumos.service';

import { MatSnackBar } from '@angular/material';
import { CONST_REGISTRAR_MEZCLA_INSUMOS } from './../registro-mezcla-insumos.constant';
import { UtilitiesService } from '../../../shared/services/utilities.service';

@Component({
  selector: 'sigma-produccion-registro-mezcla-insumos-delete',
  templateUrl: './registro-mezcla-insumos-delete.component.html'
})
export class RegistroMezclaInsumosDeleteComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_MEZCLA_INSUMOS;
  material: any;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dialogRef: MatDialogRef<RegistroMezclaInsumosDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: RegistroMezclaInsumoCriteria,
    private servicio: RegistroMezclaInsumosService,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService
  ) {
    this.material = data;
    this.form = fb.group( { id: ['', Validators.required] }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog*/
  close() {
    this.dialogRef.close(0);
  }

    /** Método encargado de realizar solicitud de almacenamiento al servicio*/
    save () {
      this.disableSubmit = true;
      this.servicio.delete(this.material.idDetalleVale).subscribe(
        data => {
          this.dialogRef.close(this.form.value);
          this.snackBar.open('¡Se elimino el elemento!', 'X', {
            duration: 10000,
            panelClass: ['success-snackbar']
          });
        },
        error => {
          this.disableSubmit = false;
          this.utilitiesService.formErrorMessages(error, this.form, this.snackBar); 
        }
      );
    }

}


