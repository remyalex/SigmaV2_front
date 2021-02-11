import { Component, OnInit } from '@angular/core';
import { Personacalendario } from '../models/personacalendario.model';
import { PersonacalendarioService } from '../services/personacalendario.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_PERSONACALENDARIO } from './../personacalendario.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Componente encargado de gestionar la creación de persona calendario */
@Component({
  selector: 'sigma-administracion-personacalendario-create',
  templateUrl: './personacalendario-create.component.html'
})
export class PersonacalendarioCreateComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONACALENDARIO;
  /** Objeto usado para enviar al servicio de CRUD*/
  personacalendario: Personacalendario = new Personacalendario();
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
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private servicio: PersonacalendarioService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
  ) {
    this.form = this.formBuilder.group({
      'disponibleId': [null, Validators.compose([Validators.required])],
      'fechaFin': [null, Validators.compose([Validators.required])],
      'fechaInicio': [null, Validators.compose([Validators.required])],
      'personaDisponibilidadId': [null, Validators.compose([Validators.required])],
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.personacalendario = new Personacalendario();
    this.enviada = false;
  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new(): void {
    this.enviada = false;
    this.personacalendario = new Personacalendario();
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
    this.servicio.create(this.personacalendario).subscribe(
      data => {
        this.snackBar.open(this.constants.successSave, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        const urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin');
        this.router.navigate([urlBack]);
      },
      error => {
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
    for (let inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

}
