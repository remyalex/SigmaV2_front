import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers, DoCheck } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Equipocalendario } from '../models/equipocalendario.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EquipocalendarioService } from '../services/equipocalendario.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_EQUIPOCALENDARIO } from './../equipocalendario.constant';
import * as _moment from 'moment';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeComponent } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Variable encargada de gestionar la propiedad momento de una hora  */
const moment = (_moment as any).default ? (_moment as any).default : _moment;
/** Constante con posibles valores de formatos de fecha/hora aceptados por el componente */
export const MY_CUSTOM_FORMATS = {
  parseInput: 'DD-MM-YYYY',
  parseInputHours: '+00 HH:mm:ss',
  fullPickerInput: 'DD/MM/YYYY HH:mm:ss',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'HH:mm',
  formatoInput: 'YYYY/MM/DD HH:mm:ss',
  formatoDateControl: 'YYYY/MM/DD HH:mm:ss'
};

/** Componente encargado de gestionar la creación de los calendarios de un equipo */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-administracion-equipocalendario-edit',
  templateUrl: './equipocalendario-edit.component.html',
  providers: [
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ],
})
export class EquipocalendarioEditComponent implements OnInit, DoCheck {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPOCALENDARIO;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;
  /** Variable usada para gestionar el modelo del calendario del equipo */
  equipocalendario: Equipocalendario;
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

  /** Objeto de tipo control usado para gestionar la fecha */
  fechaFinControl = new FormControl(moment(null));

   /** Objeto de tipo control usado para gestionar la fecha */
  fechaInicioControl = new FormControl(moment(null));


  /**
   * Método encargado de construir una instancia de la clase
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param router Componente usado para redireccionar entre componentes
   * @param data Información a procesar
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   * @param differs Elemento usado para mantener la información clonada.
  */
  constructor(
    private servicio: EquipocalendarioService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EquipocalendarioEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Equipocalendario,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private utilitiesService: UtilitiesService,
  ) {
    this.equipocalendario = data;
    this.formatoFechas();
    this.form = this.formBuilder.group(
      {
        'id': [null, Validators.compose([Validators.required])],
        'activo': [null, Validators.compose([Validators.required])],

        'disponibleId': [null, Validators.compose([Validators.required])],
        'equipoDisponibilidadId': [null, Validators.compose([Validators.required])],
        'fechaFin': [null, Validators.compose([Validators.required])],
        'fechaInicio': [null, Validators.compose([Validators.required])],
      }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.equipocalendario));
    this.customerDiffer = this.differs.find(this.equipocalendario).create();

  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        for (let key in this.equipocalendario) {
          this.equipocalendario[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.update(this.equipocalendario).subscribe(data => {
      this.dialogRef.close(this.form.value);
      this.enviada = false;
      this.snackBar.open(this.constants.successEdit, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
    }, error => {
      this.disableSubmit = false;
      if (error.status === 400) {
        if (error.error.length > 0) {
          this.form.controls[error.error[0].field].setErrors({
            incorrect: true
          });

          this.snackBar.open(error.error[0].message, 'X', {
            duration: 10000,
            panelClass: ['error-snackbar']
          });
        } else {
          this.snackBar.open(this.constants.error500, 'X', {
            duration: 10000,
            panelClass: ['error-snackbar']
          });
        }
      }
      if (error.status === 500 || error.status === 0) {
        this.snackBar.open(this.constants.error500, 'X', {
          duration: 10000,
          panelClass: ['error-snackbar']
        });
      }
    });
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

  /** Método encargado de asignar al modelo el valor modificado en el formulario */
  setEquipoDisponibilidadEquipocalendario(_id: number) {
    this.equipocalendario.disponibilidad.id = _id;
  }

  /** Método encargado de notificar los cambios del componente check hacia el modelo */
  ngDoCheck(): void {
    const changes = this.customerDiffer.diff(this.equipocalendario);
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
          this.constants['path_administracion_equipocalendario_' + record.key], this.equipocalendario[record.key])
          .then(data => {
            if (data) {
              this.equipocalendario[record.key.replace(/Id$/, '') + 'Valor'] = data.valor;
            }
          });
      }
    });
  }

  /** Método encargado de gestionar las fechas y horas del formulario */
  formatoFechas() {
    const replaces = ['+00 ', '+00', '0 ', '.0', , ' 0 '];

    this.equipocalendario.fin = this.equipocalendario.fin;
    this.equipocalendario.inicio = this.equipocalendario.inicio;

    replaces.map(data => {
    });

    this.fechaFinControl = new FormControl(
      moment(this.utilitiesService.convertDateToString(this.equipocalendario.fin, MY_CUSTOM_FORMATS.formatoDateControl))
    );
    this.fechaInicioControl = new FormControl(
      moment(this.utilitiesService.convertDateToString(this.equipocalendario.inicio, MY_CUSTOM_FORMATS.formatoDateControl))
    );

  }

  /** 
   * Método encargado de actualizar el valor la fecha del atributo indicada en el modelo
   * @param atributo Nombre del atributo que se va a actualizar del modelo
   * @param event Evento realizado por el usuario con el valor modificado
   **/
  changeDate(atributo: any, event: any) {
    this.equipocalendario[atributo] = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.parseInput);
  }

  /** 
   * Método encargado de actualizar el valor la hora del atributo indicado en el modelo
   * @param atributo Nombre del atributo que se va a actualizar del modelo
   * @param event Evento realizado por el usuario con el valor modificado
   **/
  changeTime(atributo, event) {
    this.equipocalendario[atributo] = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.parseInputHours);
  }
}
