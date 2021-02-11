import { Component, OnInit, Inject, DoCheck } from '@angular/core';
import { CONST_REGISTRO_DIARIO_CUADRILLA } from '../../registro-diario-trabajo-cuadrilla.constant';
import { CONST_REGISTRO_DIARIO_CUADRILLA_ESTADO_PETICION } from '../../registro-diario-trabajo-cuadrilla.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material';
import { CuadrillaGeneralService } from '../../services/cuadrilla-general.service';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import { CommonService } from '../../../../shared/services/common.service';
import { CuadrillaPetreosModel } from '../../models/cuadrilla-petreos-rap.model';
import { WorkflowMantenimientoModel } from '../../../../workflow/models/workflow-mantenimiento.model';
import { SigmaConfirmComponent } from '../../../../shared/sigma-confirm/sigma-confirm.component';
import { CuadrillaPetreosArchivoModel } from '../../models/cuadrilla-petreos-rap-archivos.model';

@Component({
  selector: 'app-material-create',
  templateUrl: './petreos-rap-create.component.html'
})
export class PetreosRapCreateComponent implements OnInit, DoCheck {

 /** Constantes a usar en el componente */
  constants = CONST_REGISTRO_DIARIO_CUADRILLA;
  constantsEstadoPeticion = CONST_REGISTRO_DIARIO_CUADRILLA_ESTADO_PETICION;
  mantenimiento: WorkflowMantenimientoModel;
  volumenesPorMaterial: any[];
  CuadrillaPetreosModel: CuadrillaPetreosModel;
  archivoPetreosModel: CuadrillaPetreosArchivoModel[];
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  loader = false;
  disabledSave = true;
  enviando = false;

