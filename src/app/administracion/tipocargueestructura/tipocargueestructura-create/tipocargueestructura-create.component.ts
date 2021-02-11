import { Component, OnInit, Input } from '@angular/core';
import { Tipocargueestructura } from '../models/tipocargueestructura.model';
import { TipocargueestructuraService } from '../services/tipocargueestructura.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_TIPOCARGUEESTRUCTURA } from './../tipocargueestructura.constant';
import { TipocargueService } from '../../tipocargue/services/tipocargue.service';
import { Tipocargue } from '../../tipocargue/models/tipocargue.model';

import * as _moment from 'moment';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeComponent } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { NumberValidator } from 'src/app/shared/form/number.validator';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
/** Variable encargada de gestionar la propiedad momento de una hora  */
const moment = (_moment as any).default ? (_moment as any).default : _moment;
/** Constante con posibles valores de formatos de fecha/hora aceptados por el componente */
export const MY_CUSTOM_FORMATS = {
  parseInput: 'DD-MM-YYYY',
  parseInputHours: '+00 HH:mm:ss',
  fullPickerInput: 'DD/MM/YYYY HH:mm:ss',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'HH:mm',
  formatoInput: 'YYYY-MM-DD',
  formatoDateControl: 'YYYY/MM/DD HH:mm:ss'
};

/** Componente encargado de gestionar la creación de tipoCargueEstructura */
@Component({
  selector: 'sigma-administracion-tipocargueestructura-create',
  templateUrl: './tipocargueestructura-create.component.html',
  providers: [
    // `MomentDateTimeAdapter` can be automatically provided by importing
    // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },

    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ],
})
export class TipocargueestructuraCreateComponent implements OnInit {

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private servicio: TipocargueestructuraService,
    private router: Router,
    private dialogRef: MatDialogRef<TipocargueestructuraCreateComponent>,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private dataGenericService:  DataGenericService
  ) {
    this.tipoCargue = this.servicio.tipoCargue;
    this.totalElementos = this.tipoCargue.estructuras.length > 0 ? this.tipoCargue.estructuras.length : 0;
    this.form = this.formBuilder.group({
      'activo': [null],
      'campo': [null, Validators.compose([Validators.required, , Validators.maxLength(8)])],
      'descripcion': [null, Validators.compose([Validators.required, , Validators.maxLength(100)])],
      'fechaMaxima': [null],
      'fechaMinima': [null, null],
      'listaId': [null],
      //'longitudMaxima': [null, Validators.compose([Validators.min(0), Validators.max(Number.MAX_SAFE_INTEGER)])],
      //'numeroMaximo': [null, Validators.compose([Validators.max(Number.MAX_SAFE_INTEGER)])],
      //numeroMinimo': [null, Validators.compose([Validators.max(Number.MAX_SAFE_INTEGER)])],
      'longitudMaxima': [null, Validators.compose([, Validators.maxLength(4)])],
      'numeroMaximo': [null, Validators.compose([, Validators.maxLength(18)])],
      'numeroMinimo': [null, Validators.compose([, Validators.maxLength(18)])],
      'requeridoId': [null, Validators.compose([Validators.required])],
      'tipoCargueId': [null],
      'tipoDatoId': [null, Validators.compose([Validators.required])],
    }, { validator: NumberValidator.numberMax });
  }

  /** variable que recibe el tamañao maximo de elementos Estructuras */
  totalElementos: number = 0;
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOCARGUEESTRUCTURA;
  /** Objeto usado para enviar al servicio de CRUD*/
  tipocargueestructura: Tipocargueestructura = new Tipocargueestructura();
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
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone = {};
  /** Objeto usado para enviar al servicio de CRUD*/
  tipoCargue: Tipocargue;
  /** Valor mínimo permitido para la fecha  */
  public minDate: any = null;
  /** Valor máximo permitido para la fecha  */
  public maxDate: any = null;
  /** Valor tipo Date mínimo permitido para la fecha */
  public fechaMinimaControl = new FormControl(moment(null));
  /** Valor tipo Date maxima permitido para la fecha  */
  public fechaMaximaControl = new FormControl(moment(null));

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.tipocargueestructura = new Tipocargueestructura();
    this.enviada = false;
  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new(): void {
    this.enviada = false;
    this.tipocargueestructura = new Tipocargueestructura();
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        try {
          this.tipoCargue.estructuras = this.tipoCargue.estructuras.slice(0, this.totalElementos);
        } catch (error) { }
        // for (const key in this.tipocargueestructura) {
        //   this.tipocargueestructura[key] = this.clone[key];
        // }
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.tipoCargue.estructuras[this.totalElementos] = this.tipocargueestructura;
    this.tipoCargue.estructuras = this.utilitiesService.uniqArray(this.tipoCargue.estructuras);
    this.servicio.updateTipoCargue(this.tipoCargue).subscribe(data => {
      this.servicio.disparar('cargarGrilla');
      this.dialogRef.close(this.form.value);
      this.enviada = false;
      this.servicio.updateTipoCargueClone(this.tipoCargue);
      this.servicio.setChangeNoticeTipoCargueEstructura(true);
      this.dataGenericService.removeCacheListContain(this.constants.path_administracion_tipocargueestructura);
      this.snackBar.open(this.constants.successSave, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
    }, error => {
      try {
        this.tipoCargue.estructuras.slice(this.totalElementos, 1);
      } catch (error) { }
      this.disableSubmit = false;
      this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
    });
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
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 10000,
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

  /** Método encargado reemplazar el valor lista del objeto tipocargueestructura
   * @param object objeto lista que reemplazará
   */
  setListaTipocargueestructura(object: any) {
    this.tipocargueestructura.lista = object;
  }

  /** Método encargado reemplazar el valor requerido del objeto tipocargueestructura
   * @param object objeto lista que reemplazará
   */
  setRequeridoTipocargueestructura(object: any) {
    this.tipocargueestructura.requerido = object;
  }

  /** Método encargado reemplazar el valor tipoCargue del objeto tipocargueestructura
   * @param object objeto lista que reemplazará
   */
  setTipoCargueTipocargueestructura(object: any) {
    this.tipocargueestructura.tipoCargue = object;
  }

  /** Método encargado reemplazar el valor tipoDato del objeto tipocargueestructura
   * @param object objeto lista que reemplazará
   */
  setTipoDatoTipocargueestructura(object: any) {
    this.tipocargueestructura.tipoDato = object;
  }

  /**
   * Método encargado de actualizar el formato a las fechas del formulario actualizadas
   *
   * @param atributo Nombre del atributo que se va a actualizar
   * @param event Evento con el valor actualizado por el usuario
   * @param tipo Tipo de atributo a actualizar
   * */
  changeDate(atributo: any, event: any, tipo: string) {
    this.tipocargueestructura[atributo] = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.parseInput);

    if (tipo == 'min') {
      this.minDate = event.value;
    } else if (tipo == 'max') {
      this.maxDate = event.value;
    }
  }

  /** Método encargado de retornar si un número es mayor o menor
   * @param valorMinimo valor numérico minimo a evaluar
   * @param valorMaximo valor numérico maximo a evaluar
   */
  validateNumerosMayorMenor(valorMinimo: number, valorMaximo: number): boolean {
    if (valorMinimo != null && valorMaximo != null) {
      if (valorMinimo > valorMaximo) {
        return false;
      }
    }
    return true;
  }
}
