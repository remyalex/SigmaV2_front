import { ViewChild, Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatSnackBar, MatTableDataSource } from '@angular/material';
import { RegistroMezclaInsumosService } from '../services/registro-mezcla-insumos.service';
import { RegistroMezclaInsumoCriteria } from '../models/registro-mezcla-insumos-criteria.model';
import { RegistroMezclaInsumoDatasource } from '../services/registro-mezcla-insumos.datasource';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SolicitudMezclaInsumos } from '../models/registro-mezcla-insumos.model';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { CONST_REGISTRAR_MEZCLA_INSUMOS } from '../registro-mezcla-insumos.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { Router } from '@angular/router';
import { ResgistroMezclaInsumosCreateComponent } from '../registro-mezcla-insumos-create/registro-mezcla-insumos-create.component';
import { RegistroMezclaInsumosDetalleComponent } from '../registro-mezcla-insumos-detalle/registro-mezcla-insumos-detalle.component';
import { SelectionModel } from '@angular/cdk/collections';
import { WorkflowService } from '../../../workflow/services/workflow-service.service';


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-produccion-registro-mezcla-insumos-list',
  templateUrl: './registro-mezcla-insumos-list.component.html'
})
export class ResgistroMezclaInsumosListComponent implements OnInit, AfterViewInit {
  /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_MEZCLA_INSUMOS;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: RegistroMezclaInsumoDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: RegistroMezclaInsumoDatasource;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new RegistroMezclaInsumoCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new RegistroMezclaInsumoCriteria();
  disabledButton = false;
  lengthList: Number;
  pagAux: number;
  equipo: RegistroMezclaInsumoCriteria = new RegistroMezclaInsumoCriteria();
  loader = true;
  noInfoToShow = false;
  exportOption = true;
  dataEnsayosExport: any = [];
  turno;
  nosolicitud;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  showCountItems = false;
  /** Columnas de los datos que se exportarán a presionar el botón exportar del componente*/
  dataExport: any = [{}];
  data: any;
  transicionesMasivas = [];
  transicionesIndividuales = [];


  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild(MatSort)
  sort: MatSort;

