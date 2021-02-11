import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { WorkflowMantenimientoModel } from '../../../workflow/models/workflow-mantenimiento.model';
import { CONST_REGISTRO_DIARIO_CUADRILLA } from '../registro-diario-trabajo-cuadrilla.constant';
import { MatSnackBar } from '@angular/material';
import { CuadrillaGeneralService } from '../services/cuadrilla-general.service';
import { CuadrillaGeneralModel } from '../models/cuadrilla-general.model';
import { UtilitiesService } from '../../../shared/services/utilities.service';



@Component({
  selector: 'sigma-work-cuadrilla-general',
  templateUrl: './work-cuadrilla-general.component.html'
})
export class WorkCuadrillaGeneralComponent implements OnInit {

  @Input() firstFormGroup: FormGroup;
  @Input() mantenimiento: WorkflowMantenimientoModel;
  @Input() cuadrillaGeneral: CuadrillaGeneralModel;
  @Input() componentVisible: boolean;
  @Output() saveSeccionCuadrilla = new EventEmitter();

 /** Constantes a usar en el componente */
  constants = CONST_REGISTRO_DIARIO_CUADRILLA;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  loader = false;
  noInfoToShow = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  tipoIntervencion: any;
  areIntervencionValid = false;

  // tslint:disable-next-line: max-line-length

  /**
  * Método encargado de construir una instancia
  */
  constructor(private _formBuilder: FormBuilder, private snackBar: MatSnackBar, private serviceCuadrillaGeneral: CuadrillaGeneralService, private utilitiesServices: UtilitiesService) {
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // tslint:disable-next-line: max-line-length
    this.tipoIntervencion = this.mantenimiento.diagnostico ? this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal ? this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal.descripcion : '' : '';
    if (!this.cuadrillaGeneral) {
      this.cuadrillaGeneral = new CuadrillaGeneralModel();
    }
    this.validation();
  }

  validation() {
    this.mantenimiento.ancho = null;
    this.mantenimiento.longitud = null;
    if (this.cuadrillaGeneral.avance.length > 0) {
      // tslint:disable-next-line: triple-equals tslint:disable-next-line: max-line-length
      if (this.cuadrillaGeneral.avance[0].estadoObra.descripcion == 'TERMINADO' && (this.mantenimiento.actividadAgrupada == 'PARCHEO' || this.mantenimiento.actividadAgrupada == 'PARCHEO Y SELLO DE FISURAS')) {
        this.mantenimiento.longitud = 0;
        // tslint:disable-next-line: max-line-length tslint:disable-next-line: triple-equals
      } else if (this.cuadrillaGeneral.avance[0].estadoObra.descripcion == 'TERMINADO' && this.mantenimiento.actividadAgrupada != 'PARCHEO') {
        this.firstFormGroup.get('areIntervencion').enable();
        this.firstFormGroup.controls['areIntervencion'].setValidators([Validators.required]);
        this.firstFormGroup.controls['areIntervencion'].updateValueAndValidity();
      }

      // tslint:disable-next-line: triple-equals tslint:disable-next-line: max-line-length
      if (this.cuadrillaGeneral.avance[0].estadoObra.descripcion == 'TERMINADO' && (this.mantenimiento.actividadAgrupada == 'SELLO DE FISURAS' || this.mantenimiento.actividadAgrupada == 'PARCHEO Y SELLO DE FISURAS')) {
        this.mantenimiento.ancho = 0;
      }
    }
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    if (this.cuadrillaGeneral.id) {
      this.saveSeccionCuadrilla.emit({ requestType: 'update', nextStepper: true, cuadrillaGeneral: this.cuadrillaGeneral });
    } else {
      this.cuadrillaGeneral.mantenimiento = this.mantenimiento;
      this.cuadrillaGeneral.intervencionEncabezado = this.mantenimiento.intervenciones[0];
      this.saveSeccionCuadrilla.emit({ requestType: 'create', nextStepper: true, cuadrillaGeneral: this.cuadrillaGeneral });
    }
  }

  areIntervencionValidate(event) {
    this.areIntervencionValid = this.areIntervencionValidateField(event);
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    this.markAndValidateAllInputs(this.firstFormGroup);
    this.disableSubmit = true;
    if (this.firstFormGroup.valid === true && !this.areIntervencionValid) {
      this.disableSubmit = true;
      this.save();
    } else {
      this.disableSubmit = false;
      this.enviada = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  areIntervencionValidateField(data) {
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

  patternString(attr, data) {
    const re = /[a-zA-z`~!@#$%^&*()_°¬|+\-=?¡¿;:'",<>\{\}\[\]\\\/]/gi;
    const newstr = data.target.value.replace(re, '');
    this.cuadrillaGeneral[attr] = newstr.trim();
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
