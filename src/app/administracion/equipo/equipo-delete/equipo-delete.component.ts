import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Equipo } from '../models/equipo.model';
import { EquipoService } from '../services/equipo.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_EQUIPO } from './../equipo.constant';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Clase encargada de la eliminación de equipos */
@Component({
  selector: 'sigma-administracion-equipo-delete',
  templateUrl: './equipo-delete.component.html'
})
export class EquipoDeleteComponent implements OnInit {
  /**  Constantes que utiliza el componente */
  constants = CONST_ADMINISTRACION_EQUIPO;
  /** Objeto usado para enviar al servicio de CRUD*/
  equipo: Equipo;
  /** Formulario contenedor del componente */
  form: FormGroup;
  /**  Bandera para indicar si el componente se encuentra en procesamiento por el servicio*/
  disabledSubmit = false;

   /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param data Información a almacenar
   * @param fb Componente usado para Agrupar elementos en el formulario
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   */
  constructor(
    private dialogRef: MatDialogRef<EquipoDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Equipo,
    private servicio: EquipoService,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService,
    private dataGenericService:  DataGenericService
  ) {
    this.equipo = data;
    this.form = fb.group( { id: [this.equipo.id, Validators.required] }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close () {
    this.dialogRef.close(0);
  }

  /** Método encargado de realizar solicitud de almacenamiento al servicio*/
  save () {
    this.disabledSubmit = true;
    this.servicio.delete(this.equipo.id).subscribe(
      data => {
        this.dialogRef.close(this.form.value);
        this.snackBar.open('¡Se elimino el elemento!', 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
        this.dataGenericService.removeCacheListContain(this.constants.path_administracion_equipo);
      },
      error => {
        this.disabledSubmit = false;
        this.utilitiesService.formErrorMessages(error, this.form, this.snackBar); 
      }
    );
  }

}
