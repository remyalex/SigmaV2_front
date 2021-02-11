import { Component, OnInit } from '@angular/core';
import { Formato } from '../models/formato.model';
import { FormatoService } from '../services/formato.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_FORMATO } from './../formato.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Clase encargada de la creación del componente */
@Component({
  selector: 'sigma-administracion-formato-create',
  templateUrl: './formato-create.component.html'
})
export class FormatoCreateComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_FORMATO;
  /** Objeto usado para enviar al servicio de CRUD*/
  formato: Formato = new Formato();
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /** Bandera que permite ocultar el botón guardar */
  disabledBtn_Login = false;
  /** Bandera que permite saber si el formato que debe ser cargado se requiere*/
  requerido = true;
  /** Variable usada para procesar el mensaje que se presentará al usuario */
  mensaje = '';
  /**Contenedor de los elementos del formulario */
  public form: FormGroup;

  /**
  * Método encargado de construir una instancia de la clase
  * 
  * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param router Componente usado para redireccionar entre componentes
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesServices Componente de utilidades de peticiones a servicios
  */
  constructor(
    private servicio: FormatoService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesServices: UtilitiesService,
    private dataGenericService:  DataGenericService
  ) {
    this.form = this.formBuilder.group({
      codigo: [null, [Validators.required, Validators.maxLength(20)]],
      plantilla: [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      tipoDocumentoId: [null, Validators.compose([Validators.required])],
      archivoId: [null, Validators.compose([Validators.required])]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.formato = new Formato();
    this.enviada = false;
  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new(): void {
    this.enviada = false;
    this.formato = new Formato();
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

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.create(this.formato).subscribe(
      data => {
        this.snackBar.open(this.constants.successSave, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.dataGenericService.removeCacheListContain(this.constants.path_administracion_formato);
        this.router.navigateByUrl('/administracion/formato/admin');
      },
      error => {
        this.disabledBtn_Login = false;
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
    this.disabledBtn_Login = true;
    if (this.form.valid == true) {
      this.disabledBtn_Login = true;
      this.save();
    } else {
      this.disabledBtn_Login = false;
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

  /**
   * Método encargado de actualizar el formato a las fechas del formulario actualizadas
   *
   * @param atributo Nombre del atributo que se va a actualizar
   * @param objeto Evento con el valor actualizado por el usuario
   * */
  setDataFormato(atributo: any, objeto: any) {
    this.disabledBtn_Login = false;
    this.formato[atributo] = objeto;
  }

  /** Método que sobreescribe el valor requerido 
   * @param boolean valor true o false
  */
  validateUploadFile(boolean) {
    this.requerido = boolean;
  }
}
