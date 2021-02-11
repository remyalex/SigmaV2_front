import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { WorkflowMantenimientoModel } from '../../../workflow/models/workflow-mantenimiento.model';
import { CuadrillaGeneralModel } from '../models/cuadrilla-general.model';
import { CONST_REGISTRO_DIARIO_CUADRILLA } from '../registro-diario-trabajo-cuadrilla.constant';
import { CuadrillaMaterialCriteria } from '../models/cuadrilla-material-criteria.model';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatTableDataSource, MatDialogConfig } from '@angular/material';
import { CuadrillaGeneralService } from '../services/cuadrilla-general.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { PetreosRapCreateComponent } from './petreos-rap-create/petreos-rap-create.component';
import { PetreosRapEditComponent } from './petreos-rap-edit/petreos-rap-edit.component';
import { CuadrillaPetreosModel } from '../models/cuadrilla-petreos-rap.model';

@Component({
  selector: 'sigma-work-cuadrilla-petreos-rap',
  templateUrl: './work-cuadrilla-petreos-rap.component.html'
})
export class WorkCuadrillaPetreosRapComponent implements OnInit {

  @Input() fifthFormGroup: FormGroup;
  @Input() mantenimiento: WorkflowMantenimientoModel;
  @Input() cuadrillaGeneral: CuadrillaGeneralModel;
  @Input() volumenesPorMaterial: [];
  @Input() componentVisible: boolean;
  @Output() saveSeccionCuadrilla = new EventEmitter();
  @Output() nextToStepper = new EventEmitter();

 /** Constantes a usar en el componente */
  constants = CONST_REGISTRO_DIARIO_CUADRILLA;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new CuadrillaMaterialCriteria();
  CuadrillaPetreosModel: CuadrillaPetreosModel;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  dataCuadrillaMaterial: any;
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
    'claseMaterial',
    'origenMezcla',
    'valeEntrada',
    'valeSalida',
    'placa',
    'horaEntrada',
    'volumenEntrada',
    'volumenSalida',
    'volumenAcopio',
    'volumenUtilizado',
    'destino',
    'nombreDocumento',
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
  constructor(private _formBuilder: FormBuilder,
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

    this.CuadrillaPetreosModel = new CuadrillaPetreosModel();

    if (this.cuadrillaGeneral) {
      this.successInput = '1';
      this.dataCuadrillaMaterial = new MatTableDataSource(this.cuadrillaGeneral.petreos);
      this.dataCuadrillaMaterial.sort = this.sort;
      this.dataCuadrillaMaterial.paginator = this.paginator;
      this.lengthList = this.dataCuadrillaMaterial.filteredData.length;
    }
  }

  add() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      mantenimiento: this.mantenimiento,
      volumenesPorMaterial: this.volumenesPorMaterial
    };

    const dialogRef = this.dialog.open(PetreosRapCreateComponent, dialogConfig);

    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }

    this.petitionList = this.serviceCuadrillaGeneral.serviceListenerPetreos$.subscribe((data: CuadrillaPetreosModel) => {
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
  edit(petreo: CuadrillaPetreosModel, index: number) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      mantenimiento: this.mantenimiento,
      petreo: this.cuadrillaGeneral.petreos[index],
      volumenesPorMaterial: this.volumenesPorMaterial
    };

    const dialogRef = this.dialog.open(PetreosRapEditComponent, dialogConfig);

    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }

    this.petitionList = this.serviceCuadrillaGeneral.serviceListenerPetreos$.subscribe((data: CuadrillaPetreosModel) => {
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
  delete(petreo: CuadrillaPetreosModel, index: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      mantenimiento: this.mantenimiento,
      petreo: this.cuadrillaGeneral.petreos[index]
    };

    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          this.cuadrillaGeneral.petreos.splice(index, 1);
          this.loadData();
          this.save(null, -1);
        }
      }
    );
  }

  save(data, index: number) {
    if (index !== -1) {
      this.cuadrillaGeneral.petreos[index] = data;
    } else if (data) {
      this.cuadrillaGeneral.petreos.push(data);
    }

    if (this.cuadrillaGeneral.id) {
      // tslint:disable-next-line: max-line-length
      this.saveSeccionCuadrilla.emit({ requestType: 'update', evento: 'loadData', owner: 'petreos', nextStepper: false, cuadrillaGeneral: this.cuadrillaGeneral });
    } else {
      this.cuadrillaGeneral.mantenimiento = this.mantenimiento;
      this.cuadrillaGeneral.intervencionEncabezado = this.mantenimiento.intervenciones[0];
      // tslint:disable-next-line: max-line-length
      this.saveSeccionCuadrilla.emit({ requestType: 'create', evento: 'loadData', owner: 'petreos', nextStepper: false, cuadrillaGeneral: this.cuadrillaGeneral });
    }
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {

    this.disableSubmit = true;
    if (this.cuadrillaGeneral.petreos.length > 0) {
      this.successInput = '1';
      this.nextToStepper.emit({ nextToStepper: true });
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
