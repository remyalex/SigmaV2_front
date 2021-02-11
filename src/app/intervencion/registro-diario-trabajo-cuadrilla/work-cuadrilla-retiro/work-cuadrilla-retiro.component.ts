import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { WorkflowMantenimientoModel } from '../../../workflow/models/workflow-mantenimiento.model';
import { CuadrillaGeneralModel } from '../models/cuadrilla-general.model';
import { CONST_REGISTRO_DIARIO_CUADRILLA } from '../registro-diario-trabajo-cuadrilla.constant';
import { CuadrillaMaterialCriteria } from '../models/cuadrilla-material-criteria.model';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatTableDataSource, MatDialogConfig } from '@angular/material';
import { CuadrillaGeneralService } from '../services/cuadrilla-general.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { SigmaConfirmComponent } from '../../../shared/sigma-confirm/sigma-confirm.component';
import { RetiroCreateComponent } from './retiro-create/retiro-create.component';
import { RetiroEditComponent } from './retiro-edit/retiro-edit.component';
import { CuadrillaRetiroModel } from '../models/cuadrilla-retiro.model';

/** Método encargado de gestionar los retiros de las cuadrillas */
@Component({
  selector: 'sigma-work-cuadrilla-retiro',
  templateUrl: './work-cuadrilla-retiro.component.html'
})
export class WorkCuadrillaRetiroComponent implements OnInit {

  /** Variable de entrada del formulario de grupo llamado twelft */
  @Input() twelfthFormGroup: FormGroup;
  /** Variable de entrada con los datos del mantenimineto del cual se va a realizar el procedimiento */
  @Input() mantenimiento: WorkflowMantenimientoModel;
  /** Variable de entrada con los datos de la cuadrilla general que será retirada */
  @Input() cuadrillaGeneral: CuadrillaGeneralModel;
  /** Variable que identifica si el componente será visible */
  @Input() componentVisible: boolean;
  /** Evento de notificación al momento de guardar la sección de cuadrilla */
  @Output() saveSeccionCuadrilla = new EventEmitter();
  /** Evento de salida de la siguiente accion a realizar */
  @Output() nextToStepper = new EventEmitter();

 /** Constantes a usar en el componente */
  constants = CONST_REGISTRO_DIARIO_CUADRILLA;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new CuadrillaMaterialCriteria();
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  CuadrillaRetiroModel: CuadrillaRetiroModel;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataCuadrillaMaterial: any;
  /** cantidad registros encontrados en el datasource */
  lengthList: Number;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /** Bandera para indicar si el componente se encuentra en procesamiento por el servicio  */
  loader = false;
  /** Variable que se encarga de Mostrar o no la informacion en el componente  */
  noInfoToShow = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Bandera que identifica si existen registros duplicados */
  duplicates = false;
  /** Variable del mensaje a presentar al usuario */
  successInput = '';
  /** Listado de peticiones realizadas para el mantenimiento */
  public petitionList = null;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'tipoMaterial',
    'claseMaterial',
    'volumen',
    'destino',
    'archivoId',
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
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param _formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesServices Componente de utilidades de peticiones a servicios
   */
   constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private serviceCuadrillaGeneral: CuadrillaGeneralService,
    private utilitiesServices: UtilitiesService) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.loadData();
 }

 /**
  * Método encargado de gestionar la carga de los pks
  * de la grilla al iniciar el componente.
  */
  loadData(): void {

    this.CuadrillaRetiroModel = new CuadrillaRetiroModel();

    if (this.cuadrillaGeneral) {
      this.successInput = '1';
      this.dataCuadrillaMaterial = new MatTableDataSource(this.cuadrillaGeneral.retiro);
      this.dataCuadrillaMaterial.sort = this.sort;
      this.dataCuadrillaMaterial.paginator = this.paginator;
      this.lengthList = this.dataCuadrillaMaterial.filteredData.length;
    }
  }

  /** Método encargado de adicionar un registro en la grilla */
  add() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      mantenimiento: this.mantenimiento
    };

    const dialogRef = this.dialog.open(RetiroCreateComponent, dialogConfig);

    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }

    this.petitionList = this.serviceCuadrillaGeneral.serviceListenerRetiro$.subscribe((data: CuadrillaRetiroModel) => {
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
   * @param retiro Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   *
   * @param index Indice del registro que se desea editar
   */
  edit(retiro: CuadrillaRetiroModel, index: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      mantenimiento: this.mantenimiento,
      retiro: this.cuadrillaGeneral.retiro[index]
    };

    const dialogRef = this.dialog.open(RetiroEditComponent, dialogConfig);

    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }

    this.petitionList = this.serviceCuadrillaGeneral.serviceListenerRetiro$.subscribe((data: CuadrillaRetiroModel) => {
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
   * @param retiro Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   * @param index Indice del registro que se desea editar
   */
  delete(retiro: CuadrillaRetiroModel, index: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      mantenimiento: this.mantenimiento,
      retiro: this.cuadrillaGeneral.retiro[index]
    };

    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          this.cuadrillaGeneral.retiro.splice(index, 1);
          this.loadData();
          this.save(null, -1);
        }
      }
    );
  }

   /**
    * Método encargado de realizar solicitud de almacenamiento al servicio
    *
    * @param data dato que se desea actualizar
    * @param index Indice del registro que se desea editar
    **/
   save(data, index: number) {
    if (index !== -1) {
      this.cuadrillaGeneral.retiro[index] = data;
    } else if (data) {
      this.cuadrillaGeneral.retiro.push(data);
    }

    if (this.cuadrillaGeneral.id) {
      // tslint:disable-next-line: max-line-length
      this.saveSeccionCuadrilla.emit({ requestType: 'update', evento: 'loadData', owner: 'retiros', nextStepper: false, cuadrillaGeneral: this.cuadrillaGeneral });
    } else {
      this.cuadrillaGeneral.mantenimiento = this.mantenimiento;
      this.cuadrillaGeneral.intervencionEncabezado = this.mantenimiento.intervenciones[0];
      // tslint:disable-next-line: max-line-length
      this.saveSeccionCuadrilla.emit({ requestType: 'create', evento: 'loadData', owner: 'retiros', nextStepper: false, cuadrillaGeneral: this.cuadrillaGeneral });
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

  /**
   * Método encargado de gestionar la presentación del
   * mensaje de usuario en el componente
   *
   * @param message Mensaje a presentar por parte del usuario
   **/
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
