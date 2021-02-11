import { ConsultarViewComponent } from './../consultar-view/consultar-view.component';
import { Usuario } from './../../../administracion/usuario/models/usuario.model';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { CondicionService } from 'src/app/administracion/transicioncondiciones/services/transicioncondiciones.services';
import { CONST_CONSULTAR_PROGRAMACION_PERIODICA } from '../consultar-programacion.constants';
import { ConsultarProgramacionCriteria } from '../models/consultarProgramacion.criteria.model';
import { ConsultarProgramacionDatasource } from '../services/consultar-programacion.datasource';
import { ConsultarProgramacionService } from '../services/consultar-programacion.service';
import { Zona } from 'src/app/administracion/ubicaciones/zona/models/zona.model';
import { Localidad } from 'src/app/administracion/ubicaciones/localidad/models/localidad.model';
import { Barrio } from 'src/app/administracion/ubicaciones/barrio/models/barrio.model';
import { Upz } from 'src/app/administracion/ubicaciones/upz/models/upz.model';
import { Upla } from 'src/app/administracion/ubicaciones/upla/models/upla.model';
import { Cuadrante } from 'src/app/administracion/ubicaciones/cuadrante/models/cuadrante.model';
import { environment } from 'src/environments/environment';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-consultar-list',
  templateUrl: './consultar-list.component.html'
})
export class ConsultarListComponent implements OnInit, AfterViewInit {

  /** Constantes a usar en el componente */
  constants = CONST_CONSULTAR_PROGRAMACION_PERIODICA;
  currentAction = 'list';

  disabledButtonConsultar = true;
  pdfVisualizar = false;
  disabledTable = true;
  showTotales = false;

  /** Criterio para filtros en la consulta */
  criteria = new ConsultarProgramacionCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new ConsultarProgramacionCriteria();
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: ConsultarProgramacionDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: ConsultarProgramacionDatasource;

  cargandoExcel = false;
  dataSourceTotales: any[] = [];

  /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;

  resultadosGrilla: boolean;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [];
  columns1 = [
    'pk', 'civ', 'localidadNombre', 'uplaNombre', 'barrioNombre', 'tipoIntervencionTotalNombre',
    'estrategiaNombre', 'estadoPkNombre', 'estadoObraNombre', 'directorObraNombre', 'vigenciaNombre',
    'periodoNombre', 'fechaInicioReal', 'fechaFinReal', 'duracionReal',
    'duracionPlaneada', 'estadoAvanceNombre', 'kmCarrilImpacto', 'kmCarrilLineal',
    'kmCarrilObra', 'acciones'
  ];

  columns2 = ['pk', 'fechaProgDiaria', 'jornada7', 'fechaRegDiarioCuadrilla', 'jornada8'];

