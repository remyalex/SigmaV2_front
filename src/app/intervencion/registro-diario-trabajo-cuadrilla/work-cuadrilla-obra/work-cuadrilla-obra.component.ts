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
import { ProfileService } from '../../../seguridad/services/profile.service';
import { WorkflowMantenimientoActividadModel } from '../../../workflow/models/workflow-mantenimiento-actividad.model';
import { WorkflowService } from '../../../workflow/services/workflow-service.service';
import { ListaItem } from '../../../administracion/listas-items/models/listas-items.model';

@Component({
  selector: 'sigma-work-cuadrilla-obra',
  templateUrl: './work-cuadrilla-obra.component.html'
})
export class WorkCuadrillaObraComponent implements OnInit {

  @Input() secondFormGroup: FormGroup;
  @Input() mantenimiento: WorkflowMantenimientoModel;
  @Input() cuadrillaGeneral: CuadrillaGeneralModel;
  @Input() componentVisible: boolean;
  @Input() acumuladoPorcentaje: any;
  @Output() saveSeccionCuadrilla = new EventEmitter();

  cuadrillaAvanceModel: CuadrillaAvanceModel;
  cuadrillaArchivoModel: CuadrillaArchivoModel;
  estadoAvance: ListaItem;
  porcentajeAcumulado: any;
  porcentajeDiario: any;
  /** Constantes a usar en el componente */
  constants = CONST_REGISTRO_DIARIO_CUADRILLA;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  loader = false;
  noInfoToShow = false;
  porcentajeError = false;
  porcentajeDiarioEdit = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  cuadrillaAvanceArchivos: any = [];

  // tslint:disable-next-line: max-line-length

  /**
  * Método encargado de construir una instancia
  */
  // tslint:disable-next-line: max-line-length
  constructor(private _formBuilder: FormBuilder, private snackBar: MatSnackBar, private serviceCudrillaGeneral: CuadrillaGeneralService, private utilitiesServices: UtilitiesService, private commonService: CommonService, private profileService: ProfileService, private workflowService: WorkflowService) {
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.loadData();
  }

  loadData() {

    this.cuadrillaAvanceModel = new CuadrillaAvanceModel();
    this.porcentajeAcumulado = 0;

    if (!this.cuadrillaGeneral) {
      this.cuadrillaGeneral = new CuadrillaGeneralModel();
    }

    if (this.acumuladoPorcentaje && this.acumuladoPorcentaje.avance.length > 0) {
      this.porcentajeAcumulado = this.acumuladoPorcentaje.avance[0].porcentajeAcumulado;
      this.cuadrillaAvanceModel.porcentajeAcumulado = this.acumuladoPorcentaje.avance[0].porcentajeAcumulado;
    }

    if (this.cuadrillaGeneral.avance.length > 0) {
      this.cuadrillaAvanceModel = this.cuadrillaGeneral.avance[0];
      this.cuadrillaAvanceModel.estadoObra = this.mantenimiento.estadoObra;
      this.porcentajeAcumulado = this.cuadrillaAvanceModel.porcentajeAcumulado;
      if (this.cuadrillaAvanceModel.porcentajeDiario > 0) {
        this.porcentajeDiario = this.cuadrillaAvanceModel.porcentajeDiario;
        this.porcentajeDiarioEdit = true;
      }
    }

    if (!this.mantenimiento.estadoObra) {
      this.commonService.getListaItemByNombreListaAndValorItem('UMV_CUADRILLA_INT_ESTADO_OBRA', 'INICIO').subscribe(listaItem => {
        this.cuadrillaAvanceModel.estadoObra = listaItem;
      });
    } else if (this.mantenimiento.estadoObra.descripcion === 'INICIO') {
      this.commonService.getListaItemByNombreListaAndValorItem('UMV_CUADRILLA_INT_ESTADO_OBRA', 'INICIO').subscribe(listaItem => {
        this.cuadrillaAvanceModel.estadoObra = listaItem;
      });
    } else if (this.mantenimiento.estadoObra) {
      this.cuadrillaAvanceModel.estadoObra = this.mantenimiento.estadoObra;
    }

    if (!this.cuadrillaAvanceModel.estadoRegistroDiario) {
      // tslint:disable-next-line: max-line-length
      this.commonService.getListaItemByNombreListaAndValorItem('UMV_CUADRILLA_INT_REGISTRO_DIARIO_CUADRILLA', 'POR ELABORAR').subscribe(listaItem => {
        this.cuadrillaAvanceModel.estadoRegistroDiario = listaItem;
      });
    }

    this.extractArchivosBySolicitud();
    this.validation();
    this.AppAccess();

  }

