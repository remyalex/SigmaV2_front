import { Component, OnInit, Inject, DoCheck } from '@angular/core';
import { CONST_REGISTRO_DIARIO_CUADRILLA } from '../../registro-diario-trabajo-cuadrilla.constant';
import { CONST_REGISTRO_DIARIO_CUADRILLA_ESTADO_PETICION } from '../../registro-diario-trabajo-cuadrilla.constant';
import { CuadrillaMaterialModel } from '../../models/cuadrilla-material.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material';
import { CuadrillaGeneralService } from '../../services/cuadrilla-general.service';
import { CuadrillaArchivoModel } from '../../models/cuadrilla-archivo.model';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import { CommonService } from '../../../../shared/services/common.service';
import { WorkflowMantenimientoModel } from '../../../../workflow/models/workflow-mantenimiento.model';
import { SigmaConfirmComponent } from '../../../../shared/sigma-confirm/sigma-confirm.component';
import { CuadrillaMaterialArchivoModel } from '../../models/cuadrilla-material-archivo.model';

@Component({
  selector: 'app-material-create',
  templateUrl: './material-create.component.html'
})
export class MaterialCreateComponent implements OnInit, DoCheck {

  /** Constantes a usar en el componente */
  constants = CONST_REGISTRO_DIARIO_CUADRILLA;
  constantsEstadoPeticion = CONST_REGISTRO_DIARIO_CUADRILLA_ESTADO_PETICION;
  mantenimiento: WorkflowMantenimientoModel;
  cuadrillaMaterialModel: CuadrillaMaterialModel;
  cuadrillaArchivoModel: CuadrillaArchivoModel;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  loader = false;
  temperaturaReciboError = false;
  placa: any;
  archivosMaterial: any = [];
  disabledSave = true;
  enviando = false;