  columnsExport = ['no', 'zona', 'zonaValor', 'noLocal', 'localidad', 'upla', 'barrio', 'pkIdCalzada', 'civ',
    'ejeVial', 'desde', 'hasta', 'elemento', 'actividad', 'actAgrupada', 'tipoMalla', 'tipoMallaVial1', 'anchoPk',
    'longitudH', 'areaPk', 'estado', 'origen', 'superficie', 'kmCarrilImpacto', 'kmCarrilLineal', 'kmCarrilObra', 'huecos',
    'mezcla', 'concreto', 'estrategia', 'programa', 'programacion', 'mesMeta', 'estadoEjecucion', 'finEjecucion', 'anoMes',
    'residente', 'director', 'trimestre', 'fecha', 'esMisional', 'esPaOSf', 'pmt', 'horarioPmt', 'project', 'observacionGISmvl',
    'observacionGI', 'observacion2020'];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    no: this.constants.no, zona: this.constants.zona, zonaValor: this.constants.zona, noLocal: this.constants.noLocal,
    localidad: this.constants.localidad, upla: this.constants.upla, barrio: this.constants.barrio, pkIdCalzada: this.constants.pkIdCalzada,
    civ: this.constants.civ, ejeVial: this.constants.ejeVial, desde: this.constants.desde, hasta: this.constants.hasta,
    elemento: this.constants.elementos, actividad: this.constants.actividad, actAgrupada: this.constants.actAgrupada,
    tipoMalla: this.constants.tipoMalla, tipoMallaVial1: this.constants.tipoMallaVial1, anchoPk: this.constants.anchoPk,
    longitudH: this.constants.longitudH, areaPk: this.constants.areaPk, estado: this.constants.estado, origen: this.constants.origen,
    superficie: this.constants.superficie, kmCarrilImpacto: this.constants.kmCarrilImpacto, kmCarrilLineal: this.constants.kmCarrilLineal,
    kmCarrilObra: this.constants.kmCarrilObra, huecos: this.constants.huecos, mezcla: this.constants.mezcla, concreto:
      this.constants.concreto, estrategia: this.constants.estrategia, programa: this.constants.programa, programacion:
      this.constants.programacion, mesMeta: this.constants.mesMeta, estadoEjecucion: this.constants.estadoEjecucion, finEjecucion:
      this.constants.finEjecucion, anoMes: this.constants.anoMes, residente: this.constants.residente, director: this.constants.director,
    trimestre: this.constants.trimestre, fecha: this.constants.fecha, esMisional: this.constants.esMisional, esPaOSf:
      this.constants.esPaOSf, pmt: this.constants.pmt, horarioPmt: this.constants.horarioPmt, project: this.constants.project,
    observacionGISmvl: this.constants.observacionGISmvl, observacionGI: this.constants.observacionGI, observacion2020:
      this.constants.observacion2020
  }];
  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [];
  //---Listas Filtros---
  zonas: Zona[] = [];
  directoresAll: Usuario[] = [];
  directores: Usuario[] = [];
  localidadesAll: Localidad[] = [];
  barriosAll: Barrio[] = [];
  localidades: Localidad[] = [];
  barrios: Barrio[] = [];
  uplas: Upla[] = [];
  cuadrantesAll: Cuadrante[] = [];
  uplasAll: Upla[] = [];

  public urlPeriodo = '';
  public showPeriodo = true;

  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private _service: ConsultarProgramacionService,
    private formBuilder: FormBuilder,
    private excelService: ExcelService,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private condicionService: CondicionService,
    private _servicioGeneral: DataGenericService,
  ) {
    this.form = formBuilder.group({
      'criterio': [{ value: null, disabled: false }],
      'zona': [{ value: null, disabled: true }],
      'localidad': [{ value: null, disabled: true }],
      'upla': [{ value: null, disabled: true }],
      'barrio': [{ value: null, disabled: true }],
      'directorObra': [{ value: null, disabled: true }],
      'tipoIntervencion': [{ value: null, disabled: true }],
      'estrategia': [{ value: null, disabled: true }],
      'vigencia': [{ value: null, disabled: true }],
      'periodicidad': [{ value: null, disabled: true }],
      'periodo': [{ value: null, disabled: true }],
      'fechaInicialCorte': [{ value: null, disabled: true }],
      'fechaFinalCorte': [{ value: null, disabled: true }],
      'pk': [{ value: null, disabled: true }],
      'estadoPk': [{ value: null, disabled: true }],
      'estadoObra': [{ value: null, disabled: true }]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.dataSource = new ConsultarProgramacionDatasource(this._service);
    this.resultadosGrilla = false;
    this.disabledFiltros();
    this.processingFiltersToShow();
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      this.criteria.page = this.paginator.pageIndex;
      this.criteria.size = this.paginator.pageSize;
      this.dataSource.loadData(this.criteria);
    });

    this.sort.sortChange.subscribe(() => {
      this.criteria.sortBy = this.sort.active;
      this.criteria.sortOrder = this.sort.direction || 'asc';
      this.paginator.pageIndex = 0;
      this.dataSource.loadData(this.criteria);
    });
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
  }

  /**
  * Método encargado de gestionar la carga de los pks
  * de la grilla al iniciar el componente.
  */
  loadData(): void {
    this.dataSource.loadData(this.criteria);
  }

  filtrosDisabled(value: any) {
    this.columns = [];
    this.disabledTable = true;
    this.showTotales = false;
    switch (value) {
      case 'SeguimientoProgramacion':
        this.columns = this.columns1;
        this.disabledButtonConsultar = false;
        this.disabledFiltroSeguimientoProg();
        break;

      case 'Ejecucion':
        this.columns = this.columns1;
        this.disabledButtonConsultar = false;
        this.disabledFiltroEjecucion();
        break;

      case 'SeguimientoPK':
        this.columns = this.columns2;
        this.disabledButtonConsultar = false;
        this.disabledFiltroSeguimientoPk();
        break;
      default:
        this.disabledFiltros();
        this.disabledButtonConsultar = true;
    }
  }

  search() {
    this.showTotales = false;
    if (this.columns.length < 1) {
      this.columns = this.columns1;
    }
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    this.loadData();
    setTimeout(() => {
      this.disabledTable = false;
      this.showTotales = true;
    }, 1000);
  }

  clear() {
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key) && this.criteria.hasOwnProperty(key)) {
        this.criteria[key] = '';
      }
    }
    this.form.controls['criterio'].reset();
    this.columns = [];
    this.disabledTable = true;
    this.showTotales = false;
    this.disabledFiltros();
    this.processingFiltersToShow();
  }


  view(mantenimiento: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = mantenimiento.archivoId;

    const dialogRef = this.dialog.open(ConsultarViewComponent, dialogConfig);

  }

  disabledFiltroSeguimientoProg() {
    this.pdfVisualizar = true;
    this.form.controls['zona'].enable();
    this.form.controls['localidad'].enable();
    this.form.controls['upla'].enable();
    this.form.controls['barrio'].enable();
    this.form.controls['directorObra'].enable();
    this.form.controls['tipoIntervencion'].enable();
    this.form.controls['estrategia'].enable();
    this.form.controls['vigencia'].enable();
    this.form.controls['periodicidad'].enable();
    this.form.controls['periodo'].enable();
    this.form.controls['fechaInicialCorte'].disable();
    this.form.controls['fechaFinalCorte'].disable();
    this.form.controls['pk'].enable();
    this.form.controls['estadoPk'].enable();
    this.form.controls['estadoObra'].enable();
  }

  disabledFiltroEjecucion() {
    this.pdfVisualizar = false;
    this.form.controls['zona'].enable();
    this.form.controls['localidad'].enable();
    this.form.controls['upla'].enable();
    this.form.controls['barrio'].enable();
    this.form.controls['directorObra'].enable();
    this.form.controls['tipoIntervencion'].enable();
    this.form.controls['estrategia'].enable();
    this.form.controls['vigencia'].disable();
    this.form.controls['periodicidad'].disable();
    this.form.controls['periodo'].disable();
    this.form.controls['fechaInicialCorte'].enable();
    this.form.controls['fechaFinalCorte'].enable();
    this.form.controls['pk'].enable();
    this.form.controls['estadoPk'].enable();
    this.form.controls['estadoObra'].enable();
  }

  disabledFiltroSeguimientoPk() {
    this.pdfVisualizar = false;
    this.form.controls['zona'].enable();
    this.form.controls['localidad'].enable();
    this.form.controls['upla'].enable();
    this.form.controls['barrio'].enable();
    this.form.controls['directorObra'].enable();
    this.form.controls['tipoIntervencion'].disable();
    this.form.controls['estrategia'].disable();
    this.form.controls['vigencia'].disable();
    this.form.controls['periodicidad'].disable();
    this.form.controls['periodo'].disable();
    this.form.controls['fechaInicialCorte'].disable();
    this.form.controls['fechaFinalCorte'].disable();
    this.form.controls['pk'].enable();
    this.form.controls['estadoPk'].enable();
    this.form.controls['estadoObra'].enable();
  }

  disabledFiltros() {
    this.disabledButtonConsultar = true;
    this.form.controls['zona'].disable();
    this.form.controls['localidad'].disable();
    this.form.controls['upla'].disable();
    this.form.controls['barrio'].disable();
    this.form.controls['directorObra'].disable();
    this.form.controls['tipoIntervencion'].disable();
    this.form.controls['estrategia'].disable();
    this.form.controls['vigencia'].disable();
    this.form.controls['periodicidad'].disable();
    this.form.controls['periodo'].disable();
    this.form.controls['fechaInicialCorte'].disable();
    this.form.controls['fechaFinalCorte'].disable();
    this.form.controls['pk'].disable();
    this.form.controls['estadoPk'].disable();
    this.form.controls['estadoObra'].disable();
  }

  exportAsXLSX() {
    this.cargandoExcel = true;
    this.dataSourceExport = new ConsultarProgramacionDatasource(this._service);

    const total = this.dataSource.totalelementsSubject.value;
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key) && this.criteria.hasOwnProperty(key)) {
        this.criteriaExport[key] = this.criteria[key];
      }
    }

    this.criteriaExport.size = total > environment.grid.excel.maxExport ? environment.grid.excel.maxExport : total;
    this.criteriaExport.page = 0;
    this.dataSourceExport.loadData(this.criteriaExport);
    this.dataSourceExport.loading$.subscribe(response => {
      if (!response) {
        let content = [];
        try {
          content = this.dataSourceExport.consultarPPData.map((mantenimiento: any) => {
            return {
              no: '',
              zona: mantenimiento.zonaNombre,
              zonaValor: mantenimiento.zonaId,
              noLocal: mantenimiento.localidadId,
              localidad: mantenimiento.localidadNombre,
              upla: mantenimiento.uplaNombre,
              barrio: mantenimiento.barrioNombre,
              pkIdCalzada: '',
              civ: mantenimiento.civ,
              ejeVial: '',
              desde: '',
              hasta: '',
              elemento: '',
              actividad: '',
              actAgrupada: '',
              tipoMalla: '',
              tipoMallaVial1: '',
              anchoPk: '',
              longitudH: '',
              areaPk: '',
              estado: '',
              origen: '',
              superficie: '',
              kmCarrilImpacto: mantenimiento.kmCarrilImpacto,
              kmCarrilLineal: mantenimiento.kmCarrilLineal,
              kmCarrilObra: mantenimiento.kmCarrilObra,
              huecos: '',
              mezcla: '',
              concreto: '',
              estrategia: mantenimiento.estrategiaNombre,
              programa: '',
              programacion: '',
              mesMeta: '',
              estadoEjecucion: '',
              finEjecucion: '',
              anoMes: '',
              residente: '',
              directivo: '',
              trimestre: '',
              fecha: '',
              esMisional: '',
              esPaOSf: '',
              pmt: '',
              horarioPmt: '',
              project: '',
              observacionGISmvl: '',
              observacionGI: '',
              observacion2020: '',
            };
          });
        } catch (error) { }
        this.dataExport = [...this.headers, ...content];
        const order = this.columnsExport;
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'historial', true, order);
        this.cargandoExcel = false;
      }
    });
  }

  cambioZona(event: any) {
    if (this.criteria.zona === undefined) {
      this.localidades = this.localidadesAll;
      this.barrios = this.barriosAll;
      this.uplas = this.uplasAll;
    } else {
      this.localidades = this.localidadesAll.filter(l => l.zona !== null && l.zona.id === event.id);
      this.directores = this.directoresAll.filter(d => d.zona !== null && d.zona.id === event.id);
      this.filtrarBarriosYUpzPorZona();
    }
  }

  cambioLocalidad(event: any) {
    this.barrios = [];
    this.uplas = [];
    if (event === undefined) {
      this.filtrarBarriosYUpzPorZona();
    } else {
      for (const barrio of this.barriosAll) {
        for (const localidad of barrio.localidades) {
          if (localidad.id === event.id) {
            this.barrios.push(barrio);
          }
        }
      }

      for (const upz of this.uplasAll) {
        for (const localidad of upz.localidades) {
          if (localidad.id === event.id) {
            this.uplas.push(upz);
          }
        }
      }
      this.criteria.barrio = null;
      this.criteria.upla = null;
    }
  }

  filtrarBarriosYUpzPorZona() {
    this.barrios = [];
    this.uplas = [];
    for (const barrio of this.barriosAll) {
      for (const localidad of this.localidades) {
        for (const localidadTem of barrio.localidades) {
          if (localidadTem.id === localidad.id) {
            if (!this.barrios.includes(barrio)) {
              this.barrios.push(barrio);
            }
          }
        }
      }
    }

    for (const upz of this.uplasAll) {
      for (const localidad of this.localidades) {
        for (const localidadTem of upz.localidades) {
          if (localidadTem.id === localidad.id) {
            if (!this.uplas.includes(upz)) {
              this.uplas.push(upz);
            }
          }
        }
      }
    }
    this.criteria.localidad = null;
    this.criteria.barrio = null;
    this.criteria.upla = null;
  }

  processingFiltersToShow() {
    this._servicioGeneral.cacheList(this.constants.path_mejoramiento_lista_zonas);
    this._servicioGeneral.listQuery$
      .pipe(
        filter((data: any) => (data.path === this.constants.path_mejoramiento_lista_zonas))
      )
      .subscribe((data: any) => {
        data.content.sort((a, b) => a.nombre.localeCompare(b.nombre));
        this.zonas = data.content;
      });

    this._servicioGeneral.cacheList(this.constants.path_administracion_usuario_by_zona);
    this._servicioGeneral.listQuery$
      .pipe(
        filter((data: any) => (data.path === this.constants.path_administracion_usuario_by_zona))
      )
      .subscribe((data: any) => {
        data.content.sort((a, b) => a.nombres.localeCompare(b.nombres));
        this.directoresAll = data.content;
        this.directoresAll = this.directoresAll.filter(d => d.zona !== null);
        this.directores = data.content;
        this.directores = this.directores.filter(d => d.zona !== null);
      });

    this._servicioGeneral.cacheList(this.constants.path_mejoramiento_lista_localidades);
    this._servicioGeneral.listQuery$
      .pipe(
        filter((data: any) => (data.path === this.constants.path_mejoramiento_lista_localidades))
      )
      .subscribe((data: any) => {
        data.content.sort((a, b) => a.nombre.localeCompare(b.nombre));
        this.localidadesAll = data.content;
        this.localidades = data.content;
      });

    this._servicioGeneral.cacheList(this.constants.path_mejoramiento_lista_barrios);
    this._servicioGeneral.listQuery$
      .pipe(
        filter((data: any) => (data.path === this.constants.path_mejoramiento_lista_barrios))
      )
      .subscribe((data: any) => {
        data.content.sort((a, b) => a.nombre.localeCompare(b.nombre));
        this.barriosAll = data.content;
        this.barrios = data.content;
      });

    this._servicioGeneral.cacheList(this.constants.path_mejoramiento_lista_upla);
    this._servicioGeneral.listQuery$
      .pipe(
        filter((data: any) => (data.path === this.constants.path_mejoramiento_lista_upla))
      )
      .subscribe((data: any) => {
        data.content.sort((a, b) => a.nombre.localeCompare(b.nombre));
        this.uplasAll = data.content;
        this.uplas = data.content;
      });

  }

  changePeriodicidad() {
    if (this.criteria.periodicidad) {
      this.showPeriodo = false;
      this.criteria.periodo = null;
      const nombrePeriodicidad = this.criteria.periodicidad.nombre;
      this.urlPeriodo = `/api/mejoramiento/periodicidad/${nombrePeriodicidad}/items`;

      setTimeout(() => {
        this.showPeriodo = true;
      }, 100);
    }
  }

}
