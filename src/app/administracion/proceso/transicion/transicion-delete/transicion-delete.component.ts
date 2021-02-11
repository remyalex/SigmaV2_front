import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TransicionModel } from '../../models/transicion.model';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_PROCESOTRANSICION } from '../transicion.constant';
import { ProcesoService } from '../../services/proceso.service';
import { Proceso } from '../../models/proceso.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Componente encargado de gestionar la eliminación de una transición */
@Component({
  selector: 'sigma-administracion-procesotransicion-delete',
  templateUrl: './transicion-delete.component.html'
})
export class TransicionDeleteComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PROCESOTRANSICION;
  /** objeto que recibe data enviada al componente */
  proceso: Proceso;
  /** Objeto usado para enviar al servicio de CRUD*/
  transicionToDelete: TransicionModel;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera usada para ocultar el botón guardar */
  disabled = false;

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param utilitiesServices Componente de utilidades de peticiones a servicios
  */
  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private servicio: ProcesoService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<TransicionDeleteComponent>,
    private utilitiesServices: UtilitiesService
  ) {
    this.proceso = data.proceso;
    this.transicionToDelete = data.transicionToDelete;
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
    this.disabled = true;
    for (let tran = 0; tran < this.proceso.transiciones.length; tran++) {
      if (this.proceso.transiciones[tran].id === this.transicionToDelete.id) {
        this.proceso.transiciones.splice(tran, 1);
        break;
      }
    }
    this.addCondicionTransicion();
    this.servicio.update(this.proceso).subscribe(
      (data: Proceso) => {
        this.servicio.sendNewDataSelection(data);
        this.dialogRef.close(0);
        this.snackBar.open('¡Se elimino el elemento!', 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.disabled = false;
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

  /** Método encargado de añadir la condición en la Transición */
  addCondicionTransicion() {
    // tslint:disable-next-line: forin
    for (const transition in this.proceso.transiciones) {
      // tslint:disable-next-line: max-line-length
      this.proceso.transiciones[transition].condicion = this.proceso.transiciones[transition].condiciones;
    }
  }

}
