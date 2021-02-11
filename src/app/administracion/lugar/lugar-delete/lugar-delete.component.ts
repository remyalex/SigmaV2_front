import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Lugar } from '../models/lugar.model';
import { LugarService } from '../services/lugar.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_LUGAR } from './../lugar.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Clase encargada de la eliminación del componente */
@Component({
  selector: 'sigma-administracion-lugar-delete',
  templateUrl: './lugar-delete.component.html'
})
export class LugarDeleteComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LUGAR;
  /** Objeto usado para enviar al servicio de CRUD*/
  lugar: Lugar;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesServices Componente de utilidades de peticiones a servicios
  */
  constructor(
    private dialogRef: MatDialogRef<LugarDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Lugar,
    private servicio: LugarService,
    private snackBar: MatSnackBar,
    private utilitiesServices: UtilitiesService,
    private dataGenericService:  DataGenericService

  ) {
    this.lugar = data;
    this.form = fb.group( { id: [this.lugar.id, Validators.required] }
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
    this.servicio.delete(this.lugar.id).subscribe(
      data => {
        this.dataGenericService.removeCacheListContain(this.constants.path_administracion_lugar);
        this.dialogRef.close(this.form.value);
        this.snackBar.open('¡Se elimino el elemento!', 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
       this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar)      
      }
    );
  }

}
