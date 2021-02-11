import { Component, OnInit } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_USUARIO } from './../usuario.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Componente encargado de gestionar la creación de usuario */
@Component({
  selector: 'sigma-administracion-usuario-create',
  templateUrl: './usuario-create.component.html'
})
export class UsuarioCreateComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_USUARIO;
  /** Objeto usado para enviar al servicio de CRUD*/
  usuario: Usuario = new Usuario();
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Variable usada para procesar el mensaje que se presentará al usuario */
  mensaje = '';
  /** lista de roles */
  roles = [];
  /** lista de origenes */
  public origenes = [];
  /**Contenedor de los elementos del formulario */
  public form: FormGroup;
  /**Variable usada para habilitar el select zona en caso de que el rol requiera que se asigne una al usuario */
  enableZona = false;

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
    private servicio: UsuarioService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
  ) {
    this.form = this.formBuilder.group({
      apellidos: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      clave: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      claveConfirmacion: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      correoElectronico: [null, Validators.compose([Validators.required, Validators.email, Validators.maxLength(255)])],
      identificacion: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      nombres: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      origenId: [null, Validators.compose([Validators.required])],
      usuario: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      roles: [null, Validators.compose([Validators.required])],
      estado: [null, Validators.compose([Validators.required])],
    }, {
      validator: RegistrationValidator.validate.bind(this.form)
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.usuario = new Usuario();
    this.enviada = false;

    this.servicio.listaOrigen().subscribe(data => {
      this.origenes = data;
    });
  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new(): void {
    this.enviada = false;
    this.usuario = new Usuario();
    this.usuario.usuario = "";
    this.usuario.clave = "";
    this.usuario.claveConfirmacion = "";
  }

  /** Método encargado de devolver a la página principal el componente */
  onBack(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val == 1) {
        let urlBack = location.pathname.replace(
          location.pathname.split('/')[location.pathname.split('/').length - 1],
          'admin'
        );
        this.router.navigate([urlBack]);
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento 
   * de información al servicio */
  save() {
    this.servicio.create(this.usuario).subscribe(
      data => {
        this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        const urlBack = location.pathname.replace(
          location.pathname.split('/')[location.pathname.split('/').length - 1],
          'admin'
        );
        this.router.navigate([urlBack]);
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

    if (this.form.valid == true) {
      this.disableSubmit = true;
      this.save();
    } else {
      this.disableSubmit = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
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
    for (let inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  /** Mëtodo encargado de activar o desactivar los componentes CLAVE y CLAVECONFIRMACIÓN
   * donde el origen del usuario debe ser externo para activar
   */
  setOrigenUsuario() {
    if (this.origenes.length <= 0) {
      return true;
    }

    if (this.usuario.origen) {
      let origen = this.origenes.filter(data => data.id == this.usuario.origen.id).map(data => {
        return data;
      });
      if (origen[0].valor == this.constants.usuarioExterno) {
        this.form.get('clave').enable();
        this.form.get('claveConfirmacion').enable();
      } else {
        this.usuario.clave = '';
        this.usuario.claveConfirmacion = '';
        this.form.get('clave').disable();
        this.form.get('claveConfirmacion').disable();
      }
    }
  }

  changeRol(event: any) {
    let requiredZona = false;
    for (const rol of this.usuario.roles) {
      if (rol.usuarioRequiereAsignarZona) {
        requiredZona = true;
      }
    }

    if (requiredZona) {
      this.enableZona = true;
      this.form.addControl('zona', new FormControl (null, Validators.required));
    } else {
      this.form.removeControl('zona');
      this.enableZona = false;
      this.usuario.zona = null;
    }
  }
}

/** Clase encargada de validar campos del formulario */
export class RegistrationValidator {
  /** método encargado de validar campos del formulario
  * @param form objeto formulario que será validado
  */
  static validate(form: FormGroup) {
    let clave = form.controls.clave.value;
    let claveConfirmacion = form.controls.claveConfirmacion.value;

    if (claveConfirmacion != null) {
      if (claveConfirmacion.length <= 0) {
        return null;
      }
    }

    if (claveConfirmacion !== clave) {
      form.controls['claveConfirmacion'].setErrors({ 'passwordConfirm': true });
      // return {
      //     doesMatchPassword: true
      // };
    }
    else {
      form.controls['claveConfirmacion'].setErrors(null);
      //form.controls['claveConfirmacion'].updateValueAndValidity();
    }

    return null;
  }
}
