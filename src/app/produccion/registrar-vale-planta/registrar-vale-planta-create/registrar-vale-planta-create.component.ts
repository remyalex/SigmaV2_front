import { CONST_PRODUCCION_REGISTRO_VALE_PLANTA } from './../registrarValePlanta.constant';
import { Component, OnInit } from '@angular/core';
import { RegistrarValePlanta, RegistrarDetalleValePlanta } from '../models/registrar-vale-planta.model';
import { RegistrarValePlantaService } from '../services/registrar-vale-planta.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

@Component({
  selector: 'sigma-produccion-registrar-vale-planta-create',
  templateUrl: './registrar-vale-planta-create.component.html'
})
export class RegistrarValePlantaCreateComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_REGISTRO_VALE_PLANTA;
  registro: RegistrarValePlanta = new RegistrarValePlanta();
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disabledBtn_Login = false;
  requerido = true;

  /** Variable usada para procesar el mensaje que se presentará al usuario */
  mensaje = '';
  personaInfo = { nombres: this.constants.nombre, apellidos: this.constants.apellido };
  equipoInfo = { placa: 'placa', movil: 'movil', numeroInterno: 'numeroInterno', };

  /**Contenedor de los elementos del formulario */
  public form: FormGroup;
  /** fecha actual - variable auxiliar */
  fechaHoy: Date = new Date();

  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: RegistrarValePlantaService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesServices: UtilitiesService
  ) {
    this.form = this.formBuilder.group({
      numeroVale: [null, [Validators.required, Validators.maxLength(20)]],
      fecha: [null, Validators.compose([ Validators.required ])],
      horaEntrada: [null, Validators.compose([ Validators.required ])],
      horaSalida: [null, Validators.compose([ Validators.required ])],
      tipoMaterialId: [null, Validators.compose([ Validators.required ])],
      turnoId: [null, Validators.compose([ Validators.required ])],
      proveedorId: [null, Validators.compose([ Validators.required ])],
      jefeBasculaId: [null, Validators.compose([ Validators.required ])],
      plantaId: [null],
      tipoValeId: [null],
      equipoId: [null, Validators.compose([ Validators.required ])],
      pesoBruto: [null, Validators.compose([ Validators.required ])],
      pesoTara: [null, Validators.compose([ Validators.required ])],
      pesoNeto: [{value: null, disabled: true}, Validators.compose([ Validators.required ])],

      recibeId: [null, Validators.compose([ Validators.required ])],

    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.registro = new RegistrarValePlanta();
    this.registro.valesIngreso.push(new RegistrarDetalleValePlanta());
    this.enviada = false;
    this.fechaHoy = this.utilitiesServices.addDays(this.fechaHoy, 1);
    this.registro.fechaMin = this.utilitiesServices.convertDateToString(this.fechaHoy, 'DD-MM-YYYY');
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
        const urlBack = location.pathname.replace(
          location.pathname.split('/')[location.pathname.split('/').length - 1],
          'admin'
        );
        this.router.navigate([urlBack]);
      }
    });
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.create(this.registro).subscribe(
      data => {
        this.snackBar.open(this.constants.successSave, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.router.navigateByUrl('/produccion/registrar-vale-planta/admin');
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
    if (this.form.valid === true) {
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
    // tslint:disable-next-line: forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  setDataRegistrarValePlanta (atributo: any, objeto: any) {
    this.disabledBtn_Login = false;
    this.registro[atributo] = objeto;
  }

  validateUploadFile(boolean) {
    this.requerido = boolean;
  }

  setProveedor(usuarioSelected) {
    this.registro.valesIngreso[0].proveedor = usuarioSelected;
  }

  setPesoNeto (valor: number) {
    if (this.registro.valesIngreso[0].pesoBruto && this.registro.valesIngreso[0].pesoTara) {
      this.registro.valesIngreso[0].pesoNeto = this.registro.valesIngreso[0].pesoBruto - this.registro.valesIngreso[0].pesoTara;
    }
  }
}
