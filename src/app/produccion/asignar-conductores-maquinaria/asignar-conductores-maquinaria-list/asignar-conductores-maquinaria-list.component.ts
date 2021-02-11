import { ViewChild, Component, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatSnackBar, MatStepper } from '@angular/material';
import { AsignarConductoresMaquinariaService } from '../services/asignar-conductores-maquinaria.service';
// tslint:disable-next-line: max-line-length
import { AsignarConductoresMaquinariaCriteria, AsignarConductoresMaquinariaPersonas }   from '../models/asignar-conductores-maquinaria-criteria.model';
import { AsignarConductoresMaquinariaDatasource } from '../services/asignar-conductores-maquinaria.datasource';
import { CONST_ASIGNAR_CONDUCTORES_MAQUINARIA } from '../asignar-conductores-maquinaria.constant';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
// tslint:disable-next-line: max-line-length
import { AsignarConductoresMaquinariaDeleteComponent } from '../asignar-conductores-maquinaria-delete/asignar-conductores-maquinaria-delete.component';
import * as _moment from 'moment';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { WorkflowService } from '../../../workflow/services/workflow-service.service';

/** Variable encargada de gestionar la propiedad momento de una hora  */
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-produccion-asignar-conductores-maquinaria-list',
  templateUrl: './asignar-conductores-maquinaria-list.component.html',
  styles: ['.hidden { display: block }']
})

export class AsignarConductoresMaquinariaListComponent implements OnInit, AfterViewInit {
  /** Constantes a usar en el componente */
  constants = CONST_ASIGNAR_CONDUCTORES_MAQUINARIA;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: AsignarConductoresMaquinariaDatasource;
  dataSourceMaquinaria: AsignarConductoresMaquinariaDatasource;
  dataSourcePersonas: AsignarConductoresMaquinariaDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: AsignarConductoresMaquinariaDatasource;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new AsignarConductoresMaquinariaCriteria();
  maquinaria = new AsignarConductoresMaquinariaCriteria();
  personas = new AsignarConductoresMaquinariaPersonas();

  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new AsignarConductoresMaquinariaCriteria();
  disabledButton = false;
  lengthList: Number;
  pagAux: number;
  equipo: AsignarConductoresMaquinariaCriteria = new AsignarConductoresMaquinariaCriteria();
  loader = true;
  noInfoToShow = false;
  exportOption = true;
  loadingResponsable = false;
  valorIntervencion: any;
  filtroIntervencion: any = '';
  dataEnsayosExport: any = [];
  mantenimientoFormGroup: FormGroup;
  equipoFormGroup: FormGroup;
  personaFormGroup: FormGroup;
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  requiredUsuarioFormGroup: FormGroup;
  datasend: any = [];
  listPersonasArray: any = [];
  data: any;
  transicionesMasivas = [];
  transicionesIndividuales = [];
  transicionesIndividualesAuto = [];
  showTransition = false;
  pk: number;
  disableSubmit = false;

  requierePersonal = true;


  /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('paginatorMaquinaria') paginatorMaquinaria: MatPaginator;
  @ViewChild('sortMaquinaria') sortMaquinaria: MatSort;

  @ViewChild('paginatorPersonas') paginatorPersonas: MatPaginator;
  @ViewChild('sortPersonas') sortPersonas: MatSort;

  @ViewChild('stepper') stepper: MatStepper;


  /** Definición de los encabezados de las columnas presentadas en la grilla */

  columns = [
    'select',
    'id',
    'civ',
    'pk',
    'fechaInicioVisita',
    'fechaFinVisita',
    'direccion',
    'jornada',
    'acciones',
  ];

  columnsMaquinaria = [
    'select',
    'numeroInterno',
    'tipoEquipo',
    'claseEquipo',
    'placaInventario',
    'marcaEquipo',
    'estadoEquipo',
    'lugar',
    'fechaProgramacionSolicitada',
    'fechaDevolucionProgramacionSolicitada',
    'jornada',
  ];

  columnsPersonas = [
    'select',
    'fecha',
    'nombreCompleto',
    'horario'
  ];

  headers = [{
    id: 'Id',
    pk: 'PK',
    civ: 'CIV',
    cantidad: 'Cantidad',
    personasContacto: 'Personas Contacto',
    fechaRetiro: 'Fecha Retiro',
    horaRetiro: 'Hora Retiro',
    quienRecibe: 'Quien Recibe',
    cantidadDespachada: 'Cantidad Despachada',
    capacidadDespachar: 'Capacidad Despachar',
    fechaReprogramacion: 'Fecha Programación',
    turno: 'Turno',
    tipoMaterial: 'Tipo Material',
    observaciones: 'Observaciones'
  }];

