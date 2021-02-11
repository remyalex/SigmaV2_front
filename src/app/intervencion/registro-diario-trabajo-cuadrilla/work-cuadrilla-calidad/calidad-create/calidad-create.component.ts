import { Component, OnInit, DoCheck } from '@angular/core';
import { CONST_REGISTRO_DIARIO_CUADRILLA } from '../../registro-diario-trabajo-cuadrilla.constant';
import { CONST_REGISTRO_DIARIO_CUADRILLA_ESTADO_PETICION } from '../../registro-diario-trabajo-cuadrilla.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { CuadrillaGeneralService } from '../../services/cuadrilla-general.service';
import { CuadrillaArchivoModel } from '../../models/cuadrilla-archivo.model';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import { CommonService } from '../../../../shared/services/common.service';
import { CuadrillaCalidadModel } from '../../models/cuadrilla-calidad.model';
import { SigmaConfirmComponent } from '../../../../shared/sigma-confirm/sigma-confirm.component';

@Component({
  selector: 'app-calidad-create',
  templateUrl: './calidad-create.component.html'
})
export class CalidadCreateComponent implements OnInit, DoCheck {

 /** Constantes a usar en el componente */
  constants = CONST_REGISTRO_DIARIO_CUADRILLA;
  constantsEstadoPeticion = CONST_REGISTRO_DIARIO_CUADRILLA_ESTADO_PETICION;
  CuadrillaCalidadModel: CuadrillaCalidadModel;
  cuadrillaArchivoModel: CuadrillaArchivoModel;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  loader = false;
  numeroMuestrasValid = false;
  disabledSave = true;
  enviando = false;

  // tslint:disable-next-line: max-line-length

  /**
  * Método encargado de construir una instancia
  */
  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<CalidadCreateComponent>, private serviceCuadrillaGeneral: CuadrillaGeneralService, private utilitiesServices: UtilitiesService, private commonService: CommonService, private dialog: MatDialog) {
    this.CuadrillaCalidadModel = new CuadrillaCalidadModel();
    this.form = this.formBuilder.group({
      tipoMaterial: [null],
      tipoEnsayo: [null],
      numeroMuestras: [null, Validators.compose([Validators.min(1), Validators.max(9)])],
      resultado: [null, Validators.compose([Validators.maxLength(100)])]
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

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.serviceCuadrillaGeneral.listenerActionCalidad(this.CuadrillaCalidadModel);
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.serviceCuadrillaGeneral.listenerActionCalidad(null);
    this.dialogRef.close(0);
  }

  setArchivoSolicitud(event: any) {
    if (event.id) {
      this.cuadrillaArchivoModel = new CuadrillaArchivoModel();
      this.cuadrillaArchivoModel.fechaRegistro = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(new Date());
      this.cuadrillaArchivoModel.archivo = event;
      this.commonService.getListaItemByNombreListaAndValorItem('UMV_CUADRILLA_TIPO_ARCHIVO', 'AVANCE OBRA').subscribe(listaItem => {
        this.cuadrillaArchivoModel.tipoArchivo = listaItem;
      });
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

  numeroMuestrasValidate(event) {
    this.numeroMuestrasValid = this.decimalLongValidate(0, event);
  }

  habilitarBotonGuardar() {
    if (this.CuadrillaCalidadModel !== undefined) {
      if (this.disabledSave) {
        if (this.CuadrillaCalidadModel.tipoMaterial !== undefined) {
          this.disabledSave = false;
        } else if (this.CuadrillaCalidadModel.tipoEnsayo !== undefined) {
          this.disabledSave = false;
        } else if (this.CuadrillaCalidadModel.numeroMuestras !== undefined && this.CuadrillaCalidadModel.numeroMuestras.toString() !== '') {
          this.disabledSave = false;
        } else if (this.CuadrillaCalidadModel.resultado !== undefined && this.CuadrillaCalidadModel.resultado !== '') {
          this.disabledSave = false;
        }
      } else {
        if (
          (this.CuadrillaCalidadModel.tipoMaterial === undefined)
          && (this.CuadrillaCalidadModel.tipoEnsayo === undefined)
          && (this.CuadrillaCalidadModel.numeroMuestras === undefined || this.CuadrillaCalidadModel.numeroMuestras.toString() === '')
          && (this.CuadrillaCalidadModel.resultado === undefined || this.CuadrillaCalidadModel.resultado === '')
        ) {
          this.disabledSave = true;
        }
      }
    }
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.markAndValidateAllInputs(this.form);
    if (this.form.valid === true && !this.numeroMuestrasValid) {
      this.save();
    } else {
      this.disabledSave = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  decimalLongValidate(max: number, data: any) {
    let response = false;
    if (data !== undefined && data !== null && data !== '') {
      const dataS = data.toString();
      const long = dataS.split('.');
      if (long.length > 1) {
        if (long[1].length > max) {
          response = true;
        }
      }
    }
    return response;
  }

  patternString(attr, data) {
    const re = /[a-zA-z`~!@#$%^&*()_°¬|+\-=?¡¿;:.'",<>\{\}\[\]\\\/]/gi;
    const newstr = data.target.value.replace(re, '');
    this.CuadrillaCalidadModel[attr] = newstr.trim();
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
