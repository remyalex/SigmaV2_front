import { Component, OnInit } from '@angular/core';
import { CONST_REGISTRO_DIARIO_CUADRILLA } from '../../registro-diario-trabajo-cuadrilla.constant';
import { CONST_REGISTRO_DIARIO_CUADRILLA_ESTADO_PETICION } from '../../registro-diario-trabajo-cuadrilla.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { CuadrillaGeneralService } from '../../services/cuadrilla-general.service';
import { CuadrillaArchivoModel } from '../../models/cuadrilla-archivo.model';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import { CommonService } from '../../../../shared/services/common.service';
import { CuadrillaRetiroModel } from '../../models/cuadrilla-retiro.model';
import { SigmaConfirmComponent } from '../../../../shared/sigma-confirm/sigma-confirm.component';
import { CuadrillaRetiroArchivoModel } from '../../models/cuadrilla-retiro-archivo.model';

@Component({
  selector: 'app-retiro-create',
  templateUrl: './retiro-create.component.html'
})
export class RetiroCreateComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_REGISTRO_DIARIO_CUADRILLA;
  constantsEstadoPeticion = CONST_REGISTRO_DIARIO_CUADRILLA_ESTADO_PETICION;
  CuadrillaRetiroModel: CuadrillaRetiroModel;
  cuadrillaArchivoModel: CuadrillaArchivoModel;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  loader = false;
  placa: any;
  archivosMaterial: any = [];
  volumenValid = false;
  enviando = false;
  archivosSeccion = [];

  //  Variables para cargar en tiempo de ejecución la clase de material (Dependiendo de tipo de material)
  visibilityClaseMaterial = true;
  pathClaseMaterial = '';

  /**
  * Método encargado de construir una instancia
  */
  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<RetiroCreateComponent>, private serviceCuadrillaGeneral: CuadrillaGeneralService, private utilitiesServices: UtilitiesService, private commonService: CommonService, private dialog: MatDialog) {
    this.CuadrillaRetiroModel = new CuadrillaRetiroModel();
    this.form = this.formBuilder.group({
      tipoMaterial: [null],
      claseMaterial: [null],
      volumen: [null],
      destino: [null],
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
    this.CuadrillaRetiroModel.retiroArchivos = [];
  }

  changeTipoMaterial( event: any) {
    this.visibilityClaseMaterial = false;
    this.CuadrillaRetiroModel.claseMaterial = undefined;
    const _this = this;
    setTimeout(this.changingTipoMaterial, 50, _this);
  }

  changingTipoMaterial(_this) {
    _this.visibilityClaseMaterial = true;
    if (_this.CuadrillaRetiroModel.tipoMaterial !== undefined)  {
      _this.pathClaseMaterial = _this.constants
      .path_lista_items_clase_material.replace(
        '{tipomaterialId}',
        _this.CuadrillaRetiroModel.tipoMaterial.id + ''
      );
    }
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.serviceCuadrillaGeneral.listenerActionRetiro(this.CuadrillaRetiroModel);
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.serviceCuadrillaGeneral.listenerActionRetiro(null);
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

  volumenValidate(event) {
    this.volumenValid = this.volumenValidateField(event);
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.markAndValidateAllInputs(this.form);
    if (this.form.valid === true && !this.volumenValid) {
      this.save();
    } else {
      this.enviada = false;
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
      this.archivosSeccion = [];
      this.CuadrillaRetiroModel.retiroArchivos = [];
    }
  }

  runFiles(event: any) {
    for (const archivo of event) {
      if (archivo.id) {
        let existe = false;
        for (const solicitudArchivo of this.CuadrillaRetiroModel.retiroArchivos) {
          if (archivo.id === solicitudArchivo.archivo.id) {
            existe = true;
          }
        }
        if (!existe && archivo.id) {
          const seccionArchivo = new CuadrillaRetiroArchivoModel();
          seccionArchivo.fecha = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(new Date());
          seccionArchivo.archivo = archivo;
          this.CuadrillaRetiroModel.retiroArchivos.push(seccionArchivo);
        }
      }
    }
  }

  patternString(attr, data) {
    const re = /[a-zA-z`~!@#$%^&*()_°¬|+\-=?¡¿;:'",<>\{\}\[\]\\\/]/gi;
    const newstr = data.target.value.replace(re, '');
    this.CuadrillaRetiroModel[attr] = newstr.trim();
  }

  volumenValidateField(data) {
    let error = false;
    if (this.numericLong3Validate(data)) {
      if (!this.decimalLongValidate(2, data)) {
        error = true;
      }
    } else {
      error = true;
    }
    return error;
  }

  numericLong3Validate(data) {
    let response = true;

    if (parseInt(data) > 999) {
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

  snackBarError(msj: string) {
    this.snackBar.open(
      msj, 'X', {
      duration: 6000,
      panelClass: ['error-snackbar']
    }
    );
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
