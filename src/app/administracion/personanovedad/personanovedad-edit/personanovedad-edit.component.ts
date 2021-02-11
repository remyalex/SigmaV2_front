import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Personanovedad } from '../models/personanovedad.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PersonanovedadService } from '../services/personanovedad.service';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_PERSONANOVEDAD } from './../personanovedad.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { Persona } from '../../persona/models/persona.model';
import { PersonaService } from '../../persona/services/persona.service';

/** Componente encargado de gestionar la edición de una novedad de persona*/
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sigma-administracion-personanovedad-edit',
  templateUrl: './personanovedad-edit.component.html'
})

export class PersonanovedadEditComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONANOVEDAD;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  personanovedad: Personanovedad;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone = {};
  /** Objeto de enviar */
  public submitted: any;
  /** Objeto de tipo persona a gestionar en la edición */
  public persona: Persona = new Persona;


    /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param servicioPersona Servicio usado en el componente para gestionar las peticiones a persona
   * @param data Información a procesar
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   */
   constructor(
    private servicioPersona: PersonaService,
    private servicio: PersonanovedadService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PersonanovedadEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Personanovedad,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService
  ) {
    this.personanovedad = data;
    this.persona = this.servicioPersona.persona;

    this.form = this.formBuilder.group({
        'id': [null, Validators.compose([ Validators.required ])],
        'personaId': [null],
        'activo': [null, Validators.compose([ Validators.required ])],
        'fechaDesde': [null, Validators.compose([ Validators.required ])],
        'fechaHasta': [null, Validators.compose([ Validators.required ])], 
        'observaciones': [null, Validators.compose([ Validators.maxLength(300) ])],
        'tipoNovedadPersonaId': [null, Validators.compose([ Validators.required ])],
      }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.personanovedad));
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val == 1) {
        for (const key in this.personanovedad) {
          this.personanovedad[key] =  this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.updatePersona(this.persona).subscribe(data => {
      this.servicio.setChangeNoticePersonaNovedad(true);
      this.dialogRef.close(this.form.value);
      this.enviada = false;
      this.servicioPersona.persona = data;
      this.servicioPersona.updateClonePersona(this.servicioPersona.persona);
      this.snackBar.open(this.constants.successSave, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
    }, error => {
      this.disableSubmit = false;
      this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
    });
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    this.disableSubmit = true;
    if (this.form.valid){
      this.disableSubmit = true;
      this.save();
    } else {
      this.disableSubmit = false;
      this.snackBar.open(this.constants.errorForm, 'X', {
        duration: 10000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    // tslint:disable-next-line:forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

   /**
   * Método encargado de actualizar el valor de la persona
   * en el modelo del negocio
   *
   * @param _id Identificador de persona trasmitido por el usuario con la informacion
   * seleccionada en el formulario.
   */
  setPersonaPersonanovedad (_id: number) {
    this.personanovedad.personaId = _id;
  }

  /**
   * Método encargado de actualizar el valor del tipo de novedad de a persona
   * en el modelo del negocio
   *
   * @param objeto Objeto trasmitido por el usuario con la informacion
   * seleccionada en el formulario.
   */
   setTipoNovedadPersonaPersonanovedad (objecto: any) {
    this.personanovedad.tipoNovedadPersona = objecto;
  }
}
