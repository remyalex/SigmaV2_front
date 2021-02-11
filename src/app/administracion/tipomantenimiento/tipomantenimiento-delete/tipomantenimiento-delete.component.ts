import { UtilitiesService } from './../../../shared/services/utilities.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Tipomantenimiento } from '../models/tipomantenimiento.model';
import { TipomantenimientoService } from '../services/tipomantenimiento.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_TIPOMANTENIMIENTO } from './../tipomantenimiento.constant';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar la eliminación de un tipo mantenimiento */
@Component({
  selector: 'sigma-administracion-tipomantenimiento-delete',
  templateUrl: './tipomantenimiento-delete.component.html'
})
export class TipomantenimientoDeleteComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOMANTENIMIENTO;
  tipomantenimiento: Tipomantenimiento;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  disabledButton = false;


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param _utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private dialogRef: MatDialogRef<TipomantenimientoDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Tipomantenimiento,
    private servicio: TipomantenimientoService,
    private snackBar: MatSnackBar,
    private _utilitiesService: UtilitiesService,
    private dataGenericService:  DataGenericService
  ) {
    this.tipomantenimiento = data;
    this.form = fb.group({ id: [this.tipomantenimiento.id, Validators.required] }
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
    this.disabledButton = true;
    this.servicio.delete(this.tipomantenimiento.id).subscribe(
      data => {
        this.dialogRef.close(this.form.value);
        this.snackBar.open(this.constants.deleteSuccess, 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
        this.dataGenericService.removeCacheListContain(this.constants.path_administracion_tipomantenimiento);
      },
      error => {
        this.disabledButton = false;
        this._utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

}
