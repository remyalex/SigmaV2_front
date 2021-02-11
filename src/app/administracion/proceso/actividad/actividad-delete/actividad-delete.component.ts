import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { ActivatedRoute } from '@angular/router';
import { ActividadModel } from '../../models/actividad.model';
import { CONST_ADMINISTRACION_PROCESOACTIVIDAD } from '../actividades.constant';
import { ProcesoService } from '../../services/proceso.service';
import { Proceso } from '../../models/proceso.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Componente encargado de gestionar la eliminación de actividad */
@Component({
  selector: 'sigma-administracion-procesoactividad-delete',
  templateUrl: './actividad-delete.component.html'
})
export class ActividadDeleteComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PROCESOACTIVIDAD;
  /** Objeto usado para enviar al servicio de CRUD*/
  proceso: Proceso;
  /** Objeto usado para enviar al servicio de CRUD*/
  actividadToDelete: ActividadModel;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera usada para ocultar el botón guardar */
  disabled = false;

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param dataGenericService Servicio Generico de datos usado en el componente.
  * @param utilitiesServices Componente de utilidades de peticiones a servicios
  */
  constructor(
    private dialogRef: MatDialogRef<ActividadDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private servicio: ProcesoService,
    private snackBar: MatSnackBar,
    private dataGenericService: DataGenericService,
    private utilitiesServices: UtilitiesService
  ) {
    this.proceso = data.proceso;
    this.actividadToDelete = data.actividadToDelete;
    this.form = fb.group({ id: [this.actividadToDelete.id, Validators.required] }
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
  save() {
    this.disabled = true;
    for (let act = 0; act <= this.proceso.actividades.length; act++) {
      if (this.proceso.actividades[act].id === this.actividadToDelete.id) {
        this.proceso.actividades.splice(act, 1);
        break;
      }
    }
    this.addCondicionTransicion();
    this.servicio.update(this.proceso).subscribe(
      (data: Proceso) => {
        this.servicio.sendNewDataSelection(data);
        this.dialogRef.close(this.form.value);
        this.snackBar.open('¡Se elimino el elemento!', 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.proceso.actividades.push(this.actividadToDelete);
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