  // Se agrega el código del mapa
  public selection = new SelectionModel<RegistroMezclaInsumoCriteria>(true, []);
  /** Listado de pks seleccionados en la grilla */
  public listaPksSelect = [];
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'material',
    'unidad',
    'cantidad',
    'cantidadDespachada',
    'barrio',
    'numeroInternoPlaca',
    'localidad',
    'pk',
    'civ',
    'via',
    'ejeVialDesde',
    'ejeVialHasta',
    'personaContacto',
    'horaRetiro',
    'fechaRetiro',
    'quienRecibe',
    'formulario',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    material: 'Material',
    unidad: 'Unidad (m3)',
    cantidad: 'Cantidad',
    cantidadDespachada: 'Cantidad Despachada',
    barrio: 'Barrio',
    numeroInternoPlaca: 'Placa / No Interno',
    localidad: 'Localidad Destino',
    pkDestino: 'PK Destino',
    civ: 'CIV',
    via: 'Via',
    ejeVialDesde: 'Eje Vial Desde',
    ejeVialHasta: 'Eje Vial Hasta',
    personaContacto: 'Persona(s) Contacto',
    horaRetiro: 'Hora Retiro',
    fechaRetiro: 'Fecha Retiro',
    quienRecibe: 'Inspector Quien Recibe'
  }];


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: RegistroMezclaInsumosService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private utillilb: UtilitiesService,
    private utilitiesServices: UtilitiesService,
    private router: Router,
    private workflowService: WorkflowService
  ) {
    this.form = this.formBuilder.group(
      {
        'nosolicitud': [''],
        'turno': ['']
      }
    );
  }


  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new RegistroMezclaInsumoDatasource(this.servicio);
    this.turno = this.servicio.getDataSolicitudService().turno.descripcion;
    this.nosolicitud = this.servicio.getDataSolicitudService().id;
    this.loadMantenimientoActividad();
    this.loadData();
  }

  loadMantenimientoActividad() {
    const procesoUrl = 'produccion';
    const actividadUrl = 'registro-mezcla-insumos';

    // tslint:disable-next-line: max-line-length
    this.servicio._getMantenimientoActividad(procesoUrl, actividadUrl).subscribe(mantenimientoActividad => {
      this.data = mantenimientoActividad;
      this.loadDataMantenimientoActividad();
    });
  }

  loadDataMantenimientoActividad() {
    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      this.columns = this.columns.filter(item => item !== 'select');
      if (this.transicionesMasivas.length > 0) {
        this.columns.unshift('select');
      }
    }
  }

  search(): void {
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    this.loadData();
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


  loadData(): void {
    this.criteria.tipoMaterialId = this.servicio.getDataSolicitudService().tipoMaterial.id;
    // tslint:disable-next-line: max-line-length
    this.dataSource.loadData_list(this.criteria, this.servicio.getDataService().pk, this.servicio.getDataSolicitudService().id, this.servicio.getDataSolicitudService().tipoMaterial.id);
    this.dataSource.loading$.subscribe(response => {
      if (!response) {
        if (this.dataSource.ensayosData.content.length > 0) {
          this.dataSource.ensayosData.content.map((data: any) => {
            for (const index in this.listaPksSelect) {
              if (Number(this.listaPksSelect[index].id) === Number(data.id)) {
                data.formulario = true;
              }
            }
          });
        }
      }
    });
  }


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


  crearVale(dataPayload): void {
    let payload = this.listaPksSelect;
    let enable = false;
    let dataSelected: any = [];

    if (payload !== null && payload !== undefined) {
      for (let i = 0; i < payload.length; i++) {
        if (payload[i].formulario === true) {
          enable = true;
          dataSelected.push(payload[i]);
        }
      }
    }
    const array: any = {
      datosMapa: this.servicio.getDataService(),
      seleccionado: dataSelected
    }
    if (enable) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'edit-modalbox';
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = array;
      dialogConfig.width = '70%';
      const dialogRef = this.dialog.open(ResgistroMezclaInsumosCreateComponent, dialogConfig)
        .afterClosed().subscribe(result => {
          this.listaPksSelect = [];
          this.listaPksSelect.length > 0 ? this.showCountItems = true : this.showCountItems = false;
          this.loadData();
        });
    } else {
      this.snackBar.open('Favor seleccionar al menos una solicitud', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }



  detalleVale(data): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(RegistroMezclaInsumosDetalleComponent, dialogConfig)
      .afterClosed().subscribe(result => {
        this.loadData();
      });
  }


  getHumanDate(_date: number) {
    const date = new Date(+_date);
    return date.toISOString().split('T')[0];
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
        if (val == 1) {
          let urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'solicitudes')
          this.router.navigate([urlBack]);
        }
      }
    );
  }


  exportAsXLSX(): void {
    this.disabledButton = true;
    this.dataSourceExport = new RegistroMezclaInsumoDatasource(this.servicio);
    const total = this.dataSource.totalelementsSubject.value;
    this.cargandoExcel = true;
    this.criteriaExport.pk = this.criteria.pk;
    this.criteriaExport.fecha = this.criteria.fecha != null ? this.criteria.fecha : '';
    this.criteriaExport.size = total;
    this.criteriaExport.page = 0;
    this.criteriaExport.sortBy = this.criteria.sortBy;
    this.criteriaExport.sortOrder = this.criteria.sortOrder;
    // tslint:disable-next-line: max-line-length
    this.dataSourceExport.loadData_list(this.criteriaExport, this.servicio.getDataService().pk, this.servicio.getDataSolicitudService().id, this.servicio.getDataSolicitudService().tipoMaterial.id);
    this.cargandoExcel = true;
    this.dataSourceExport.loading$.subscribe(response => {
      this.disabledButton = false;
      if (!response) {
        const content = this.dataSourceExport.ensayosData.content.map((data: any) => {
          return {
            material: data.material != null ? data.material : '',
            unidad: data.unidad != null ? data.unidad : '',
            cantidad: data.cantidad != null ? data.cantidad : '',
            cantidadDespachada: data.cantidadDespachada != null ? data.cantidadDespachada : '',
            barrio: data.barrio != null ? data.barrio : '',
            numeroInternoPlaca: data.numeroInternoPlaca != null ? data.numeroInternoPlaca : '',
            localidad: data.localidad != null ? data.localidad : '',
            pkDestino: data.pk != null ? data.pk : '',
            civ: data.civ != null ? data.civ : '',
            via: data.via != null ? data.via : '',
            ejeVialDesde: data.ejeVialDesde != null ? data.ejeVialDesde : '',
            ejeVialHasta: data.ejeVialHasta != null ? data.ejeVialHasta : '',
            personaContacto: data.personaContacto != null ? data.personaContacto : '',
            horaRetiro: data.horaRetiro != null ? data.horaRetiro : '',
            fechaRetiro: data.fechaRetiro != null ? this.getHumanDate(data.fechaRetiro) : '',
            quienRecibe: data.quienRecibe != null ? data.quienRecibe : '',
          };
        });
        this.dataExport = [...this.headers, ...content];
        const order = [
          'material',
          'unidad',
          'cantidad',
          'cantidadDespachada',
          'barrio',
          'numeroInternoPlaca',
          'localidad',
          'pkDestino',
          'civ',
          'via',
          'ejeVialDesde',
          'ejeVialHasta',
          'personaContacto',
          'horaRetiro',
          'fechaRetiro',
          'quienRecibe',
        ];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'SolicitudConsultar', true, order);
        this.cargandoExcel = false;
      }
    });
  }

  /** Método encargado de ir a solicitudes consultadas */
  goToDetalles(data): void {
    localStorage.setItem('dataDetalle', JSON.stringify(data));
    this.router.navigate(['produccion/registro-mezcla-insumos/detalle']);
  }

  /**
   * Método encargado de realizar la sinconización entre mapa y grilla,
   * teniendo en cuenta los pks indicados y el pk seleccionado.
   *
   * @param datos Conjunto de Pks seleccionados en el mapa
   * @param event Conjunto de mantenimientos seleccionados en la grilla
   */
  masterToggle(datos: any, event: any) {
    if (event.checked) {
      this.listaPksSelect = [];
      if (datos.equipoSubject.value.length > 0) {
        datos.equipoSubject.value.map(data => {
          this.listaPksSelect.push(data);
          data.formulario = true;
        });
      }
    } else {
      if (datos.equipoSubject.value.length > 0) {
        datos.equipoSubject.value.map(data => {
          data.formulario = false;
        });
      }
    }
  }


  /**
   * Método encargado de mantener la sinconización entre los
   * pks del mapa y los de la grilla cuando se a seleccionado un pk en el mapa.
   *
   * @param filaTabla pk seleccionado a adicionar en listado de pks Seleccionados
   * @param event Evento se selección de pk en el mapa
   */
  toggleChecks(filaTabla: any, event: any) {
    if (event.checked) {
      filaTabla.formulario = true;
      this.listaPksSelect.push(filaTabla);
    } else {
      for (const index in this.listaPksSelect) {
        if (this.listaPksSelect[index].id === filaTabla.id) {
          this.listaPksSelect.splice(+index, 1);
        }
      }
    }
    this.listaPksSelect.length > 0 ? this.showCountItems = true : this.showCountItems = false;
  }

  calcularMaterial(attr: string = ""): number {
    let totalkms = 0;
    for (let i = 0; i < this.listaPksSelect.length; i++) {
      totalkms = totalkms + this.listaPksSelect[i].cantidad;
    }
    return totalkms;
  }

  transitionData(event) {
    const a = event;
  }

  executeTransition(event) {
    this.data.mantenimiento = JSON.parse(localStorage.getItem('dataMapa'));
    this.applySingleTransitionTo();
  }

  public applySingleTransitionTo(): void {
    this.utilitiesServices.scrollToTop();
    if (this.data.id) {
      this.workflowService.update(this.data).subscribe(
        data => {
          this.data = data;
          this.goHome();
        },
        error => {
          this.utilitiesServices.formErrorMessages(error, null, this.snackBar);
        });
    } else {
      this
        .workflowService.create(this.data).subscribe(
          data => {
            this.data = data;
            this.goHome();
          },
          error => {
            this.utilitiesServices.formErrorMessages(error, null, this.snackBar);
          });
    }
  }

  goHome() {
    const urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'view');
    this.router.navigate([urlBack]);
  }

}
