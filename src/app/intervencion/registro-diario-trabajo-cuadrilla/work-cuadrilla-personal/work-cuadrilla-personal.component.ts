import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CuadrillaGeneralModel } from '../models/cuadrilla-general.model';
import { WorkflowMantenimientoModel } from '../../../workflow/models/workflow-mantenimiento.model';
import { MatSnackBar, MatPaginator, MatSort, MatTableDataSource, MatDialogConfig, MatDialog } from '@angular/material';
import { CuadrillaGeneralService } from '../services/cuadrilla-general.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { CONST_REGISTRO_DIARIO_CUADRILLA } from '../registro-diario-trabajo-cuadrilla.constant';
import { CuadrillaPersonalModel } from '../models/cuadrilla-personal.model';
import { CuadrillaPersonalCriteria } from '../models/cuadrilla-personal-criteria.model';
import { PersonalCreateComponent } from './personal-create/personal-create.component';
import { PersonalEditComponent } from './personal-edit/personal-edit.component';
import { SigmaConfirmComponent } from '../../../shared/sigma-confirm/sigma-confirm.component';


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-work-cuadrilla-personal',
  templateUrl: './work-cuadrilla-personal.component.html'
})
export class WorkCuadrillaPersonalComponent implements OnInit {

  @Input() thirdFormGroup: FormGroup;
  @Input() mantenimiento: WorkflowMantenimientoModel;
  @Input() cuadrillaGeneral: CuadrillaGeneralModel;
  @Input() componentVisible: boolean;
  @Output() saveSeccionCuadrilla = new EventEmitter();
  @Output() nextToStepper = new EventEmitter();

  /** Constantes a usar en el componente */
  constants = CONST_REGISTRO_DIARIO_CUADRILLA;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new CuadrillaPersonalCriteria();
  cuadrillaPersonalModel: CuadrillaPersonalModel;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  dataCuadrillaPersonal: any;
  lengthList: Number;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  loader = false;
  noInfoToShow = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  duplicates = false;
  successInput = '';
  public petitionList = null;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'numeroIdentificacion',
    'nombreApellidos',
    'horarioLlegada',
    'horarioSalida',
    'porcentajeJornada',
    'acciones'
  ];

  /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;

  // tslint:disable-next-line: max-line-length

  /**
  * Método encargado de construir una instancia
  */
  constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private serviceCuadrillaGeneral: CuadrillaGeneralService,
    public utilitiesServices: UtilitiesService) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.loadData();
  }

  /**
   * Método encargado de gestionar la carga de los pks
   * de la grilla al iniciar el componente.
   */
  loadData(): void {

    this.cuadrillaPersonalModel = new CuadrillaPersonalModel();

    if (this.cuadrillaGeneral) {
      this.successInput = '1';
      this.dataCuadrillaPersonal = new MatTableDataSource(this.cuadrillaGeneral.personal);
      this.dataCuadrillaPersonal.sort = this.sort;
      this.dataCuadrillaPersonal.paginator = this.paginator;
      this.lengthList = this.dataCuadrillaPersonal.filteredData.length;
    }
  }

  add() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      mantenimiento: this.mantenimiento,
      cuadrillaGeneral: this.cuadrillaGeneral
    };

    const dialogRef = this.dialog.open(PersonalCreateComponent, dialogConfig);

    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }

    this.petitionList = this.serviceCuadrillaGeneral.serviceListenerPersonal$.subscribe((data: CuadrillaPersonalModel) => {
      if (data && Object.entries(data).length > 0 && data !== null) {
        this.save(data, -1);
      }
    });

    dialogRef.beforeClosed().subscribe();
  }

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(persona: CuadrillaPersonalModel, index: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      mantenimiento: this.mantenimiento,
      cuadrillaGeneral: this.cuadrillaGeneral,
      persona: this.cuadrillaGeneral.personal[index],
      index: index
    };

    const dialogRef = this.dialog.open(PersonalEditComponent, dialogConfig);

    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }

    this.petitionList = this.serviceCuadrillaGeneral.serviceListenerPersonal$.subscribe((data: CuadrillaPersonalModel) => {
      if (data && Object.entries(data).length > 0 && data !== null) {
        this.save(data, index);
      }
    });

    dialogRef.beforeClosed().subscribe();
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(persona: CuadrillaPersonalModel, index: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      mantenimiento: this.mantenimiento,
      persona: this.cuadrillaGeneral.personal[index],
    };

    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          this.cuadrillaGeneral.personal.splice(index, 1);
          this.loadData();
          this.save(null, -1);
        }
      }
    );
  }

  save(data, index: number) {
    if (index !== -1) {
      this.cuadrillaGeneral.personal[index] = data;
    } else if (data) {
      this.cuadrillaGeneral.personal.push(data);
    }

    if (this.cuadrillaGeneral.id) {
      // tslint:disable-next-line: max-line-length
      this.saveSeccionCuadrilla.emit({ requestType: 'update', evento: 'loadData', owner: 'personal', nextStepper: false, cuadrillaGeneral: this.cuadrillaGeneral });
    } else {
      this.cuadrillaGeneral.mantenimiento = this.mantenimiento;
      this.cuadrillaGeneral.intervencionEncabezado = this.mantenimiento.intervenciones[0];
      // tslint:disable-next-line: max-line-length
      this.saveSeccionCuadrilla.emit({ requestType: 'create', evento: 'loadData', owner: 'personal', nextStepper: false, cuadrillaGeneral: this.cuadrillaGeneral });
    }
  }

  duplicateRecord(): boolean {
    let response = false;
    let validate;
    let validateOther;

    // tslint:disable-next-line: max-line-length
    const jornada = this.mantenimiento.intervenciones[0].programacionesDiarias.length > 0 ? this.mantenimiento.intervenciones[0].programacionesDiarias[0].jornada.descripcion : '';
    // tslint:disable-next-line: max-line-length
    const fechaInforme = this.mantenimiento.intervenciones[0].programacionesDiarias.length > 0 ? this.mantenimiento.intervenciones[0].programacionesDiarias[0].fechaCreacion : '';

    // tslint:disable-next-line: forin
    for (const personal in this.cuadrillaGeneral.personal) {
      validate = '';
      validateOther = '';
      for (const persona in this.cuadrillaGeneral.personal) {
        // tslint:disable-next-line: max-line-length
        if (this.cuadrillaGeneral.personal[personal].id !== this.cuadrillaGeneral.personal[persona].id) {
          // tslint:disable-next-line: max-line-length
          validate = this.cuadrillaGeneral.mantenimiento.pk + '-' + fechaInforme + '-' + jornada + '-' + this.cuadrillaGeneral.personal[personal].persona.identificacion;
          // tslint:disable-next-line: max-line-length
          validateOther = this.mantenimiento.pk + '-' + fechaInforme + '-' + jornada + '-' + this.cuadrillaGeneral.personal[persona].persona.identificacion;

          if (validate === validateOther) {
            response = true;
          }
        }
      }
    }
    return response;
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {

    this.disableSubmit = true;
    if (this.cuadrillaGeneral.personal.length > 0) {
      if (this.cuadrillaGeneral.personal.length > 5) {
        this.showMessageSnackBar(this.constants.personalCantidadRegistrosErrorMsj);
      }

      this.duplicates = this.duplicateRecord();

      if (this.duplicates) {
        this.showMessageSnackBar(this.constants.duplicidadPersonalErrorMsj);
      }

      this.successInput = (this.duplicates) ? '' : '1';
      this.nextToStepper.emit({ nextToStepper: (this.duplicates) ? false : true });
      this.disableSubmit = true;
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
