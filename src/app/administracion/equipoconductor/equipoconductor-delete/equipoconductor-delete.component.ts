import { CONST_ADMINISTRACION_EQUIPOCONDUCTOR } from './../equipoconductor.constant';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { EquipoConductor } from '../models/equipoconductor.model';
import { EquipoConductorService } from '../services/equipoconductor.service';

/** Componente encargado de gestionar la eliminación de un conductor de equipo */
@Component({
  selector: 'sigma-administracion-equipoconductor-delete',
  templateUrl: './equipoconductor-delete.component.html'
})
export class EquipoconductorDeleteComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPOCONDUCTOR;
  /** Variable usada para gestionar el modelo del conductor del equipo */
  equipoconductor: EquipoConductor;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;


  /**
  * Método encargado de construir una instancia de la clase
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param data Información a procesar
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param fb Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   **/
  constructor(
    private dialogRef: MatDialogRef<EquipoconductorDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: EquipoConductor,
    private servicio: EquipoConductorService,
    private snackBar: MatSnackBar,
    private _utilitiesService: UtilitiesService
  ) {
    this.equipoconductor = data;
    this.form = fb.group( { id: [this.equipoconductor.id, Validators.required] }
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
    this.disableSubmit = true;
    this.servicio.delete(this.equipoconductor.id).subscribe(
      data => {
        this.dialogRef.close(this.form.value);
        this.snackBar.open(this.constants.deleteSuccess, 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.disableSubmit = false;
        this._utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

}
