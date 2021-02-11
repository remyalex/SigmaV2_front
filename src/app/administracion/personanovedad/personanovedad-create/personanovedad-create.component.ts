import { Component, OnInit, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { Personanovedad } from '../models/personanovedad.model';
import { PersonanovedadService } from '../services/personanovedad.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_PERSONANOVEDAD } from './../personanovedad.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { Persona } from '../../persona/models/persona.model';
import { PersonaService } from '../../persona/services/persona.service';

/** Componente encargado de gestionar la creación de una novedad de persona*/
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sigma-administracion-personanovedad-create',
  templateUrl: './personanovedad-create.component.html'
})
export class PersonanovedadCreateComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONANOVEDAD;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  personanovedad: Personanovedad = new Personanovedad();
  /** Variable usada para identificar las diferencias de modelo y formulario*/
  customerDiffer: KeyValueDiffer<string, any>;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;

  /** Variable usada para procesar el mensaje que se presentará al usuario */
  mensaje = '';
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone = {};
  /** Objeto de enviar */
  public submitted: any;
  /** Fecha minima permitida */
  public minDate: any = null;
  /** Fecha maxima permitida */
  public maxDate: any = null;
  /** Tipo de carge permitido */
  public tipoCargue: number = 0;
  /** Objeto de tipo persona */
  public persona: Persona = new Persona();
  /** Total de elementos permitidos */
  public totalElementos: number = 0;


   /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param servicioPersona Servicio usado en el componente para gestionar las peticiones a persona
   * @param router Componente usado para redireccionar entre componentes
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   * @param differs Elemento usado para mantener la información clonada.
   */
  constructor(
    private servicio: PersonanovedadService,
    private servicioPersona: PersonaService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PersonanovedadCreateComponent>,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private utilitiesService: UtilitiesService
  ) {
    this.persona = this.servicioPersona.persona;
    this.totalElementos = this.persona.novedades.length > 0 ? this.persona.novedades.length : 0;
    this.personanovedad = new Personanovedad();

    this.form = this.formBuilder.group({
      'activo': [null],
      'fechaDesde': [null, Validators.compose([Validators.required])],
      'fechaHasta': [null, Validators.compose([Validators.required])],
      'observaciones': [null, Validators.compose([ Validators.maxLength(300) ])],
      'personaId': [null],
      'tipoNovedadPersonaId': [null, Validators.compose([Validators.required])],
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.personanovedad));
    this.customerDiffer = this.differs.find(this.personanovedad).create();
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val == 1) {
        // tslint:disable-next-line:forin
        for (const key in this.personanovedad) {
          this.personanovedad[key] =  this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de devolver a la página principal el componente */
  onBack(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val == 1) {
          let urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin');
          this.router.navigate([urlBack]);
        }
      }
    );
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.persona.novedades[this.totalElementos] = this.personanovedad;
    this.persona.novedades = this.utilitiesService.uniqArray(this.persona.novedades);
    this.servicio.updatePersona(this.persona).subscribe(
      data => {
        this.disableSubmit = false;
        this.servicioPersona.persona = data;
        this.servicioPersona.updateClonePersona(this.servicioPersona.persona);

        this.dialogRef.close(this.personanovedad);
        this.snackBar.open(this.constants.successSave, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.disableSubmit = false;
        this.utilitiesService.formErrorMessages(error, this.form, this.snackBar); 
      }
    );
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    this.disableSubmit = true;
    if (this.form.valid ) {
      this.disableSubmit = true;
      this.save();
    } else {
      this.disableSubmit = false;
      this.snackBar.open(this.constants.errorForm, 'X', {
        duration: 5000,
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
  setPersonaPersonanovedad(_id: number) {
    this.personanovedad.personaId = _id;
  }

   /**
   * Método encargado de actualizar el valor del tipo de novedad de a persona
   * en el modelo del negocio
   *
   * @param objeto Objeto trasmitido por el usuario con la informacion
   * seleccionada en el formulario.
   */
   setTipoNovedadPersonaPersonanovedad(objeto: any) {
    this.personanovedad.tipoNovedadPersona = objeto;
  }

}
