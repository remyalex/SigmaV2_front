import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Tipocargueestructura } from '../models/tipocargueestructura.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TipocargueestructuraService } from '../services/tipocargueestructura.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_TIPOCARGUEESTRUCTURA } from './../tipocargueestructura.constant';
import * as moment from 'moment';
import { NumberValidator } from 'src/app/shared/form/number.validator';
import { Tipocargue } from '../../tipocargue/models/tipocargue.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeComponent } from 'ng-pick-datetime';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
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

/** Componente encargado de gestionar la edición de un tipoCargueEstructura */
@Component({
  selector: 'sigma-administracion-tipocargueestructura-edit',
  templateUrl: './tipocargueestructura-edit.component.html',
  providers: [
    // `MomentDateTimeAdapter` can be automatically provided by importing
    // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },

    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ],
})
export class TipocargueestructuraEditComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOCARGUEESTRUCTURA;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;
  /** Objeto usado para enviar al servicio de CRUD*/
  tipocargueestructura: Tipocargueestructura = new Tipocargueestructura();
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone = {};
  /** Objeto usado para enviar al servicio de CRUD*/
  tipoCargue: Tipocargue;
  /** variable tipo numerica que recibe valor por data */
  key: number = 0;
  /** Valor mínimo permitido para la fecha  */
  public minDate: any = null;
  /** Valor máximo permitido para la fecha  */
  public maxDate: any = null;
  /** Valor tipo Date mínimo permitido para la fecha  */
  public fechaMinimaControl = new FormControl(moment(null));
  /** Valor tipo Date máximo permitido para la fecha  */
  public fechaMaximaControl = new FormControl(moment(null));


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param data Información a procesar
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param differs Elemento usado para mantener la información clonada.
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private servicio: TipocargueestructuraService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<TipocargueestructuraEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Tipocargueestructura,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private utilitiesService: UtilitiesService,
    private dataGenericService:  DataGenericService
  ) {
    this.tipoCargue = this.servicio.tipoCargue;
    this.tipocargueestructura = data['tipocargueestructura'];
    this.key = data['key'];
    this.formatoFechas();

    this.minDate = this.utilitiesService.convertDateToString(this.tipocargueestructura.fechaMinima, MY_CUSTOM_FORMATS.formatoInput);
    this.maxDate = this.utilitiesService.convertDateToString(this.tipocargueestructura.fechaMaxima, MY_CUSTOM_FORMATS.formatoInput);

    this.form = this.formBuilder.group({
      'id': [null],
      'activo': [null],
      'campo': [null, Validators.compose([Validators.required, , Validators.maxLength(8)])],
      'descripcion': [null, Validators.compose([Validators.required, , Validators.maxLength(100)])],
      'fechaMaxima': [null],
      'fechaMinima': [null],
      'listaId': [null],
      //'longitudMaxima': [null, Validators.compose([Validators.min(0), Validators.max(Number.MAX_SAFE_INTEGER)])],
      //'numeroMaximo': [null, Validators.compose([Validators.max(Number.MAX_SAFE_INTEGER)])],
      //'numeroMinimo': [null, Validators.compose([Validators.max(Number.MAX_SAFE_INTEGER)])],
      'longitudMaxima': [null, Validators.compose([, Validators.maxLength(4)])],
      'numeroMaximo': [null, Validators.compose([, Validators.maxLength(18)])],
      'numeroMinimo': [null, Validators.compose([, Validators.maxLength(18)])],
      'requeridoId': [null, Validators.compose([Validators.required])],
      'tipoCargueId': [null],
      'tipoDatoId': [null, Validators.compose([Validators.required])],
    }, { validator: NumberValidator.numberMax });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.tipocargueestructura));
    this.customerDiffer = this.differs.find(this.tipocargueestructura).create();
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
      if (val == 1) {
        for (let key in this.tipocargueestructura) {
          this.tipocargueestructura[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    for (let key in this.tipoCargue.estructuras) {
      if (this.tipoCargue.estructuras[key].id == this.tipocargueestructura.id) {
        this.tipoCargue.estructuras[key] = this.tipocargueestructura;
      }
    }

    this.servicio.updateTipoCargue(this.tipoCargue).subscribe(data => {
      this.servicio.disparar('cargarGrilla');
      this.dialogRef.close(this.form.value);
      this.enviada = false;

      this.servicio.updateTipoCargueClone(this.tipoCargue);
      this.dataGenericService.removeCacheListContain(this.constants.path_administracion_tipocargueestructura);
      this.snackBar.open(this.constants.successSave, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
    }, error => {
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
      this.snackBar.open(this.constants.errorForm, 'X', {
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

  /** Devuelve un string que representa una fecha en foramto para el componente de fechas de material
  * @param fechaString objeto fecha tipo String que cambiará el formato
  */
  getFechaClientFormat(fechaString: string) {
    if (fechaString == null || fechaString == '') {
      return null;
    }
    let fechaAux = moment(fechaString, 'DD-MM-YYYY');
    let fecha = fechaAux;
    return fecha.toISOString().substr(0, 10);
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
    //this.tipocargueestructura.tipoCargue = object;
  }

  /** Método encargado reemplazar el valor tipoDato del objeto tipocargueestructura
   * @param object objeto lista que reemplazará
   */
  setTipoDatoTipocargueestructura(object: any) {
    this.tipocargueestructura.tipoDato = object;
  }

  /** Método encargado de notificar los cambios del componente check hacia el modelo */
  ngDoCheck(): void {
    const changes = this.customerDiffer.diff(this.tipocargueestructura);
    if (changes) {
      this.customerChanged(changes);
    }
  }

  /**
   * Método en cargado de actualizar el modelo del componente una
   * vez notificado un cambio en los campos
   *
   * @param changes Diccionario de claves que se modificaron
   */
  customerChanged(changes: KeyValueChanges<string, any>) {
    changes.forEachChangedItem((record: any) => {
      if (record.key.length > 2 && record.key.search('Id') > -1) {
        this.servicio.searchByList(
          this.constants['path_administracion_tipocargueestructura_' + record.key], this.tipocargueestructura[record.key])
          .then(data => {
            if (data) {
              this.tipocargueestructura[record.key.replace('Id', '') + 'Valor'] = data.valor;
            }
          });
      }
    });
  }

  /** Método encargado de gestionar las fechas y horas del formulario */
  formatoFechas() {
    this.tipocargueestructura.fechaMinimaDate = this.tipocargueestructura.fechaMinima;
    this.tipocargueestructura.fechaMaximaDate = this.tipocargueestructura.fechaMaxima;

    this.fechaMinimaControl = new FormControl(
      moment(this.utilitiesService.convertDateToString(this.tipocargueestructura.fechaMinimaDate, MY_CUSTOM_FORMATS.formatoInput))
    );

    this.fechaMaximaControl = new FormControl(
      moment(this.utilitiesService.convertDateToString(this.tipocargueestructura.fechaMaximaDate, MY_CUSTOM_FORMATS.formatoInput))
    );
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
