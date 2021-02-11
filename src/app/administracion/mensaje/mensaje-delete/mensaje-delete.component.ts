import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Mensaje } from '../models/mensaje.model';
import { MensajeService } from '../services/mensaje.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_MENSAJE } from './../mensaje.constant';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar la eliminación de Mensaje */
@Component({
  selector: 'sigma-administracion-mensaje-visto',
  templateUrl: './mensaje-delete.component.html'
})
export class MensajeLeidoComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_MENSAJE;
  /** Objeto usado para enviar al servicio de CRUD*/
  mensaje: Mensaje;
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
    private dialogRef: MatDialogRef<MensajeLeidoComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Mensaje,
    private servicio: MensajeService,
    private snackBar: MatSnackBar,
    private dataGenericService:  DataGenericService
  ) {
    this.mensaje = data;
    this.form = fb.group({ id: [this.mensaje.id, Validators.required] }
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
    this.servicio.leido(this.mensaje).subscribe(
      data => {
        this.dataGenericService.removeCacheListContain(this.constants.path_administracion_mensaje);
        this.dialogRef.close(this.form.value);
        this.snackBar.open('¡Leido !', 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.snackBar.open(
          'Se presento un problema con el servidor, por favor comuníquese con el administrador', 'X', {
          duration: 10000,
          panelClass: ['error-snackbar']
        }
        );
      }
    );
  }

}