  // tslint:disable-next-line: max-line-length
  constructor(@Inject(MAT_DIALOG_DATA) data: any, private formBuilder: FormBuilder, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<MaterialCreateComponent>, private serviceCuadrillaGeneral: CuadrillaGeneralService, private utilitiesServices: UtilitiesService, private commonService: CommonService, private dialog: MatDialog) {
    this.mantenimiento = data.mantenimiento;
    this.cuadrillaMaterialModel = new CuadrillaMaterialModel();
    this.form = this.formBuilder.group({
      claseMaterial: [null],
      origenMezcla: [{ value: null, disabled: true }],
      noVale: [null],
      placa: [null, Validators.compose([Validators.maxLength(10)])],
      // tslint:disable-next-line: max-line-length
      cantidad: [null],
      horaEntrada: [null],
      // tslint:disable-next-line: max-line-length
      horaInstalacion: [null],
      // tslint:disable-next-line: max-line-length
      temperaturaRecibo: [null, Validators.compose([Validators.min(100), Validators.max(200)])],
      // tslint:disable-next-line: max-line-length
      temperaturaLlegada: [null, Validators.compose([Validators.min(100), Validators.max(200)])],
      // tslint:disable-next-line: max-line-length
      temperaturaExtendido: [null, Validators.compose([Validators.min(100), Validators.max(200)])],
      // tslint:disable-next-line: max-line-length
      temperaturaCompactacion: [null, Validators.compose([Validators.min(100), Validators.max(200)])],
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

    this.validation();
    this.cuadrillaMaterialModel.materialArchivos = [];
  }

  /** Método encargado de notificar los cambios del componente check hacia el modelo */
  ngDoCheck(): void {
    this.habilitarBotonGuardar();
  }

  validation() {
    if (this.mantenimiento.intervenciones[0].programacionesDiarias.length > 0) {
      // this.cuadrillaMaterialModel.origenMezcla = this.mantenimiento.intervenciones[0].programacionesDiarias[0].material[0].origenMezcla;

      // tslint:disable-next-line: triple-equals
      if (this.cuadrillaMaterialModel.origenMezcla && this.cuadrillaMaterialModel.origenMezcla.descripcion == 'LA ESMERALDA') {
        if (this.mantenimiento.intervenciones[0].solicitudMezclaInsumos) {
          // tslint:disable-next-line: max-line-length
          this.cuadrillaMaterialModel.vale = this.mantenimiento.intervenciones[0].solicitudMezclaInsumos.RegistrarVale ? this.mantenimiento.intervenciones[0].solicitudMezclaInsumos.RegistrarVale.numeroVale : 0;
          // tslint:disable-next-line: radix
          // tslint:disable-next-line: max-line-length
          this.cuadrillaMaterialModel.cantidad = this.mantenimiento.intervenciones[0].solicitudMezclaInsumos.RegistrarVale ? parseInt(this.mantenimiento.intervenciones[0].solicitudMezclaInsumos.RegistrarVale.cantidad) : 0;
        }
      }
    }
  }

  habilitarBotonGuardar() {
    if (this.cuadrillaMaterialModel !== undefined) {
      if (this.disabledSave) {
        if (this.cuadrillaMaterialModel.claseMaterial !== undefined) {
          this.disabledSave = false;
        } else if (this.cuadrillaMaterialModel.origenMezcla !== undefined) {
          this.disabledSave = false;
        } else if (this.cuadrillaMaterialModel.vale !== undefined && this.cuadrillaMaterialModel.vale.toString() !== '') {
          this.disabledSave = false;
        } else if (this.cuadrillaMaterialModel.placa !== undefined && this.cuadrillaMaterialModel.placa !== '') {
          this.disabledSave = false;
        } else if (this.cuadrillaMaterialModel.cantidad !== undefined && this.cuadrillaMaterialModel.cantidad.toString() !== '') {
          this.disabledSave = false;
        } else if (this.cuadrillaMaterialModel.horaEntrada !== undefined
          && this.cuadrillaMaterialModel.horaEntrada !== null
          && this.cuadrillaMaterialModel.horaEntrada !== '') {
          this.disabledSave = false;
        } else if (this.cuadrillaMaterialModel.horaInstalacion !== undefined
          && this.cuadrillaMaterialModel.horaInstalacion !== null
          && this.cuadrillaMaterialModel.horaInstalacion !== '') {
          this.disabledSave = false;
        } else if (this.cuadrillaMaterialModel.temperaturaRecibo !== undefined
          && this.cuadrillaMaterialModel.temperaturaRecibo.toString() !== '') {
          this.disabledSave = false;
        } else if (this.cuadrillaMaterialModel.temperaturaLlegada !== undefined
          && this.cuadrillaMaterialModel.temperaturaLlegada.toString() !== '') {
          this.disabledSave = false;
        } else if (this.cuadrillaMaterialModel.temperaturaExtendido !== undefined
          && this.cuadrillaMaterialModel.temperaturaExtendido.toString() !== '') {
          this.disabledSave = false;
        } else if (this.cuadrillaMaterialModel.temperaturaCompactacion !== undefined
          && this.cuadrillaMaterialModel.temperaturaCompactacion.toString() !== '') {
          this.disabledSave = false;
        } else if (this.archivosMaterial !== undefined && this.archivosMaterial.length > 0) {
          this.disabledSave = false;
        }
      } else {
        if (
          (this.cuadrillaMaterialModel.claseMaterial === undefined)
          && (this.cuadrillaMaterialModel.origenMezcla === undefined)
          && (this.cuadrillaMaterialModel.vale === undefined || this.cuadrillaMaterialModel.vale.toString() === '')
          && (this.cuadrillaMaterialModel.placa === undefined || this.cuadrillaMaterialModel.placa === '')
          && (this.cuadrillaMaterialModel.cantidad === undefined || this.cuadrillaMaterialModel.cantidad.toString() === '')
          // tslint:disable-next-line: max-line-length
          && (this.cuadrillaMaterialModel.horaEntrada === undefined || this.cuadrillaMaterialModel.horaEntrada === null || this.cuadrillaMaterialModel.horaEntrada === '')
          // tslint:disable-next-line: max-line-length
          && (this.cuadrillaMaterialModel.horaInstalacion === undefined || this.cuadrillaMaterialModel.horaInstalacion === null || this.cuadrillaMaterialModel.horaInstalacion === '')
          // tslint:disable-next-line: max-line-length
          && (this.cuadrillaMaterialModel.temperaturaRecibo === undefined || this.cuadrillaMaterialModel.temperaturaRecibo.toString() === '')
          // tslint:disable-next-line: max-line-length
          && (this.cuadrillaMaterialModel.temperaturaLlegada === undefined || this.cuadrillaMaterialModel.temperaturaLlegada.toString() === '')
          // tslint:disable-next-line: max-line-length
          && (this.cuadrillaMaterialModel.temperaturaExtendido === undefined || this.cuadrillaMaterialModel.temperaturaExtendido.toString() === '')
          // tslint:disable-next-line: max-line-length
          && (this.cuadrillaMaterialModel.temperaturaCompactacion === undefined || this.cuadrillaMaterialModel.temperaturaCompactacion.toString() === '')
          && (this.archivosMaterial === undefined || this.archivosMaterial.length === 0)
        ) {
          this.disabledSave = true;
        }
      }
    }
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.serviceCuadrillaGeneral.listenerActionMaterial(this.cuadrillaMaterialModel);
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.serviceCuadrillaGeneral.listenerActionMaterial(null);
    this.dialogRef.close(0);
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

      if (this.cantidadValid(this.cuadrillaMaterialModel.cantidad)) {
        this.snackBarError('El campo "cantidad" debe tener una longitud máxima de 5.2');
        sendForm = false;
      }

      if (this.cuadrillaMaterialModel.horaEntrada > this.cuadrillaMaterialModel.horaInstalacion) {
        this.snackBarError('La hora instalación debe ser mayor a la hora entrada');
        sendForm = false;
      }

      if (this.temperaturaReciboValid(this.cuadrillaMaterialModel.temperaturaRecibo)) {
        this.snackBarError('El campo "temperatura recibo" debe tener una longitud máxima de 5.1');
        sendForm = false;
      }

      if (this.temperaturaLlegadaValid(this.cuadrillaMaterialModel.temperaturaLlegada)) {
        this.snackBarError('El campo "temperatura llegada" debe tener una longitud máxima de 5.1');
        sendForm = false;
      }

      if (this.temperaturaExtendidoValid(this.cuadrillaMaterialModel.temperaturaExtendido)) {
        this.snackBarError('El campo "temperatura extendido" debe tener una longitud máxima de 5.1');
        sendForm = false;
      }

      if (this.temperaturaCompactacionValid(this.cuadrillaMaterialModel.temperaturaCompactacion)) {
        this.snackBarError('El campo "temperatura compactación" debe tener una longitud máxima de 5.1');
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

  setArchivoSolicitud(event: any) {
    let eventObject;
    if (event && event.length > 0) {
      this.runFiles(event);
    } else if (event) {
      eventObject = '[' + JSON.stringify(event) + ']';
      eventObject = JSON.parse(eventObject);
      this.runFiles(eventObject);
    }

    if (event === '') {
      this.archivosMaterial = [];
      this.cuadrillaMaterialModel.materialArchivos = [];
    }
  }

  runFiles(event: any) {
    for (const archivo of event) {
      if (archivo.id) {
        let existe = false;
        for (const solicitudArchivo of this.cuadrillaMaterialModel.materialArchivos) {
          if (archivo.id === solicitudArchivo.archivo.id) {
            existe = true;
          }
        }
        if (!existe && archivo.id) {
          const materialArchivo = new CuadrillaMaterialArchivoModel();
          materialArchivo.fecha = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(new Date());
          materialArchivo.archivo = archivo;
          this.cuadrillaMaterialModel.materialArchivos.push(materialArchivo);
        }
      }
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
    this.cuadrillaMaterialModel[attr] = newstr.trim();
  }

  cantidadValid(data) {
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

  temperaturaReciboValid(data) {
    let error = false;
    if (this.numericLongValidate(data)) {
      if (!this.decimalLongValidate(1, data)) {
        error = true;
      }
    } else {
      error = true;
    }
    return error;
  }

  temperaturaLlegadaValid(data) {
    let error = false;
    if (this.numericLongValidate(data)) {
      if (!this.decimalLongValidate(1, data)) {
        error = true;
      }
    } else {
      error = true;
    }
    return error;
  }

  temperaturaExtendidoValid(data) {
    let error = false;
    if (this.numericLongValidate(data)) {
      if (!this.decimalLongValidate(1, data)) {
        error = true;
      }
    } else {
      error = true;
    }
    return error;
  }

  temperaturaCompactacionValid(data) {
    let error = false;
    if (this.numericLongValidate(data)) {
      if (!this.decimalLongValidate(1, data)) {
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
