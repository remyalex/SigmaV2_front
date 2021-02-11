import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CONST_REGISTRO_DIARIO_CUADRILLA } from '../registro-diario-trabajo-cuadrilla.constant';
import { WorkflowMantenimientoModel } from '../../../workflow/models/workflow-mantenimiento.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { CuadrillaGeneralService } from '../services/cuadrilla-general.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { CuadrillaAvanceModel } from '../models/cuadrilla-avance.model';
import { CuadrillaArchivoModel } from '../models/cuadrilla-archivo.model';
import { CuadrillaGeneralModel } from '../models/cuadrilla-general.model';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'sigma-work-cuadrilla-aprobacion',
  templateUrl: './work-cuadrilla-aprobacion.component.html'
})
export class WorkCuadrillaAprobacionComponent implements OnInit {

  @Input() sixteenthFormGroup: FormGroup;
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
  cuadrillaAvanceArchivos: any = [];
  checkedAprobacion: string = null;
  aprobadoCuadrillaTrabajo: string[] = ['Si', 'No'];

  // tslint:disable-next-line: max-line-length

  /**
  * Método encargado de construir una instancia
  */
  constructor(private _formBuilder: FormBuilder, private snackBar: MatSnackBar, private serviceCudrillaGeneral: CuadrillaGeneralService, private utilitiesServices: UtilitiesService, private commonService: CommonService) {
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.loadData();
  }

  loadData() {

    if (!this.cuadrillaGeneral) {
      this.cuadrillaGeneral = new CuadrillaGeneralModel();
    }

    if (this.cuadrillaGeneral) {
      if (this.cuadrillaGeneral.aperturaCuadrilla === '1') {
        this.checkedAprobacion = 'Si';
      } else if(this.cuadrillaGeneral.aperturaCuadrilla === '0') {
        this.checkedAprobacion = 'No';
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

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    this.markAndValidateAllInputs(this.sixteenthFormGroup);
    this.disableSubmit = true;
    if (this.sixteenthFormGroup.valid === true) {
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

  showMessageSnackBar(message: string) {
    this.snackBar.open(
      message, 'X', {
      duration: 5000,
      panelClass: ['error-snackbar']
    }
    );
  }

  answer(event) {
    if (event === 'Si') {
      this.checkedAprobacion = 'Si';
      this.cuadrillaGeneral.aperturaCuadrilla = '1';
    } else if (event === 'No') {
      this.checkedAprobacion = 'No';
      this.cuadrillaGeneral.aperturaCuadrilla = '0';
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

}
