import { Contrato, Insumo } from './../../../administracion/insumo/models/insumo.model';
import { CONST_PRODUCCION_REGISTRO_INSUMO_EXISTENCIA } from './../insumoExistencia.constant';
import { InsumoExistencia } from './../models/insumo-existencia.model';
import { Component, OnInit } from '@angular/core';
import { InsumoExistenciaService } from '../services/insumo-existencia.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { parseIntAutoRadix } from '@angular/common/src/i18n/format_number';

@Component({
  selector: 'sigma-produccion-insumo-existencia-create',
  templateUrl: './insumo-existencia-create.component.html'
})
export class InsumoExistenciaCreateComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_REGISTRO_INSUMO_EXISTENCIA;
  registro: InsumoExistencia = new InsumoExistencia();
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disabledBtn_Login = false;
  requerido = true;
  hiddenTipoMezcla = true;
  /** Variable usada para procesar el mensaje que se presentará al usuario */
  mensaje = '';

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;

  /**Contenedor de los elementos del formulario */
  public form: FormGroup;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: InsumoExistenciaService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesServices: UtilitiesService
  ) {
    this.form = this.formBuilder.group({
      id: [null],
      fechaInicial: [null, Validators.compose([Validators.required])],
      fechaFinal: [null, Validators.compose([Validators.required])],
      contrato: [null, Validators.compose([Validators.required])],
      inventarioInicial: [null],
      cantidadEntrada: [null],
      cantidadSalida: [null],
      inventarioFinal: [null, Validators.compose([Validators.min(0)])],
      insumo: [null, Validators.compose([Validators.required])],
      tipoMezcla: [null],
      unidadMedida: [{ value: null, disabled: true }],
      codigoInsumo: [{ value: null, disabled: true }]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.registro = new InsumoExistencia();
    this.registro.inventarioInicial = 0;
    this.registro.inventarioFinal = 0;
    this.registro.cantidadEntrada = 0;
    this.registro.cantidadSalida = 0;
    this.enviada = false;
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
        this.router.navigateByUrl('/produccion/insumo-existencia/admin');
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

  realizarCalculoInventarioFinal() {
    if (this.registro) {
      const inv_final =
        (this.registro.inventarioInicial ? this.registro.inventarioInicial : 0) +
        (this.registro.cantidadEntrada ? this.registro.cantidadEntrada : 0) -
        (this.registro.cantidadSalida ? this.registro.cantidadSalida : 0);
      this.registro.inventarioFinal = inv_final;
    }
  }

  setInventarioInicial(valor) {
    if (valor === '') {
      valor = 0;
    }
    this.registro.inventarioInicial = parseInt(valor);
    this.realizarCalculoInventarioFinal();
  }

  setCantidadEntrada(valor) {
    if (valor === '') {
      valor = 0;
    }
    this.registro.cantidadEntrada = parseInt(valor);
    this.realizarCalculoInventarioFinal();
  }

  setCantidadSalida(valor) {
    if (valor === '') {
      valor = 0;
    }
    this.registro.cantidadSalida = parseInt(valor);
    this.realizarCalculoInventarioFinal();
  }

  changeTipoMezcla(event: any) {
    if (event.claseInsumo ) {
      if (event.claseInsumo.descripcion === 'MEZCLAS') {
        this.hiddenTipoMezcla = false;
      } else {
        this.form.controls['tipoMezcla'].setValue(null);
        this.registro.tipoMezcla = null;
        this.hiddenTipoMezcla = true;
      }
    }
  }

}
