import { MantenimientoAddComponent } from './../mantenimiento-add/mantenimiento-add.component';
import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren, ElementRef, Input } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { ProcessService } from 'src/app/shared/services/process.service';
import { pluck } from 'rxjs/operators';
import { CONST_ADMINISTRACION_MANTENIMIENTO } from '../mantenimiento.constant';
import { GrupoModel } from '../../models/grupo.model';
import { GrupoService } from '../../services/grupo.service';
import { MantenimientoCriteria } from '../../models/mantenimiento-criteria.model'
import { MantenimientoRemoveComponent } from '../mantenimiento-remove/mantenimiento-remove.component';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { ImportarPksGrupoComponent } from '../../grupo-importar/importar-pks-grupo/importar-pks-grupo.component';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { GrupoCriteria } from '../../models/grupo-criteria.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Componente encargado de gestionar la presentación del listado de mantenimientos */
@Component({
  selector: 'sigma-administracion-mantenimiento-list',
  templateUrl: './mantenimiento-list.component.html'
})
export class MantenimientoListComponent implements OnInit {

  @Input() idGrupo: number;
  /** Variable en la que se mantendra la información de grupo */
  objetoGrupo: GrupoModel;
  /** Variable en la que se almacenarán los mantenimientos a listar*/
  listaMantenimientos: any;
  lengthList: any;
  /** Bandera para identificar si el formulario se encuentra procesando alguna petición */
  loader: Boolean = true;
  /** Bandera usada para saber si se presentará información al usuario */
  noInfoToShow: Boolean;
  /** Bandera usada para saber si se encuentra el componente en proceso de exportación */
  exportOption: Boolean = false;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_MANTENIMIENTO;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteriaGrupo = new GrupoCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new MantenimientoCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new MantenimientoCriteria();
  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'pk',
    'localidad.nombre',
    'zona.nombre',
    'barrio.nombre',
    'upla.nombre',
    'cuadrante.nombre',
    'activo',
    'estado',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    pk: this.constants.pk,
    localidad: this.constants.localidad,
    zona: this.constants.zona,
    barrio: this.constants.barrio,
    upla: this.constants.upla,
    cuadrante: this.constants.cuadrante,
    activo: this.constants.activo
  }];

  /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param processService Servicio usado para peticiones de tipo proceso
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   */
  constructor(
    private servicio: GrupoService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
    private processService: ProcessService,
    private utilitiesService: UtilitiesService
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.servicio.detail(this.idGrupo).subscribe(
      (grupo: GrupoModel) => {
        this.objetoGrupo = grupo;
        this.listaMantenimientos = new MatTableDataSource(this.utilitiesService.orderArray(grupo.mantenimientos, 'pk'));
        this.listaMantenimientos.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'localidad.nombre': return item.localidad ? item.localidad.nombre : '';
            case 'zona.nombre': return item.zona ? item.zona.nombre : '';
            case 'barrio.nombre': return item.barrio ? item.barrio.nombre : '';
            case 'zona.nombre': return item.zona ? item.zona.nombre : '';
            case 'upla.nombre': return item.upla ? item.upla.nombre : '';
            case 'cuadrante.nombre': return item.cuadrante ? item.cuadrante.nombre : '';
            case 'activo': return item.grupoActivo;
            case 'estado': return item.grupoActivo;
            default: return item[property];
          }
        };
        this.listaMantenimientos.sort = this.sort;
        this.listaMantenimientos.paginator = this.paginator;
        this.lengthList = this.listaMantenimientos.filteredData.length;
        if (this.listaMantenimientos.filteredData.length === 0) {
          this.noInfoToShow = true;
          this.loader = false;
          this.exportOption = true;
        } else {
          this.noInfoToShow = false;
          this.loader = false;
          this.exportOption = false;
        }
      }
    );
  }

  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(): void {
  }

  /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la creación de un objeto del componente.
   */
  create() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.data = this.objetoGrupo;

    const dialogRef = this.dialog.open(MantenimientoAddComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          this.clear();
        }
      }
    );
  }

  /**
  * Método encargado de invocar la petición de consulta
  * al servicio según los criterios definidos
  */
  search(): void {
    this.loader = true;
    this.exportOption = true;
    if (this.criteria.pk) {
      this.paginator.pageIndex = 0;
      this.criteria.page = 0;
      this.listaMantenimientos.filter = this.criteria.pk ? this.criteria.pk.trim().toLowerCase() : null;
      this.lengthList = this.listaMantenimientos.filteredData.length;
      this.loader = false;
      this.exportOption = false;
    } else {
      this.servicio.detail(this.idGrupo).subscribe(
        (grupo: GrupoModel) => {
          this.objetoGrupo = grupo;
          this.servicio.updateGroupList(this.objetoGrupo);
          this.listaMantenimientos = new MatTableDataSource(this.utilitiesService.orderArray(this.objetoGrupo.mantenimientos, 'pk'));
          this.listaMantenimientos.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'localidad.nombre': return item.localidad ? item.localidad.nombre : '';
              case 'zona.nombre': return item.zona ? item.zona.nombre : '';
              case 'barrio.nombre': return item.barrio ? item.barrio.nombre : '';
              case 'zona.nombre': return item.zona ? item.zona.nombre : '';
              case 'upla.nombre': return item.upla ? item.upla.nombre : '';
              case 'cuadrante.nombre': return item.cuadrante ? item.cuadrante.nombre : '';
              case 'activo': return item.grupoActivo;
              case 'estado': return item.grupoActivo;
              default: return item[property];
            }
          };
          this.listaMantenimientos.sort = this.sort;
          this.listaMantenimientos.paginator = this.paginator;
          this.lengthList = this.listaMantenimientos.filteredData.length;
          this.noInfoToShow = false;
          this.loader = false;
          this.exportOption = false;
          if (this.listaMantenimientos.filteredData.length === 0) {
            this.noInfoToShow = true;
            this.exportOption = true;
          }
        },
        error => {
          this.noInfoToShow = true;
          this.loader = false;
          this.exportOption = true;
          this.listaMantenimientos = new MatTableDataSource([]);
        }
      );
    }
  }

  /**
   * Método encargado de limpiar los campos de filtros de la grilla
   * y refrescar la grilla.
   */
  clear(): void {
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    let noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (let key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteria[key] = '';
      }
    }
    this.search();
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param MantenimientoToRemove Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(MantenimientoToRemove: WorkflowMantenimientoModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      grupo: this.objetoGrupo,
      MantenimientoToRemove: MantenimientoToRemove
    };

    const dialogRef = this.dialog.open(MantenimientoRemoveComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.clear();
        }
      }
    );
  }

  /**
   * Conjunto de columnas que se van a exportar
  */
  dataExport: any = [];

  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSX(): void {
    this.cargandoExcel = true;
    const total = this.listaMantenimientos.filteredData.length;
    this.criteriaExport.size = total;
    if (this.criteria.size > this.criteriaExport.size) {
      this.criteriaExport.size = this.criteria.size;
    }
    this.criteriaExport.page = 0;
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteriaExport[key] = this.criteria[key];
      }
    }
    let content = [];
    try {
      content = this.listaMantenimientos.filteredData.map((proceso: any) => {
        return {
          pk: proceso.pk,
          localidad: proceso.localidad != null ? proceso.localidad.descripcion : '',
          zona: proceso.zona != null ? proceso.zona.descripcion : '',
          barrio: proceso.barrio != null ? proceso.barrio.descripcion : '',
          upla: proceso.upla != null ? proceso.upla.descripcion : '',
          cuadrante: proceso.cuadrante != null ? proceso.cuadrante.descripcion : '',
          activo: proceso.activo ? this.constants.si : this.constants.no,
        };
      });
    } catch (error) { }
    this.dataExport = [...this.headers, ...content];
    const order = ['pk', 'localidad', 'zona', 'barrio', 'upla', 'cuadrante', 'activo'];
    this.excelService.exportAsExcelFileCustom(
      this.dataExport,
      'procesos',
      true,
      order
    );
    this.cargandoExcel = false;
  }

  /** Método encargado de cargar la información de un archivo
   * indicado por el usuario en el formulario al sistema */
  importar(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.objetoGrupo;
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(ImportarPksGrupoComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.search();
        }
      }
    );
  }

}
