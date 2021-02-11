import { Component, OnInit } from '@angular/core';
import { Formatoseccioncampo } from '../models/formatoseccioncampo.model';
import { FormatoseccioncampoService } from '../services/formatoseccioncampo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_FORMATOSECCIONCAMPO } from '../formatoseccioncampo.constant';
import { Formato } from '../../../models/formato.model';
import { FormatoService } from '../../../services/formato.service';

/** Clase encargada de la creación del componente */
@Component({
  selector: 'sigma-administracion-formatoseccioncampo-create',
  templateUrl: './formatoseccioncampo-create.component.html'
})
export class FormatoseccioncampoCreateComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_FORMATOSECCIONCAMPO;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;

  /** Variable usada para procesar el mensaje que se presentará al usuario */
  mensaje = '';
  /** Objeto usado para enviar al servicio de CRUD*/
  formato: Formato;
  /** Objeto SeccionCampo usado para enviar al servicio de CRUD*/
  formatoseccioncampo: Formatoseccioncampo;
  /** Variable que recibe parametro por URL  */
  formatoId = null;
  /** Variable que recibe parametro por URL  */
  seccionId = null;
  /** Variable que recibe parametro por URL  */
  sectionPosition = null;

  /**Contenedor de los elementos del formulario */
  public form: FormGroup;


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param activeRoute Componente usado para recibir los parametros enviados por la URL
  */
  constructor(
    private servicio: FormatoService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute
  ) {
    this.formatoseccioncampo = new Formatoseccioncampo();
    this.activeRoute.queryParams.subscribe(params => {
      if (!params.formato || !params.seccion || params.key === -1) {
        this.snackBar.open(
          this.constants.errorFormatoseccion, 'X', {
            duration: 10000,
            panelClass: ['error-snackbar']
          }
        );
        const url = this.constants.path_administracion_formatoseccion_return;
        this.router.navigate([url]);
      } else {
        this.formatoId = params.formato;
        this.seccionId = params.seccion;
        this.sectionPosition = params.key;
      }
    });

    this.form = this.formBuilder.group({
      descripcion: [null, Validators.compose([Validators.required, Validators.maxLength(250)])],
      listaId: [{ value: null, disabled: true }],
      nombre: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      orden: [
        null,
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(9999),
          Validators.pattern('^[0-9]*$')
        ])
      ],
      tipoCampoFormatoId: [null, Validators.compose([Validators.required])]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.servicio.format$.subscribe(
      (objetoFormato: Formato) => {
        this.formato = objetoFormato;
      }
    );
    this.formatoseccioncampo = new Formatoseccioncampo();
    this.enviada = false;
    this.form.get('tipoCampoFormatoId').valueChanges.subscribe(
      result => {
        if (this.form.get('tipoCampoFormatoId').value !== undefined) {
          if (this.form.get('tipoCampoFormatoId').value.valor === 'LISTA') {
            this.form.get('listaId').enable();
          } else {
            this.form.get('listaId').disable();
            this.formatoseccioncampo.lista = null;
          }
        }
      }
    );
  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new(): void {
    this.enviada = false;
    this.formatoseccioncampo = new Formatoseccioncampo();
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
      if (val === 1) {
        let urlBack = location.pathname.replace(
          location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin'
        );
        this.router.navigate([urlBack], { queryParams: { key: this.sectionPosition, formato: this.formatoId, seccion: this.seccionId } });
      }
    });
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.formato.secciones[this.sectionPosition].campos.push(this.formatoseccioncampo);
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
        this.router.navigate([urlBack], { queryParams: { key: this.sectionPosition, formato: this.formatoId, seccion: this.seccionId } });
      },
      error => {
        this.formato.secciones[this.sectionPosition].campos.splice(-1, 1);
        this.disableSubmit = false;
        this.snackBar.open('Se presento un problema con el servidor, por favor comuníquese con el administrador', 'X', {
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
    for (let inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  /** Método encargado de sobreescribir un atributo
   * @param atributo parametro que será reemplazado
   * @param objeto parametro que reemplaza
   */
  setDataCampo(atributo: any, objeto: any) {
    this.formatoseccioncampo[atributo] = objeto;
  }

  /**
   * Método encargado de actualizar el formato de texto del formulario
   * @param data Nombre del atributo que se va a actualizar
   * */
  patternString(data) {
    let re = /[a-zA-Z]/gi;
    let newstr = data.target.value.replace(re, "");
    this.formatoseccioncampo.orden = newstr.trim();
  }
}
