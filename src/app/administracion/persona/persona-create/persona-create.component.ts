import { Component, OnInit } from '@angular/core';
import { Persona } from '../models/persona.model';
import { PersonaService } from '../services/persona.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_PERSONA } from './../persona.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar la creación de persona */
@Component({
  selector: 'sigma-administracion-persona-create',
  templateUrl: './persona-create.component.html'
})
export class PersonaCreateComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONA;
  /** Objeto usado para enviar al servicio de CRUD*/
  persona: Persona = new Persona();
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;

  /** Variable usada para procesar el mensaje que se presentará al usuario */
  mensaje = '';

  /**Contenedor de los elementos del formulario */
  public form: FormGroup;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  public submitted: any;
  /** Lista de datos requeridos para mostrar en el componente auto-complete */
  personaInfo = { nombres: this.constants.nombre, apellidos: this.constants.apellido };

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private servicio: PersonaService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private dataGenericService:  DataGenericService,
  ) {
    this.form = this.formBuilder.group({
      'activo': [null],
      'apellidos': [null, Validators.compose([Validators.required, Validators.maxLength(60)])],
      'areaUmvId': [null, Validators.compose([Validators.required])],
      'cargoId': [null, Validators.compose([Validators.required])],
      'categoriaPersonaId': [null, Validators.compose([Validators.required])],
      'correo': [null, Validators.compose([Validators.required, Validators.maxLength(60), Validators.email])],
      'estadoPersonaId': [null, Validators.compose([Validators.required])],
      'horaFin': [null],
      'horaInicio': [null],
      'identificacion': [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      'nombres': [null, Validators.compose([Validators.required, Validators.maxLength(60)])],
      'telefono': [null, Validators.compose([Validators.required, Validators.maxLength(20), Validators.min(0), Validators.max(Number.MAX_SAFE_INTEGER)])],
      'tipoIdentificacionId': [null, Validators.compose([Validators.required])],
      'tipoRegimenId': [null],
      'usuario': [null]
    }, { /* validator: TimeValidator.timeMin */ });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.persona = new Persona();
    this.enviada = false;
  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new(): void {
    this.enviada = false;
    this.persona = new Persona();
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
          let urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin')
          this.router.navigate([urlBack]);
        }
      }
    );
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    if (this.persona.usuario) {
      if (!this.persona.usuario.id) {
        this.persona.usuario = null;
      }
    }

    this.servicio.create(this.persona).subscribe(
      data => {
        this.snackBar.open(this.constants.successSave, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.dataGenericService.removeCacheListContain(this.constants.path_administracion_persona);
        this.router.navigateByUrl('/administracion/persona/admin');
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
    if (this.form.valid) {
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
}
