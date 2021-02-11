import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Insumo } from '../models/insumo.model';
import { InsumoService } from '../services/insumo.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_INSUMO } from './../insumo.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar la eliminación de un insumo */
@Component({
  selector: 'sigma-administracion-insumo-delete',
  templateUrl: './insumo-delete.component.html'
})
export class InsumoDeleteComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_INSUMO;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  insumo: Insumo;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disabledSubmit = false;


   /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private dialogRef: MatDialogRef<InsumoDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Insumo,
    private servicio: InsumoService,
    private snackBar: MatSnackBar,
    private utilitiesServices: UtilitiesService,
    private dataGenericService:  DataGenericService
  ) {
    this.insumo = data;
    this.form = fb.group( { id: [this.insumo.id, Validators.required] }
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
    this.disabledSubmit = true;
    this.servicio.delete(this.insumo.id).subscribe(
      data => {
        this.dataGenericService.removeCacheListContain(this.constants.path_administracion_insumo);
        this.dialogRef.close(this.form.value);
        this.snackBar.open(this.constants.deleteSuccess, 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.disabledSubmit = false;
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

}
