import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Persona } from '../models/persona.model';
import { PersonaService } from '../services/persona.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_PERSONA } from './../persona.constant';
import { PersonanovedadService } from '../../personanovedad/services/personanovedad.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar la eliminación de una persona */
@Component({
  selector: 'sigma-administracion-persona-delete',
  templateUrl: './persona-delete.component.html'
})
export class PersonaDeleteComponent implements OnInit {
  
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONA;
  /** Objeto usado para enviar al servicio de CRUD*/
  persona: Persona;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  * @param servicioPersonaNovedad Servicio Persona Novedad usado en el componente para gestionar las peticiones
  */
  constructor(
    private dialogRef: MatDialogRef<PersonaDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Persona,
    private servicio: PersonaService,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService,
    private servicioPersonaNovedad: PersonanovedadService,
    private dataGenericService:  DataGenericService
  ) {
    this.persona = data;
    this.form = fb.group({ id: [this.persona.id, Validators.required] }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.servicioPersonaNovedad.changeNoticePersonaNovedad$.subscribe(
      userData$ => {
        this.servicio.detail(this.persona.id).subscribe(updateData => {
          this.persona.novedades = updateData.novedades;
        });
      });
  }

  /** Método encargado de gestionar el cierre del dialog*/
  close() {
    this.dialogRef.close(0);
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    if (this.persona.novedades.length > 0) {
      this.snackBar.open(
        'Novedades asociadas, por favor elimínelas e intente nuevamente', 'X', {
        duration: 10000,
        panelClass: ['error-snackbar']
      }
      );
      this.dialogRef.close(this.form.value);
    } else {
      this.servicio.delete(this.persona.id).subscribe(
        data => {
          this.dataGenericService.removeCacheListContain(this.constants.path_administracion_persona);
          this.dialogRef.close(this.form.value);
          this.snackBar.open('¡Se elimino el elemento!', 'X', {
            duration: 10000,
            panelClass: ['success-snackbar']
          });
        },
        error => {
          this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
          if (error.status == 500 || error.status == 0) {
            this.snackBar.open('Se presento un problema con el servidor, por favor comuníquese con el administrador', 'X', {
              duration: 10000,
              panelClass: ['error-snackbar']
            }
            );
          }
        }
      );
    }
  }

}
