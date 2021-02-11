import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Personanovedad } from '../models/personanovedad.model';
import { PersonanovedadService } from '../services/personanovedad.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_PERSONANOVEDAD } from './../personanovedad.constant';
import { Persona } from '../../persona/models/persona.model';
import { PersonaService } from '../../persona/services/persona.service';

/** Componente encargado de gestionar la eliminación de una novedad de persona */
@Component({
  selector: 'sigma-administracion-personanovedad-delete',
  templateUrl: './personanovedad-delete.component.html'
})
export class PersonanovedadDeleteComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONANOVEDAD;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  personanovedad: Personanovedad;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Objeto de tipo persona */
  public persona: Persona = new Persona;
  /** id de la persona novedad a editar */
  public key: number = 0;


   /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param servicioPersona Componente de utilidades de peticiones a los servicios de las personas
  */
  constructor(
    private dialogRef: MatDialogRef<PersonanovedadDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private servicio: PersonanovedadService,
    private servicioPersona: PersonaService,
    private snackBar: MatSnackBar
  ) {
    this.persona = this.servicioPersona.persona;
    this.key = data.key;
    this.personanovedad = data.personanovedad;
    this.form = fb.group({ 
      id: [this.personanovedad.id, Validators.required] }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close(0);
  }
   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.persona.novedades.splice(this.key, 1);
    this.servicio.updatePersona(this.persona).subscribe(
      data => {
        this.servicioPersona.persona = data;
        this.servicioPersona.updateClonePersona(this.servicioPersona.persona);
        this.dialogRef.close(this.form.value);
        this.snackBar.open(this.constants.deleteSuccess, 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.snackBar.open(this.constants.error500, 'X', {
          duration: 10000,
          panelClass: ['error-snackbar']
        }
        );
      }
    );
  }

}
