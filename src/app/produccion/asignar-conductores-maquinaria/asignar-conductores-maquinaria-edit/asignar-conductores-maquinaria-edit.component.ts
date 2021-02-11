import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { ViewChild, AfterViewInit, Input, OnChanges } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { AsignarConductoresMaquinaria, RegistrarVale} from '../models/asignar-conductores-maquinaria.model';
import { AsignarConductoresMaquinariaCriteria } from '../models/asignar-conductores-maquinaria-criteria.model';
import { AsignarConductoresMaquinariaDatasource } from '../services/asignar-conductores-maquinaria.datasource';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AsignarConductoresMaquinariaService } from '../services/asignar-conductores-maquinaria.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ASIGNAR_CONDUCTORES_MAQUINARIA } from './../asignar-conductores-maquinaria.constant';
import * as _moment from 'moment';
// Date time completo
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeComponent } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { DatePipe } from '@angular/common';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

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
  selector: 'sigma-produccion-asignar-conductores-maquinaria-edit',
  templateUrl: './asignar-conductores-maquinaria-edit.component.html',
  providers: [
    // `MomentDateTimeAdapter` can be automatically provided by importing
    // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },

    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ],
})

export class AsignarConductoresMaquinariaEditComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ASIGNAR_CONDUCTORES_MAQUINARIA;
  equipo: AsignarConductoresMaquinaria;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  disableEdit = true;
  clone: AsignarConductoresMaquinaria;
  horaInicioProgramacion: string;
  horaFinProgramacion: string;
  fechaDesde: string;
  equipo_clone: AsignarConductoresMaquinaria;
  datasend: any = [];
  turnoPersona: any = '';
  fechaTurno : string = '';
  registroVale: RegistrarVale;
  personal = new AsignarConductoresMaquinariaCriteria();
  personalExport = new AsignarConductoresMaquinariaCriteria();
  selected = false;
  solicitudMaterial;
  /** Columnas de los datos que se exportarán a presionar el botón exportar del componente*/
  dataExport: any = [];
  datosComplete: any ;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'item',
    'descripcion',
    'calificacion',
    'variableControl',
    'lecturaInicial',
    'lecturaFinal'
  ];

  public minDate: any = null;
  public maxDate: any = null;
  public fechaDesdeControl = new FormControl(moment(null));
  public fechaHastaControl = new FormControl(moment(null));
  public horaInicioControl = new FormControl(moment(null));
  public horaFinControl = new FormControl(moment(null));
  

  displayedColumns: string[] = [ 'pk', 'cantidad'];
  dataSource;;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: AsignarConductoresMaquinariaService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AsignarConductoresMaquinariaEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: AsignarConductoresMaquinaria,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
  ) {

    this.form = this.formBuilder.group(
      {
        'numeroVale': [null, Validators.compose([Validators.required, Validators.maxLength(10)])],
        'planta': [null, Validators.compose([Validators.required])],
        'temperatura':  [null, Validators.compose([Validators.required, Validators.maxLength(10)])],
        'asentamiento': [null, Validators.compose([Validators.required, Validators.min(0),
          Validators.pattern('^[+-]?[0-9]{1,10}(?:.[0-9]{1,2})?$')])],
        'numeroMovil': [null, Validators.compose([Validators.required, Validators.maxLength(30)])],
        'horaEntrada': [null, Validators.compose([Validators.required])],
        'horaLlegada': [null, Validators.compose([Validators.required])],
        'horaSalida': [null, Validators.compose([Validators.required])],
        'cantidad': [null, Validators.compose([Validators.required, Validators.min(0),
          Validators.pattern('^[+-]?[0-9]{1,10}(?:.[0-9]{1,2})?$')])],
        'conductor': [null, Validators.compose([Validators.required])],
        'formula': [null, Validators.compose([Validators.required])],
        'jefeBascula': [null, Validators.compose([Validators.required])],
        'tipoVale': [null, Validators.compose([Validators.required])],
      }
    );

    this.form.updateValueAndValidity();
    this.datosComplete = data;
    this.dataSource =this.datosComplete.seleccionado
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.registroVale = new RegistrarVale();
  }


  loadData(): void {}

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.equipo_clone = { ...this.equipo };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(value => {
      if (value == 1) {
        // tslint:disable-next-line:forin
        for (const key in this.equipo) {
          this.equipo[key] = this.clone[key];
        }
        this.dialogRef.close();
      } else {
        this.equipo = { ...this.equipo_clone };
      }
    });
  }



   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
  const payload: any = this.datosComplete.seleccionado;
  this.datasend = [];

  for (let i = 0; i < payload.length; i++) {
    if (payload[i].formulario === true){
      let array = 
      {
        idSolicitudTipoMaterial: payload[i].id,
        activo: true,
        horaEntrada: this.registroVale.horaEntrada,
        horaSalida: this.registroVale.horaSalida,
        horaLlegada: this.registroVale.horaLlegada,
        temperatura: Number(this.registroVale.temperatura),
        asentamiento: parseFloat(this.registroVale.asentamiento),
        cantidad: parseFloat(this.registroVale.cantidad),
        pk: payload[i].pk,
        fechaRegistro: this.convertStringToTime(new Date),
        numeroVale: Number(this.registroVale.numeroVale),
        idPlanta: this.registroVale.planta.id,
        planta: this.registroVale.planta.descripcion,
        idTipoVale: this.registroVale.tipoVale.id,
        tipoVale: this.registroVale.tipoVale.descripcion,
        idTurno: payload[i].turno.id,
        turno: payload[i].turno.descripcion,
        idJefeBascula: this.registroVale.jefeBascula.id,
        jefeBascula: this.registroVale.jefeBascula.descripcion,
        idTipoMaterial: payload[i].tipoMaterial.id,
        tipoMaterial: payload[i].tipoMaterial.descripcion,
        idEquipo:  payload[i].equipo.id,
        equipo:  payload[i].equipo.equipoTipo.valor,
        idPersona: this.registroVale.conductor.id,
        conductor: this.registroVale.conductor.nombresYapellidos,
        idFormula:  this.registroVale.formula.id,
        civ: payload[i].civ,
        idBarrio: this.datosComplete.datosMapa.barrio.id,
        barrio: this.datosComplete.datosMapa.barrio.nombre,
        idLocalidad: this.datosComplete.datosMapa.localidad.id,
        numeroMovil: Number(this.registroVale.numeroMovil),
        localidad: this.datosComplete.datosMapa.localidad.nombre,
        formula: this.registroVale.formula.descripcion,
    }
    this.datasend.push(array);
    }
  }
    this.disableSubmit = true;
    this.servicio.create(this.datasend).subscribe(data => {
      this.enviada = false;
      this.dialogRef.close(this.form.value);
      this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
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

  convertStringToTime(data) {
    const date = new Date(data);
    const localOffSet = date.getTimezoneOffset() * 60000;
    const utc = date.getTime() + localOffSet;
    return utc
  }

}