  // Se agrega el código del mapa
  public selection = new SelectionModel<AsignarConductoresMaquinariaCriteria>(true, []);
  /** Listado de pks seleccionados en la grilla */
  public listaIntervencionSelected = [];
  public listaMaquinariaSelected = [];
  public listaPersonasSelected = [];

  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: AsignarConductoresMaquinariaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private _formBuilder: FormBuilder,
    private utilitiesService: UtilitiesService,
    private workflowService: WorkflowService,
  ) { }


  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    this.loadMantenimientoActividad();
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new AsignarConductoresMaquinariaDatasource(this.servicio);
    this.initOtherDataSource();

    this.loadData();
    this.criteria.filtroIntervencion = '';

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });

    this.requiredUsuarioFormGroup = this._formBuilder.group({
      requiredUsuarioCtrl: ['', Validators.required]
    });
  }

  loadMantenimientoActividad() {
    const procesoUrl = 'produccion';
    const actividadUrl = 'asignar-conductores-operarios-maquinaria-umv';
    this.showTransition = false;

    // tslint:disable-next-line: max-line-length
    this.servicio._getMantenimientoActividad(procesoUrl, actividadUrl).subscribe(mantenimientoActividad => {
      this.data = mantenimientoActividad;
      this.data.mantenimiento = JSON.parse(localStorage.getItem('dataMapa'));
      this.loadDataMantenimientoActividad();
    });
  }

  loadDataMantenimientoActividad() {
    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      // this.columns = this.columns.filter(item => item !== 'select');
      if (this.transicionesMasivas.length > 0) {
        this.columns.unshift('select');
      }
    }
  }

  /**
  * Método encargado de invocar la petición de consulta
  * al servicio según los criterios definidos
  */
  search(): void {
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    this.loadData();
  }

  initOtherDataSource() {
    this.dataSourceMaquinaria = new AsignarConductoresMaquinariaDatasource(this.servicio);
    this.dataSourcePersonas = new AsignarConductoresMaquinariaDatasource(this.servicio);
  }

  changePageMaquinaria(event) {
    this.maquinaria.page = event.pageIndex;
    this.maquinaria.size = event.pageSize;
    this.loadDataMaquinaria(this.listaIntervencionSelected[0].pk);
  }

  sortDataMaquinaria(event) {
    this.maquinaria.sortBy = event.active;
    this.maquinaria.sortOrder = event.direction;
    this.loadDataMaquinaria(this.listaIntervencionSelected[0].pk);
  }

  changePagePersonas(event) {
    this.personas.page = event.pageIndex;
    this.personas.size = event.pageSize;
    this.goToPersonas_Sort();
  }

  sortDataPersonas(event) {
    this.personas.sortBy = event.active;
    this.personas.sortOrder = event.direction;
    this.goToPersonas_Sort();
  }

  Limpiar(): void {
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteria[key] = '';
      }
    }
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  /**
   * Método encargado de gestionar la carga de las intervenciones
   * de la grilla al iniciar el componente.
   */
  loadData(): void {
    this.dataSource.loadData(this.criteria, this.servicio.getDataService().pk);
    this.dataSource.loading$.subscribe(response => {
      if (!response) {
        if (this.dataSource.ensayosData) {
          if (this.dataSource.ensayosData.content.length > 0) {
            this.dataSource.ensayosData.content.map((data: any) => {
              for (const index in this.listaIntervencionSelected) {
                if (Number(this.listaIntervencionSelected[index].id) === Number(data.id)) {
                  data.seleccion = true;
                }
              }
            });
          }
        }

      }
    });
  }

  /**
 * Método encargado de gestionar la carga de las maquinarias
 * de la grilla al iniciar el componente.
 */
  loadDataMaquinaria(payload): void {
    this.dataSourceMaquinaria.loadData_Maquinaria(this.maquinaria, payload);
    this.dataSourceMaquinaria.loading$.subscribe(response => {
      if (!response) {
        if (this.dataSourceMaquinaria.ensayosData) {
          if (this.dataSourceMaquinaria.ensayosData.content.length > 0) {
            this.dataSourceMaquinaria.ensayosData.content.map((data: any) => {
              for (const index in this.listaMaquinariaSelected) {
                if (Number(this.listaMaquinariaSelected[index].id) === Number(data.id)) {
                  data.seleccion = true;
                }
              }
            });
          }
        }

      }
    });
  }

  /**
 * Método encargado de gestionar la carga de las personas
 * de la grilla al iniciar el componente.
 */
  loadDataPersonas(payload): void {
    this.dataSourcePersonas.loadData_Personas(payload);
    this.dataSourcePersonas.loading$.subscribe(response => {
      if (!response) {
        if (this.dataSourcePersonas.ensayosData) {
          if (this.dataSourcePersonas.ensayosData.content.length > 0) {
            this.dataSourcePersonas.ensayosData.content.map((data: any) => {
              for (const index in this.listaPersonasSelected) {
                if (Number(this.listaPersonasSelected[index].id) === Number(data.id)) {
                  data.seleccion = true;
                }
              }
            });
          }
        }

      }
    });
  }

  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.criteria.page = this.paginator.pageIndex;
      this.criteria.size = this.paginator.pageSize;
      this.loadData();
    });
    this.sort.sortChange.subscribe(() => {
      this.criteria.sortBy = this.sort.active;
      this.criteria.sortOrder = this.sort.direction || 'asc';
      this.loadData();
    });

  }


  goToMaquinaria(): void {
    this.loadDataMaquinaria(this.listaIntervencionSelected[0].pk);
    this.changeTransitionCase();
  }

  goToPersonas_Sort(): void {
    const dateMaquinaria =
      this.listaMaquinariaSelected ? this.getHumanDate(this.listaMaquinariaSelected[0].fechaProgramacionSolicitada) : '';
    this.personas.fecha =
      moment(dateMaquinaria).format('DD-MM-YYYY');
    this.loadDataPersonas(this.personas);
  }


  goToPersonas(): void {
    const dateMaquinaria =
      this.listaMaquinariaSelected ? this.getHumanDate(this.listaMaquinariaSelected[0].fechaProgramacionSolicitada) : '';
    this.personas.fecha = moment(dateMaquinaria).format('DD-MM-YYYY');
    this.loadDataPersonas(this.personas);
    const ids = {};
    const duplicados = [];

    this.loadingResponsable = true;
    this.servicio.listPersonas_All(this.personas.fecha).subscribe(data => {
      const getData: any = data;
      getData.content.forEach((val) => {
        if (ids[val.idPersona]) {
          // we have already found this same id
          duplicados.push(val.nombreCompleto);
        } else {
          ids[val.idPersona] = true;
        }
      });
      const uniques = Array.from(new Set(duplicados));
      this.listPersonasArray = Object.values(uniques);
      this.loadingResponsable = false;

    }, error => {
      this.disableSubmit = false;
      this.utilitiesService.formErrorMessages(error, null, this.snackBar);
    });

  }

  chargeListaItem(payload) {
    this.personas.nombreCompleto = payload;
    this.loadDataPersonas(this.personas);
  }

  getHumanDate(_date: number) {
    const date = new Date(+_date);
    return date.toISOString().split('T')[0];
  }

  addDays(fecha: number, days: number): Date {
    const date = new Date(+fecha);
    date.setDate(date.getDate() + days);
    return date;
  }

  /** Método encargado de devolver a la página principal el componente */
  onBack(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          const urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'view');
          this.router.navigate([urlBack]);
        }
      }
    );
  }

  toggleChecksIntervencion(filaTabla: any, event: any) {
    if (event.checked) {
      filaTabla.seleccion = true;
      this.listaIntervencionSelected.push(filaTabla);
      this.firstFormGroup.get('firstCtrl').setValue(filaTabla.id);

    } else {
      for (const index in this.listaIntervencionSelected) {
        if (this.listaIntervencionSelected[index].id === filaTabla.id) {
          this.listaIntervencionSelected.splice(+index, 1);
          this.firstFormGroup.get('firstCtrl').setValue('');

        }
      }
    }
  }

  toggleChecksMaquinaria(filaTabla: any, event: any) {
    if (event.checked) {
      filaTabla.seleccion = true;
      this.listaMaquinariaSelected.push(filaTabla);
    } else {
      for (const index in this.listaMaquinariaSelected) {
        if (this.listaMaquinariaSelected[index].id === filaTabla.id) {
          this.listaMaquinariaSelected.splice(+index, 1);
        }
      }
    }
    if (this.listaMaquinariaSelected.length === 1 && this.listaMaquinariaSelected[0].idOrigenEquipo === 323565) {
      this.requierePersonal = false;
      this.requiredUsuarioFormGroup.controls['requiredUsuarioCtrl'].setValue(null);
      this.snackBar.open('Si el equipo es de origen "Alquilado" no se requiere asignar personal', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
      this.listaPersonasSelected = [];
    } else {
      this.requierePersonal = true;
      this.requiredUsuarioFormGroup.controls['requiredUsuarioCtrl'].setValue(1);
    }
  }


  toggleChecksPersonas(filaTabla: any, event: any) {
    if (event.checked) {
      filaTabla.seleccion = true;
      this.listaPersonasSelected.push(filaTabla);
    } else {
      for (const index in this.listaPersonasSelected) {
        if (this.listaPersonasSelected[index].id === filaTabla.id) {
          this.listaPersonasSelected.splice(+index, 1);
        }
      }
    }
  }

  saveSecciones() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.disableSubmit = true;
        this.datasend = [];
        let array;
        for (let i = 0; i < this.listaPersonasSelected.length; i++) {
          if (this.listaPersonasSelected[i].seleccion === true) {
            if (this.requierePersonal === true) {
              array = {
                intervencion: { id: this.listaIntervencionSelected[0].id },
                equipo: { id: this.listaMaquinariaSelected[0].idEquipo },
                personaCalendario: { id: this.listaPersonasSelected[i].id }
              };
            }
            this.datasend.push(array);
          }
        }

        if(this.listaPersonasSelected.length === 0 && this.listaMaquinariaSelected.length > 0){
            array = {
              intervencion: { id: this.listaIntervencionSelected[0].id },
              equipo: { id: this.listaMaquinariaSelected[0].idEquipo }
            };
            this.datasend.push(array);
        }

        this.servicio.create(this.datasend).subscribe(data => {
          this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          this.showTransition = true;
        }, error => {
          this.disableSubmit = false;
          this.utilitiesService.formErrorMessages(error, null, this.snackBar);
        });
      }
    });
  }


  cancelPersona(payload) {
    let enableCheckbox = false;
    this.datasend = [];
    const array = {
      id: payload.id,
      fecha: new Date,
      motivo: ''
    };
    enableCheckbox = true;
    this.datasend = array;

    if (enableCheckbox) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '40%';
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {};
      const dialogRef = this.dialog.open(AsignarConductoresMaquinariaDeleteComponent, dialogConfig);
      dialogRef.beforeClosed().subscribe(
        val => {
          if (val) {
            this.datasend.motivo = val.cancelacionPersona;
            this.servicio.post_cancelar(this.datasend).subscribe(data => {
              this.resetList();
              dialogRef.close(true);
              this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
                duration: 5000,
                panelClass: ['success-snackbar']
              });
              this.Limpiar();
              this.initOtherDataSource();
            }, error => {
              this.utilitiesService.formErrorMessages(error, null, this.snackBar);
            });
          } else if (val === 0) {
            this.resetList();
            this.Limpiar();
          }
        }
      );
    } else {
      this.snackBar.open('Favor seleccionar al menos una solicitud', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  resetList() {
    this.listaIntervencionSelected = [];
    this.listaMaquinariaSelected = [];
    this.listaPersonasSelected = [];
    this.stepper.selectedIndex = 0;
    this.personas.nombreCompleto = '';

  }

  executeTransition() {
    this.data.mantenimiento.intervenciones[0].programacionesDiarias = [];
    this.applySingleTransitionTo();
  }

  public applySingleTransitionTo(): void {
    this.utilitiesService.scrollToTop();
    if (this.data.id) {
      this.workflowService.update(this.data).subscribe(
        data => {
          this.data = data;
          this.goHome();
        },
        error => {
          this.utilitiesService.formErrorMessages(error, null, this.snackBar);
        });
    } else {
      this.workflowService.create(this.data).subscribe(
        data => {
          this.data = data;
          this.goHome();
        },
        error => {
          this.utilitiesService.formErrorMessages(error, null, this.snackBar);
        });
    }
  }

  goHome() {
    this.router.navigate(['produccion/asignar-conductores-maquinaria/view']);
  }

  changeTransitionCase() {
    this.transicionesIndividualesAuto = [];
    if(this.data.mantenimiento.intervenciones[0].programacionesDiarias[0].material.length > 0)
    {
      this.transicionesIndividualesAuto.push(this.transicionesIndividuales[1]); // Intervencion 14
    } else {
      this.transicionesIndividualesAuto.push(this.transicionesIndividuales[0]); // Intervencion 8
    }
  }

  onStepChange(event: any): void {
    if (event.selectedIndex === 1) {
      this.goToMaquinaria();
    } else if (event.selectedIndex === 2) {
      this.goToPersonas();
    }
  }
}
