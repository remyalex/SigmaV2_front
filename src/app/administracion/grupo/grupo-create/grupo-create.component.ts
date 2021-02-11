import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { filter } from 'rxjs/operators';
import { Lista } from '../../listas/models/lista.model';
import { GrupoService } from '../services/grupo.service';
import { GrupoModel } from '../models/grupo.model';
import { CONST_ADMINISTRACION_GRUPO } from '../grupo.constant';

/** Componente encargado de gestionar la creación de un grupo en el sistema */
@Component({
  selector: 'sigma-administracion-grupo-create',
  templateUrl: './grupo-create.component.html'
})
export class GrupoCreateComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_GRUPO;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  newGroup: GrupoModel;
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
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  */
  constructor(
    private servicio: GrupoService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dataGenericService:  DataGenericService
  ) {
    this.form = this.formBuilder.group({
      'descripcion': [null, Validators.compose([Validators.required, Validators.maxLength(600)])],
      'nombre': [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      'origenLugarId': [null, Validators.compose([Validators.required])],
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.newGroup = new GrupoModel();
    this.enviada = false;
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
    console.log('objeto a enviar', this.newGroup);
    this.servicio.create(this.newGroup).subscribe(
      data => {
        this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.dataGenericService.removeCacheListContain(this.constants.path_administracion_grupo);
        const urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin');
        this.router.navigate([urlBack]);
      },
      error => {
        this.disableSubmit = false;
        this.snackBar.open(error.error[0].message, 'X', {
          duration: 10000,
          panelClass: ['error-snackbar']
        });
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


