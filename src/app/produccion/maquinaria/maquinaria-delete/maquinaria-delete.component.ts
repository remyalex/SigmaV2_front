import { Component, OnInit, Inject } from '@angular/core';
import { CONST_PRODUCCION_MAQUINARIA } from '../maquinaria.constant'
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Maquinaria } from '../models/maquinaria.model';
import { MaquinariaService } from '../services/maquinaria.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

@Component({
  selector: 'sigma-maquinaria-delete',
  templateUrl: './maquinaria-delete.component.html',
  styleUrls: []
})
export class MaquinariaDeleteComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_MAQUINARIA;
  maquinaria: Maquinaria;
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
    private dialogRef: MatDialogRef<MaquinariaDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Maquinaria,
    private servicio: MaquinariaService,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService
  ) {
    console.log("data", data);
    this.maquinaria = data;
    this.form = fb.group({ id: [this.maquinaria.id, Validators.required] }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close(0);
  }
   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.disableSubmit = true;
    this.servicio.delete(this.maquinaria.id).subscribe(
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
