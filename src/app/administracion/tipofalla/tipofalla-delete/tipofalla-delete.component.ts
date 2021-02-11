import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Tipofalla } from '../models/tipofalla.model';
import { TipofallaService } from '../services/tipofalla.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_TIPOFALLA } from './../tipofalla.constant';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar la eliminación de un tipo de falla */
@Component({
  selector: 'sigma-administracion-tipofalla-delete',
  templateUrl: './tipofalla-delete.component.html'
})
export class TipofallaDeleteComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOFALLA;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  tipofalla: Tipofalla;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;


 /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  */
  constructor(
    private dialogRef: MatDialogRef<TipofallaDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Tipofalla,
    private servicio: TipofallaService,
    private snackBar: MatSnackBar,
    private dataGenericService:  DataGenericService
  ) {
    this.tipofalla = data;
    this.form = fb.group( { id: [this.tipofalla.id, Validators.required] }
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
    this.servicio.delete(this.tipofalla.id).subscribe(
      data => {
        this.dataGenericService.removeCacheListContain(this.constants.path_administracion_tipofalla);
        this.dialogRef.close(this.form.value);
        this.snackBar.open(this.constants.deleteSuccess, 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.snackBar.open(
          this.constants.deleteError, 'X', {
            duration: 10000,
            panelClass: ['error-snackbar']
          }
        );
      }
    );
  }

}
