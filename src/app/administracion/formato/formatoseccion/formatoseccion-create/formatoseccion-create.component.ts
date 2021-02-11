import { Component, OnInit } from '@angular/core';
import { Formatoseccion } from '../models/formatoseccion.model';
import { FormatoseccionService } from '../services/formatoseccion.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_FORMATOSECCION } from '../formatoseccion.constant';
import { Formato } from '../../models/formato.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { FormatoService } from '../../services/formato.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Clase encargada de la creación del componente */
@Component({
  selector: 'sigma-administracion-formatoseccion-create',
  templateUrl: './formatoseccion-create.component.html'
})
export class FormatoseccionCreateComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_FORMATOSECCION;
  /** Objeto Formato Seccion usado para enviar al servicio de CRUD*/
  formatoseccion: Formatoseccion = new Formatoseccion();
  /** Variable que recibe parametro por URL  */
  formatoId = null;
  /** Objeto usado para enviar al servicio de CRUD*/
  formato: Formato;
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
  * 
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilsServices Componente de utilidades de peticiones a servicios
  * @param activeRoute Componente usado para recibir los parametros enviados por la URL
  */
  constructor(
    private servicio: FormatoService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private utilsServices: UtilitiesService,
    private dataGenericService:  DataGenericService
  ) {
    this.activeRoute.queryParams.subscribe(params => {
      if (!params.formato) {
        this.snackBar.open(this.constants.errorFormato, 'X', {
          duration: 10000,
          panelClass: ['error-snackbar']
        });
        const url = this.constants.path_administracion_formato_return;
        this.router.navigate([url]);
      } else {
        this.formatoId = params.formato;
      }
    });

    this.form = this.formBuilder.group({
      activo: [true, null],
      descripcion: [null, Validators.compose([Validators.required, Validators.maxLength(250)])],
      nombre: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      orden: [
        null,
        Validators.compose([
          Validators.required,
          Validators.min(1), Validators.max(9999999999),
          Validators.pattern('[0-9]*')
        ])
      ]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.formatoseccion = new Formatoseccion();
    this.enviada = false;
    this.servicio.format$.subscribe(
      (objetoFormato: Formato) => {
        this.formato = objetoFormato;
      }
    );
  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new(): void {
    this.enviada = false;
    this.formatoseccion = new Formatoseccion();
  }

  /** Método encargado de devolver a la página principal el componente */
  onBack(): void {
    const formato = {};
    this.servicio.updateDataFormato(formato);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        const urlBack = location.pathname.replace(
          location.pathname.split('/')[location.pathname.split('/').length - 1],
          'admin'
        );
        this.router.navigate([urlBack], {
          queryParams: { formato: this.formatoId }
        });
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.formato.secciones.push(this.formatoseccion);
    this.servicio.update(this.formato).subscribe(
      data => {
        this.snackBar.open(this.constants.successSave, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        const urlBack = location.pathname.replace(
          location.pathname.split('/')[location.pathname.split('/').length - 1],
          'admin'
        );
        this.servicio.updateDataFormato(data);
        this.dataGenericService.removeCacheListContain(this.constants.path_administracion_formato_return);
        this.router.navigate([urlBack], {
          queryParams: { formato: this.formatoId }
        });
      },
      error => {
        this.disableSubmit = false;
        this.utilsServices.formErrorMessages(error, this.form, this.snackBar);
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

  /**
   * Método encargado de actualizar el formato de texto del formulario
   * @param data Nombre del atributo que se va a actualizar
   * */
  patternString(data) {
    let re = /[a-zA-z]/gi;
    let newstr = data.target.value.replace(re, "");
    this.formatoseccion.orden = newstr.trim();
  }

}
