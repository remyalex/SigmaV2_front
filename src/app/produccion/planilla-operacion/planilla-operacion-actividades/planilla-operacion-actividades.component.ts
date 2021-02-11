import { Component, OnInit, Inject, KeyValueChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Actividades} from '../models/planilla-operacion.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlanillaOperacionService } from '../services/planilla-operacion.service';
import { MatSnackBar } from '@angular/material';
import { CONST_REGISTRAR_PLANILLA_OPERACION } from './../planilla-operacion.constant';
import * as _moment from 'moment';
// Date time completo
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';

/** Variable encargada de gestionar la propiedad momento de una hora  */
const moment = (_moment as any).default ? (_moment as any).default : _moment;

/** Constante con posibles valores de formatos de fecha/hora aceptados por el componente */
export const MY_CUSTOM_FORMATS = {
  parseInput: 'YYYY-MM-DD',
  parseInputHours: '+00 HH:mm:ss',
  fullPickerInput: 'DD/MM/YYYY HH:mm:ss',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'HH:mm',
  formatoInput: 'YYYY/MM/DD HH:mm:ss',
  formatoDateControl: 'YYYY/MM/DD HH:mm:ss'
};

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sigma-produccion-planilla-operacion-actividades',
  templateUrl: './planilla-operacion-actividades.component.html',
  providers: [
    // `MomentDateTimeAdapter` can be automatically provided by importing
    // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },

    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ],
})

export class PlanillaOperacionActividadesComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_PLANILLA_OPERACION;
  actividades: Actividades;
  form_actividades: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  disableEdit = false;
  clone: Actividades;
  horaInicioProgramacion: string;
  horaFinProgramacion: string;
  fechaDesde: string;
  equipo_clone: Actividades;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: PlanillaOperacionService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PlanillaOperacionActividadesComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Actividades,
  ) {

    this.form_actividades = this.formBuilder.group(
      {

        'nombreItem': [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
        'descripcion': [null, Validators.compose([Validators.required, Validators.maxLength(150)])],
        'calificacion': [null, Validators.compose([Validators.required])],
        'variableControl': [null, Validators.compose([Validators.maxLength(20)])],
        'lecturaInicial': [null, Validators.compose([])],
        'lecturaFinal': [null, Validators.compose([])],
        'observacion': [null, Validators.compose([Validators.maxLength(300)])],

      }
    );
    if (data !== null) {
      this.actividades = data;
      this.disableEdit = true;
      this.form_actividades.get('nombreItem').disable();
      this.form_actividades.get('descripcion').disable();
    } else {
      this.actividades = {};
    }
  }


  /** Método encargado de inicializar el componente */
  ngOnInit() {}

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close();
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.dialogRef.close(this.actividades);
    this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    this.markAndValidateAllInputs(this.form_actividades);
    this.enviada = true;
    this.disableSubmit = true;
    if (this.form_actividades.valid == true) {
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
    // tslint:disable-next-line:forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  setDataEquipo(atributo: any, objetoAtributo: any) {
    this.actividades[atributo] = objetoAtributo;
  }


  /** Método encargado de notificar los cambios del componente check hacia el modelo */
  ngDoCheck(): void {}
 
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
          this.constants['path_administracion_equipo_' + record.key], this.actividades[record.key])
          .then(data => {
            if (data) {
              this.actividades[record.key.replace('Id', '') + 'Valor'] = data.valor;
            }
          });
      }
    });

  }


}
