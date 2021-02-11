import { Component, OnInit } from '@angular/core';
import { Proceso } from '../models/proceso.model';
import { ProcesoService } from '../services/proceso.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_PROCESO } from './../proceso.constant';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { filter } from 'rxjs/operators';
import { Lista } from '../../listas/models/lista.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Componente encargado de gestionar la creación de proceso*/
@Component({
  selector: 'sigma-administracion-proceso-create',
  templateUrl: './proceso-create.component.html'
})
export class ProcesoCreateComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PROCESO;
  /** Objeto usado para enviar al servicio de CRUD*/
  proceso: Proceso = new Proceso();
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
  optionsList: Lista[];

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param servicioGeneral Componente de Servicio General de peticiones a servicios
  * @param utilitiesServices Componente de utilidades de peticiones a servicios
  */
  constructor(
    private servicio: ProcesoService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private servicioGeneral: DataGenericService,
    private utilitiesServices: UtilitiesService
  ) {
    this.form = this.formBuilder.group({
      'descripcion': [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      'nombre': [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      'url': [null, Validators.compose([Validators.required, Validators.maxLength(255)])]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.proceso = new Proceso();
    this.enviada = false;
  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new(): void {
    this.enviada = false;
    this.proceso = new Proceso();
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
    this.servicio.create(this.proceso).subscribe(
      data => {
        this.snackBar.open('¡Se actualizaron los datos con éxito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        const urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin');
        this.router.navigate([urlBack]);
      },
      error => {
        this.disableSubmit = false;
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
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
    if (this.form.valid === true) {
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
}