  validation() {
    this.cuadrillaAvanceModel.fechaCreacionInforme = this.utilitiesServices.getFechaServerFormat_ddMMaaaa(new Date());
    this.cuadrillaAvanceModel.numeroInforme = '';

    if (this.mantenimiento.intervenciones[0].programacionesDiarias.length > 0) {
      // tslint:disable-next-line: max-line-length
      this.cuadrillaAvanceModel.numeroInforme = this.mantenimiento.intervenciones[0].programacionesDiarias[0].fechaCreacion + '-' + this.mantenimiento.intervenciones[0].programacionesDiarias[0].jornada.descripcion;
    }
  }

  AppAccess() {
    this.profileService.isGranted(this.constants.registro_diario_cuadrilla_obra).subscribe(data => {
      if (data.state) {
        this.secondFormGroup.get('avanceDiarioObra').enable();
        this.secondFormGroup.get('avanceAcumuladoObra').enable();
        if (this.componentVisible) {
          this.secondFormGroup.get('fotoTerminacionObra').enable();
        } else {
          this.secondFormGroup.get('fotoTerminacionObra').disable();
        }
      } else {
        this.secondFormGroup.get('avanceDiarioObra').disable();
        this.secondFormGroup.get('avanceAcumuladoObra').disable();
        this.secondFormGroup.get('fotoTerminacionObra').disable();
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    const mantenimientosActividad: WorkflowMantenimientoActividadModel[] = [];
    const mantenimientoActividad = new WorkflowMantenimientoActividadModel();
    this.mantenimiento.estadoObra = this.cuadrillaAvanceModel.estadoObra;
    mantenimientoActividad.mantenimiento = this.mantenimiento;
    mantenimientosActividad.push(mantenimientoActividad);

    this.workflowService.createList(mantenimientosActividad).subscribe((data: any) => {
      this.porcentajeDiario = this.cuadrillaAvanceModel.porcentajeDiario;
      this.porcentajeDiarioEdit = true;
      this.cuadrillaAvanceModel.porcentajeAcumulado = this.porcentajeAcumulado;
      this.cuadrillaAvanceModel.fechaCreacionInforme = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(new Date());
      // tslint:disable-next-line: max-line-length
      this.cuadrillaAvanceModel.jornada = this.mantenimiento.intervenciones[0].programacionesDiarias.length > 0 ? this.mantenimiento.intervenciones[0].programacionesDiarias[0].jornada : null;
      this.cuadrillaAvanceModel.id = this.cuadrillaGeneral.avance.length > 0 ? this.cuadrillaGeneral.avance[0].id : null;
      this.cuadrillaGeneral.avance[0] = this.cuadrillaAvanceModel;
      if (this.cuadrillaGeneral.id) {
        // tslint:disable-next-line: max-line-length
        this.saveSeccionCuadrilla.emit({ requestType: 'update', evento: 'loadData', owner: 'obra', nextStepper: true, cuadrillaGeneral: this.cuadrillaGeneral });
      } else {
        this.cuadrillaGeneral.mantenimiento = this.mantenimiento;
        this.cuadrillaGeneral.intervencionEncabezado = this.mantenimiento.intervenciones[0];
        // tslint:disable-next-line: max-line-length
        this.saveSeccionCuadrilla.emit({ requestType: 'create', evento: 'loadData', owner: 'obra', nextStepper: true, cuadrillaGeneral: this.cuadrillaGeneral });
      }
    });

  }

  extractArchivosBySolicitud() {
    if (this.cuadrillaGeneral.archivos.length > 0) {
      this.cuadrillaAvanceArchivos = [];
      for (const avance of this.cuadrillaGeneral.archivos) {
        if (avance.tipoArchivo.descripcion === 'AVANCE OBRA') {
          this.cuadrillaAvanceArchivos.push(avance.archivo);
        }
      }
    }
  }

  setArchivoSolicitud(event: any) {
    if (event.id) {
      this.cuadrillaArchivoModel = new CuadrillaArchivoModel();
      this.cuadrillaArchivoModel.fechaRegistro = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(new Date());
      this.cuadrillaArchivoModel.archivo = event;
      this.commonService.getListaItemByNombreListaAndValorItem('UMV_CUADRILLA_TIPO_ARCHIVO', 'AVANCE OBRA').subscribe(listaItem => {
        this.cuadrillaArchivoModel.tipoArchivo = listaItem;
      });
      this.cuadrillaGeneral.archivos.push(this.cuadrillaArchivoModel);
    }

    if (event === '') {
      this.cuadrillaGeneral.archivos = [];
    }
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.markAndValidateAllInputs(this.secondFormGroup);
    this.disableSubmit = true;
    if (this.secondFormGroup.valid === true && this.porcentajeError === false) {
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

  _getPorcentajeDiario() {
    let pAcumulado = 0;
    let pDiario = 0;
    let dailyPercentage = 0;
    // tslint:disable-next-line: max-line-length
    pAcumulado = (this.cuadrillaAvanceModel.porcentajeAcumulado) ? parseInt(this.cuadrillaAvanceModel.porcentajeAcumulado + '') : 0;
    pDiario = (this.cuadrillaAvanceModel.porcentajeDiario) ? parseInt(this.cuadrillaAvanceModel.porcentajeDiario + '') : 0;

    if (this.porcentajeDiarioEdit) {
      pAcumulado = pAcumulado - this.porcentajeDiario;
    }

    dailyPercentage = pDiario + pAcumulado;

    if (dailyPercentage > 100) {
      this.porcentajeError = true;
      this.showMessageSnackBar('El porcentaje no puede superar el 100%');
    } else {
      this.porcentajeError = false;
      // tslint:disable-next-line: max-line-length
      this.porcentajeAcumulado = dailyPercentage;
      this.cuadrillaAvanceModel.porcentajeDiario = pDiario;
      if (dailyPercentage === 100) {
        this.estadoAvance = new ListaItem();
        this.estadoAvance.id = 747399;
        this.estadoAvance.valor = 'TERMINADO';
        this.estadoAvance.descripcion = 'TERMINADO';
        this.estadoAvance.activo = true;
        this.cuadrillaAvanceModel.estadoObra = this.estadoAvance;
      } else if (dailyPercentage > 0 && pAcumulado < dailyPercentage) {
        this.estadoAvance = new ListaItem();
        this.estadoAvance.id = 747398;
        this.estadoAvance.valor = 'EN EJECUCION';
        this.estadoAvance.descripcion = 'EN EJECUCION';
        this.estadoAvance.activo = true;
        this.cuadrillaAvanceModel.estadoObra = this.estadoAvance;
      }
      if (pDiario === 0) {
        this.estadoAvance = new ListaItem();
        this.estadoAvance.id = 747404;
        this.estadoAvance.valor = 'APROBADO';
        this.estadoAvance.descripcion = 'APROBADO';
        this.estadoAvance.activo = true;
        this.cuadrillaAvanceModel.estadoRegistroDiario = this.estadoAvance;
      } else {
        this.estadoAvance = new ListaItem();
        this.estadoAvance.id = 747401;
        this.estadoAvance.valor = 'POR ELABORAR';
        this.estadoAvance.descripcion = 'POR ELABORAR';
        this.estadoAvance.activo = true;
        this.cuadrillaAvanceModel.estadoRegistroDiario = this.estadoAvance;
      }
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

  patternString(attr, data) {
    const re = /[a-zA-z`~!@#$%^&*()_°¬|+\-=?¡¿;:'",.<>\{\}\[\]\\\/]/gi;
    const newstr = data.target.value.replace(re, '');
    this.cuadrillaAvanceModel[attr] = newstr.trim();
    this._getPorcentajeDiario();
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