  // tslint:disable-next-line: max-line-length
  constructor(@Inject(MAT_DIALOG_DATA) data: any, private formBuilder: FormBuilder, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<PetreosRapCreateComponent>, private serviceCuadrillaGeneral: CuadrillaGeneralService, private utilitiesServices: UtilitiesService, private commonService: CommonService, private dialog: MatDialog) {
    this.mantenimiento = data.mantenimiento;
    this.volumenesPorMaterial = data.volumenesPorMaterial;
    this.CuadrillaPetreosModel = new CuadrillaPetreosModel();
    this.CuadrillaPetreosModel.archivosPetreos = [];
    this.form = this.formBuilder.group({
      claseMaterial: [null],
      origenMezcla: [{ value: null, disabled: true }],
      valeEntrada: [null, Validators.compose([Validators.maxLength(8)])],
      valeSalida: [null, Validators.compose([Validators.maxLength(8)])],
      placa: [null, Validators.compose([Validators.maxLength(10)])],
      horaEntrada: [null],
      // tslint:disable-next-line: max-line-length
      volumenEntrada: [null, Validators.compose([Validators.min(0),
      Validators.max(99999.99), Validators.pattern('^[+-]?[0-9]{1,5}(?:.[0-9]{1,2})?$')])],
      volumenSalida: [null, Validators.compose([Validators.min(0),
      Validators.max(99999.99), Validators.pattern('^[+-]?[0-9]{1,5}(?:.[0-9]{1,2})?$')])],
      volumenUtilizado: [null],
      volumenAcopio: [null],
      // tslint:disable-next-line: max-line-length
      destino: [null, Validators.compose([Validators.maxLength(10)])],
      archivo: [null]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.serviceCuadrillaGeneral.listenerSendStatus(this.constantsEstadoPeticion.iniciando);

    this.serviceCuadrillaGeneral.sendStatus$.subscribe((status) => {
      if (status && status === this.constantsEstadoPeticion.enviando) {
        this.enviando = true;
      } else {
        this.enviando = false;
      }

      if (status && status === this.constantsEstadoPeticion.ok) {
        this.close();
      }
    });
  }

  /** Método encargado de notificar los cambios del componente check hacia el modelo */
  ngDoCheck(): void {
    this.habilitarBotonGuardar();
  }

  validation() {
    if (this.mantenimiento.intervenciones[0].programacionesDiarias.length > 0) {
      // this.CuadrillaPetreosModel.origenMezcla = this.mantenimiento.intervenciones[0].programacionesDiarias[0].material[0].origenMezcla;

      // tslint:disable-next-line: triple-equals
      if (this.mantenimiento.intervenciones[0].solicitudMezclaInsumos.RegistrarVale.numeroVale > 0) {
      }
    }
  }

  habilitarBotonGuardar() {
    if (this.CuadrillaPetreosModel !== undefined) {
      if (this.disabledSave) {
        if (this.CuadrillaPetreosModel.claseMaterial !== undefined) {
          this.disabledSave = false;
        } else if (this.CuadrillaPetreosModel.origenMezcla !== undefined) {
          this.disabledSave = false;
        } else if (this.CuadrillaPetreosModel.valeEntrada !== undefined && this.CuadrillaPetreosModel.valeEntrada.toString() !== '') {
          this.disabledSave = false;
        } else if (this.CuadrillaPetreosModel.valeSalida !== undefined && this.CuadrillaPetreosModel.valeSalida.toString() !== '') {
          this.disabledSave = false;
        } else if (this.CuadrillaPetreosModel.placa !== undefined && this.CuadrillaPetreosModel.placa !== '') {
          this.disabledSave = false;
        } else if (this.CuadrillaPetreosModel.horaEntrada !== undefined
          && this.CuadrillaPetreosModel.horaEntrada !== null
          && this.CuadrillaPetreosModel.horaEntrada !== '') {
          this.disabledSave = false;
        } else if (this.CuadrillaPetreosModel.volumenEntrada !== undefined && this.CuadrillaPetreosModel.volumenEntrada.toString() !== '') {
          this.disabledSave = false;
        } else if (this.CuadrillaPetreosModel.volumenSalida !== undefined && this.CuadrillaPetreosModel.volumenSalida.toString() !== '') {
          this.disabledSave = false;
        } else if (this.CuadrillaPetreosModel.destino !== undefined && this.CuadrillaPetreosModel.destino !== '') {
          this.disabledSave = false;
        } else if (this.CuadrillaPetreosModel.archivosPetreos !== undefined && this.CuadrillaPetreosModel.archivosPetreos.length > 0) {
          this.disabledSave = false;
        }
      } else {
        if (
          (this.CuadrillaPetreosModel.claseMaterial === undefined)
          && (this.CuadrillaPetreosModel.origenMezcla === undefined)
          && (this.CuadrillaPetreosModel.valeEntrada === undefined || this.CuadrillaPetreosModel.valeEntrada.toString() === '')
          && (this.CuadrillaPetreosModel.valeSalida === undefined || this.CuadrillaPetreosModel.valeSalida.toString() === '')
          && (this.CuadrillaPetreosModel.placa === undefined || this.CuadrillaPetreosModel.placa === '')
          // tslint:disable-next-line: max-line-length
          && (this.CuadrillaPetreosModel.horaEntrada === undefined || this.CuadrillaPetreosModel.horaEntrada === null || this.CuadrillaPetreosModel.horaEntrada === '')
          // tslint:disable-next-line: max-line-length
          && (this.CuadrillaPetreosModel.volumenEntrada === undefined || this.CuadrillaPetreosModel.volumenEntrada.toString() === '')
          // tslint:disable-next-line: max-line-length
          && (this.CuadrillaPetreosModel.volumenSalida === undefined || this.CuadrillaPetreosModel.volumenSalida.toString() === '')
          && (this.CuadrillaPetreosModel.destino === undefined || this.CuadrillaPetreosModel.destino === '')
          && (this.CuadrillaPetreosModel.archivosPetreos === undefined || this.CuadrillaPetreosModel.archivosPetreos.length === 0)
        ) {
          this.disabledSave = true;
        }
      }
    }
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.serviceCuadrillaGeneral.listenerActionPetreos(this.CuadrillaPetreosModel);
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.serviceCuadrillaGeneral.listenerActionPetreos(null);
    this.dialogRef.close(0);
  }

  setArchivoSolicitud(event: any) {
    if (event && event.length > 0) {
        for (const archivo of event) {
          let existe = false;
          for (const solicitudArchivo of this.CuadrillaPetreosModel.archivosPetreos) {
            if (archivo.id === solicitudArchivo.archivo.id) {
              existe = true;
            }
          }
          if (!existe && archivo.id) {
            const cuadrillaPetreosArchivoModel = new CuadrillaPetreosArchivoModel();
            cuadrillaPetreosArchivoModel.archivo = archivo;
            this.CuadrillaPetreosModel.archivosPetreos.push(cuadrillaPetreosArchivoModel);
          }
        }
    }
    if (event === '') {
      this.CuadrillaPetreosModel.archivosPetreos = [];
    }
  }

  onBack() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.close();
      }
    });
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.markAndValidateAllInputs(this.form);
    if (this.form.valid === true) {
      let sendForm = true;

      if (this.volumenEntradaValid(this.CuadrillaPetreosModel.volumenEntrada)) {
        this.snackBarError('El campo "volumen entrada" debe tener una longitud máxima de 5.2');
        sendForm = false;
      }

      if (this.volumenSalidaValid(this.CuadrillaPetreosModel.volumenSalida)) {
        this.snackBarError('El campo "volumen salida" debe tener una longitud máxima de 5.2');
        sendForm = false;
      }

      if (this.volumenUtilizadoValid(this.CuadrillaPetreosModel.volumenUtilizado)) {
        this.snackBarError('El campo "volumen utilizado" debe tener una longitud máxima de 14.2');
        sendForm = false;
      }

      if (this.volumenAcopioValid(this.CuadrillaPetreosModel.volumenAcopio)) {
        this.snackBarError('El campo "volumen acopio" debe tener una longitud máxima de 14.2');
        sendForm = false;
      }

      if (sendForm) {
        this.save();
      }
    } else {
      this.disabledSave = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  snackBarError(msj: string) {
    this.snackBar.open(
      msj, 'X', {
      duration: 6000,
      panelClass: ['error-snackbar']
    }
    );
  }

  patternString(attr, data) {
    const re = /[a-zA-z`~!@#$%^&*()_°¬|+\-=?¡¿;:'",<>\{\}\[\]\\\/]/gi;
    const newstr = data.target.value.replace(re, '');
    this.CuadrillaPetreosModel[attr] = newstr.trim();
    if (attr === 'volumenEntrada' || attr === 'volumenSalida') {
      this.calcularVolumenAcopio();
    }
  }

  calcularVolumenAcopio() {
    if (this.CuadrillaPetreosModel.claseMaterial === null) {
      this.CuadrillaPetreosModel.claseMaterial = undefined;
    }

    let index = -1;
    if (this.CuadrillaPetreosModel.claseMaterial) {
      // tslint:disable-next-line: max-line-length
      index = this.volumenesPorMaterial.findIndex(vol => vol.claseMaterial !== undefined && vol.claseMaterial.id === this.CuadrillaPetreosModel.claseMaterial.id);
    } else {
      index = this.volumenesPorMaterial.findIndex(vol => vol.claseMaterial === undefined);
    }

    let sumatoriaAculadaEntrada = 0.00;
    let sumatoriaAcumuladaSalida = 0.00;
    let sumatoriaAcumuladaVolUtilizado = 0.00;

    if (index > -1) {
      // tslint:disable-next-line: max-line-length
      sumatoriaAculadaEntrada = (this.obtenerValorFloat(this.volumenesPorMaterial[index].sumaVolumenEntrada) + this.obtenerValorFloat(this.CuadrillaPetreosModel.volumenEntrada));
      // tslint:disable-next-line: max-line-length
      sumatoriaAcumuladaSalida = (this.obtenerValorFloat(this.volumenesPorMaterial[index].sumaVolumenSalida) + this.obtenerValorFloat(this.CuadrillaPetreosModel.volumenSalida));
      // tslint:disable-next-line: max-line-length
      sumatoriaAcumuladaVolUtilizado = this.obtenerValorFloat(this.volumenesPorMaterial[index].sumaVolumenUtilizado);
    } else {
      // tslint:disable-next-line: max-line-length
      sumatoriaAculadaEntrada = this.obtenerValorFloat(this.CuadrillaPetreosModel.volumenEntrada);
      // tslint:disable-next-line: max-line-length
      sumatoriaAcumuladaSalida = this.obtenerValorFloat(this.CuadrillaPetreosModel.volumenSalida);
    }

    this.CuadrillaPetreosModel.volumenAcopio = (sumatoriaAculadaEntrada - sumatoriaAcumuladaSalida) - sumatoriaAcumuladaVolUtilizado;
  }

  obtenerValorFloat(valor: any): number {
    let result = 0.00;
    if (valor === null) {
      valor = undefined;
    }

    if (valor) {
      result = isNaN(parseFloat(valor)) ? 0.00 : parseFloat(valor);
    }
    return result;
  }

  volumenEntradaValid(data) {
    let error = false;
    if (this.numericLongValidate(data)) {
      if (!this.decimalLongValidate(2, data)) {
        error = true;
      }
    } else {
      error = true;
    }
    return error;
  }

  volumenSalidaValid(data) {
    let error = false;
    if (this.numericLongValidate(data)) {
      if (!this.decimalLongValidate(2, data)) {
        error = true;
      }
    } else {
      error = true;
    }
    return error;
  }

  volumenUtilizadoValid(data) {
    let error = false;
    if (this.numericLong14Validate(data)) {
      if (!this.decimalLongValidate(2, data)) {
        error = true;
      }
    } else {
      error = true;
    }
    return error;
  }

  volumenAcopioValid(data) {
    let error = false;
    if (this.numericLong14Validate(data)) {
      if (!this.decimalLongValidate(2, data)) {
        error = true;
      }
    } else {
      error = true;
    }
    return error;
  }

  numericLongValidate(data) {
    let response = true;

    if (parseInt(data) > 99999) {
      response = false;
    }

    return response;
  }

  numericLong14Validate(data) {
    let response = true;

    if (parseInt(data) > 99999999999999) {
      response = false;
    }

    return response;
  }

  decimalLongValidate(max: number, data: any) {
    let response = true;
    if (data !== undefined && data !== null && data !== '') {
      const dataS = data.toString();
      const long = dataS.split('.');
      if (long.length > 1) {
        if (long[1].length > max) {
          response = false;
        }
      }
    }
    return response;
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

}
