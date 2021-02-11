import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_RECURSO } from '../recurso.constant';
import { Recurso } from '../models/recurso.model';
import { RecursoService } from '../services/recurso.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar la creación de recurso */
@Component({
  selector: 'sigma-administracion-recurso-create',
  templateUrl: './recurso-create.component.html'
})
export class RecursoCreateComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_RECURSO;
  /** Objeto usado para enviar al servicio de CRUD*/
  recurso: Recurso = new Recurso();
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
  */
  constructor(
    private servicio: RecursoService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.form = this.formBuilder.group({
      'equipoId': [null, Validators.compose([Validators.required])],
      'fechaDesde': [null, Validators.compose([Validators.required])],
      'fechaHasta': [null, Validators.compose([Validators.required])],
      'intervalo': [null, Validators.compose([Validators.required])],
      'tipoAsignacionId': [null, Validators.compose([Validators.required])],
      'tipoDisponibilidadId': [null, Validators.compose([Validators.required])],
      'turnoId': [null, Validators.compose([Validators.required])],
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.recurso = new Recurso();
    this.enviada = false;
  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new(): void {
    this.enviada = false;
    this.recurso = new Recurso();
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
    this.servicio.create(this.recurso).subscribe(
      data => {
        this.snackBar.open(this.constants.successSave, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        const urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin');
        this.router.navigate([urlBack]);
      },
      error => {
        this.disableSubmit = false;
        if (error.status == 400) {
          this.form.controls[error.error[0].field].setErrors({ 'incorrect': true });
          this.snackBar.open(error.error[0].message, 'X', {
            duration: 10000,
            panelClass: ['error-snackbar']
          });
        }
        if (error.status == 500 || error.status == 0) {
          this.snackBar.open(this.constants.error500, 'X', {
            duration: 10000,
            panelClass: ['error-snackbar']
          });
        }
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

  /** Método para reemplazar valor equipoId por _id del objeto recurso 
  * @param _id variable tipo numerico
  */
  setEquipoRecurso(_id: number) {
    this.recurso.equipoId = _id;
  }

  /** Método para reemplazar valor tipoAsignacionId por _id del objeto recurso 
  * @param _id variable tipo numerico
  */
  setTipoAsignacionRecurso(_id: number) {
    this.recurso.tipoAsignacionId = _id;
  }

  /** Método para reemplazar valor tipoDisponibilidadId por _id del objeto recurso 
  * @param _id variable tipo numerico
  */
  setTipoDisponibilidadRecurso(_id: number) {
    this.recurso.tipoDisponibilidadId = _id;
  }

  /** Método para reemplazar valor turnoId por _id del objeto recurso 
  * @param _id variable tipo numerico
  */
  setTurnoRecurso(_id: number) {
    this.recurso.turnoId = _id;
  }


}
