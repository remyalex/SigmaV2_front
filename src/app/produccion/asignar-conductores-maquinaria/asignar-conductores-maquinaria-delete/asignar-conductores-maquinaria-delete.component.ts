import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AsignarConductoresMaquinaria } from '../models/asignar-conductores-maquinaria.model';
import { AsignarConductoresMaquinariaService } from '../services/asignar-conductores-maquinaria.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ASIGNAR_CONDUCTORES_MAQUINARIA } from './../asignar-conductores-maquinaria.constant';
import { UtilitiesService } from '../../../shared/services/utilities.service';

@Component({
  selector: 'sigma-produccion-asignar-conductores-maquinaria-delete',
  templateUrl: './asignar-conductores-maquinaria-delete.component.html'
})
export class AsignarConductoresMaquinariaDeleteComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ASIGNAR_CONDUCTORES_MAQUINARIA;
  equipo: any;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  motivo: string;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  disableEdit = true;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dialogRef: MatDialogRef<AsignarConductoresMaquinariaDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: AsignarConductoresMaquinaria,
    private servicio: AsignarConductoresMaquinariaService,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService
  ) {
    this.equipo = data;
 

    this.form = this.fb.group(
      {
        'cancelacionPersona': [null, Validators.compose([Validators.required, Validators.maxLength(300)])]

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

  save () {
    this.disableSubmit = true;
    this.dialogRef.close({cancelacionPersona: this.motivo});
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    this.disableSubmit = true;
    if (this.form.valid) {
      this.disableSubmit = true;
      this.save();
    } else {
      this.disableSubmit = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }


  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    for (let inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

}
