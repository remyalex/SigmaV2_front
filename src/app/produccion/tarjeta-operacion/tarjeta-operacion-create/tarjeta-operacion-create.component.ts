import { Component, OnInit } from '@angular/core';
import { TarjetaOperacion } from '../models/tarjeta-operacion.model';
import { TarjetaOperacionService } from '../services/tarjeta-operacion.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_PRODUCCION_TARJETA_OPERACION } from './../tarjeta-operacion.constant';
import * as _moment from 'moment';
// Date time completo
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';


/** Variable encargada de gestionar la propiedad momento de una hora  */
const moment = (_moment as any).default ? (_moment as any).default : _moment;
/** Constante con posibles valores de formatos de fecha/hora aceptados por el componente */
export const MY_CUSTOM_FORMATS = {
  parseInput: 'DD-MM-YYYY',
  parseInputGuion: 'YYYY-MM-DD',
  parseInputHours: '+00 HH:mm:ss',
  fullPickerInput: 'DD/MM/YYYY HH:mm:ss',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'HH:mm',
  formatoInput: 'YYYY/MM/DD HH:mm:ss',
  formatoDateControl: 'YYYY/MM/DD HH:mm:ss'
};

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sigma-produccion-tarjeta-operacion-create',
  templateUrl: './tarjeta-operacion-create.component.html',
  providers: [
    // `MomentDateTimeAdapter` can be automatically provided by importing
    // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },

    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ],
})

export class TarjetaOperacionCreateComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_TARJETA_OPERACION;
  equipo: TarjetaOperacion = new TarjetaOperacion();
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
  */
  constructor(
    private servicio: TarjetaOperacionService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService
  ) {
    this.form = this.formBuilder.group({
      'numeroTarjeta': [null, Validators.compose([Validators.required,
        Validators.min(1), Validators.maxLength(10),
        Validators.pattern('[0-9]*')
      ])],
      'quienDespacha': [null, Validators.compose([Validators.required, Validators.maxLength(150)])],
      'direccionSalida': [null, Validators.compose([Validators.required, Validators.maxLength(150)])],
      'horaSalida': [null, Validators.compose([Validators.required, Validators.maxLength(150)])],
      'kilometrajeSalida': [null, Validators.compose([Validators.required,
        Validators.min(1), Validators.maxLength(10),
        Validators.pattern('[0-9]*')
      ])],
      'tipoCarga': [null, Validators.compose([Validators.required, Validators.maxLength(300)])],
      'cantidad': [null, Validators.compose([Validators.required,
        Validators.min(1), Validators.maxLength(10),
        Validators.pattern('[0-9]*')
      ])],
      'direccionLlegada': [null, Validators.compose([Validators.required, Validators.maxLength(150)])],
      'horaLlegada': [null, Validators.compose([Validators.required, Validators.maxLength(150)])],
      'kilometrajeLlegada': [null, Validators.compose([Validators.required,
        Validators.min(1), Validators.maxLength(10),
        Validators.pattern('[0-9]*')
      ])],
      'quienRecibe': [null, Validators.compose([Validators.required, Validators.maxLength(150)])],
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.equipo = new TarjetaOperacion();
    this.enviada = false;
    this.getNumeroTarjeta();
    this.form.get('numeroTarjeta').disable();

  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new(): void {
    this.enviada = false;
    this.equipo = new TarjetaOperacion();
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
          const urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin')
          this.router.navigate([urlBack]);
        }
      }
    );
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.equipo.tipoPlanilla = { id: 400007 }; // Sin asignar
    const equipo_clone = { ...this.equipo };

    if (typeof this.equipo.horaSalida !== 'undefined') {
      equipo_clone.horaSalida = this.equipo.horaSalida + '.000000';
    }

    if (typeof this.equipo.horaLlegada !== 'undefined') {
      equipo_clone.horaLlegada = this.equipo.horaLlegada + '.000000';
    }

    this.servicio.create(equipo_clone).subscribe(
      data => {
        this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        const urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin');
        this.router.navigate([urlBack]);
      },
      error => {
        this.disableSubmit = false;
        this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
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
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  getNumeroTarjeta(){
    this.servicio.getDataNumeroTarjeta()
    .subscribe((data: any) => {
    console.log(data,'nansnaksn')
    this.equipo.numeroTarjeta = data.numeroTarjeta + 1; 
      },
      error => {}
    );
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
