import { ActivatedRoute } from '@angular/router';
import { ViewChild, Component, OnInit, AfterViewInit, Input, OnChanges } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { PlanillaOperacionService } from '../services/personal-planta.service';
import { PlanillaOperacionCriteria } from '../models/personal-planta-personal.model';
import { PlanillaOperacionDatasource } from '../services/personal-planta.datasource';
import { PersonalPlanta } from '../models/personal-planta.model';
import { PersonalPlantaEditComponent } from '../personal-planta-edit/personal-planta-edit.component';
import { PersonalPlantaDetailComponent } from '../personal-planta-detail/personal-planta-detail.component';
import { PersonalPlantaDeleteComponent } from '../personal-planta-delete/personal-planta-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_REGISTRAR_PLANILLA_OPERACION } from './../personal-planta.constant';
import * as _moment from 'moment';
import { TokenStorageService } from '../../../seguridad/services/token-storage.service';


@Component({
  selector: 'sigma-pruduccion-personal-planta-list',
  templateUrl: './personal-planta-list.component.html'
})

export class PersonalPlantaListComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_PLANILLA_OPERACION;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: any;
  lengthList: any;
  usuarioLogueado: any;
  personal = new PlanillaOperacionCriteria();
  personalExport = new PlanillaOperacionCriteria();
  selected = false;
  loader = false;
  noInfoToShow = false;
  public petition = null;
  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [];
  dataSourceExcel: any = [];
  content: any = [];
  @Input() pkInput: Number;
  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'id',
    'fechaRetiro',
    'turnoObj.descripcion',
    'tipoMaterialObj.descripcion',
    'acciones',
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    numeroSolicitud: this.constants.numeroSolicitud,
    fechaEntrega: this.constants.fechaEntrega,
    turno: this.constants.turno,
    tipoMaterial: this.constants.tipoMaterial,
  }];
  /** objeto para valores de los filtros */
  filterValues = {
    turno: '',
    tipoMaterial: '',
    fechaEntregaDesde: '',
    fechaEntregaHasta: '',
  };

  /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: any;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: PlanillaOperacionService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private tokenStorage: TokenStorageService,
    private snackBar: MatSnackBar,
    private _route: ActivatedRoute,
  ) {

  }

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    if (this.pkInput !== null && this.pkInput !== undefined) {
      this.personal.pk = this.pkInput;
    }
    this.loadData();
  }


  /**
   * Método encargado de invocar la petición de consulta
   * al servicio según los criterios definidos
   */
  search(): void {
    this.noInfoToShow = true;
    this.paginator.pageIndex = 0;
    this.filterValues.turno = this.personal.turno ? this.personal.turno.descripcion.trim().toLowerCase() : '';
    this.filterValues.tipoMaterial = this.personal.tipoMaterial ? this.personal.tipoMaterial.descripcion.trim().toLowerCase() : '';
    this.filterValues.fechaEntregaDesde = this.personal.fechaDesde ? this.personal.fechaDesde.trim().toLowerCase() : '';
    this.filterValues.fechaEntregaHasta = this.personal.fechaHasta ? this.personal.fechaHasta.trim().toLowerCase() : '';

    this.dataSource.filter = JSON.stringify(this.filterValues);

    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      if (searchTerms.fechaEntregaDesde && searchTerms.fechaEntregaHasta) {
        return data.turnoObj.descripcion.toLowerCase().indexOf(searchTerms.turno) !== -1
          && data.tipoMaterialObj.descripcion.toString().toLowerCase().indexOf(searchTerms.tipoMaterial) !== -1
          && data.fechaRetiro >= searchTerms.fechaEntregaDesde
          && data.fechaRetiro <= searchTerms.fechaEntregaHasta
          ;
      } else if (searchTerms.fechaEntregaDesde) {
        return data.turnoObj.descripcion.toLowerCase().indexOf(searchTerms.turno) !== -1
          && data.tipoMaterialObj.descripcion.toString().toLowerCase().indexOf(searchTerms.tipoMaterial) !== -1
          && data.fechaRetiro >= searchTerms.fechaEntregaDesde
          ;
      } else if (searchTerms.fechaEntregaHasta) {
        return data.turnoObj.descripcion.toLowerCase().indexOf(searchTerms.turno) !== -1
          && data.tipoMaterialObj.descripcion.toString().toLowerCase().indexOf(searchTerms.tipoMaterial) !== -1
          && data.fechaRetiro <= searchTerms.fechaEntregaHasta
          ;
      } else {
        return data.turnoObj.descripcion.toLowerCase().indexOf(searchTerms.turno) !== -1
          && data.tipoMaterialObj.descripcion.toString().toLowerCase().indexOf(searchTerms.tipoMaterial) !== -1;
      }
    };
    if (this.dataSource.filteredData) {
      if (this.dataSource.filteredData.length > 0) {
        this.lengthList = this.dataSource.filteredData.length;
        this.noInfoToShow = false;
      } else {
        this.lengthList = 0;
      }
    } else {
      this.lengthList = 0;
    }
  }

  /**
   * Método encargado de gestionar la carga de los pks
   * de la grilla al iniciar el componente.
   */
  loadData(): void {
    this.loader = true;
    this.noInfoToShow = true;

    this.usuarioLogueado = this.tokenStorage.getStorage(this.tokenStorage.PERFIL);

    this.personal.responsableId = this.usuarioLogueado.id;

    if (this.petition) {
      this.petition.unsubscribe();
    }
    this.petition = this.servicio.search(this.personal).subscribe(async (data: any) => {
      this.dataSource = new MatTableDataSource(data.content);
      // this.dataSource.sortingDataAccessor = (item, property) => {
      //   switch (property) {
      //     case 'turnoObj.descripcion': return item.turnoObj.descripcion;
      //     case 'tipoMaterialObj.descripcion': return item.tipoMaterialObj.descripcion;
      //     default: return item[property];
      //   }
      // };
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.lengthList = this.dataSource.filteredData.length;
      this.loader = false;
      this.noInfoToShow = false;
      //this.search();
    }, error => {
      this.loader = false;
      this.dataSource = [];
    });
  }

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(payload: PersonalPlanta): void {
    let dataArray: any;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = payload;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(PersonalPlantaEditComponent, dialogConfig)
      .afterClosed().subscribe(result => {
        this.loadData();
      });
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(equipo: PersonalPlanta): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = equipo;
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(PersonalPlantaDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(equipo: PersonalPlanta): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = equipo;
    const dialogRef = this.dialog.open(PersonalPlantaDeleteComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.loadData();
        }
      }
    );
  }

  /**
   * Método encargado de limpiar los campos de filtros de la grilla
   * y refrescar la grilla.
   */
  clear(): void {
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.personal) {
      if (!noLimpiar.includes(key)) {
        this.personal[key] = '';
      }
    }
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  setClaseEquipoEquipo(event) {
    //this.personal.claseEquipoId = event;
  }

  setTipoEquipoEquipo(event) {
    ///this.personal.tipoEquipoId = event;
  }
  getHumanDate(_date: number) {
    const date = new Date(+_date);
    return date.toISOString().split('T')[0];
  }

  loadDataExcel() {
    this.dataSourceExcel = [];
    this.dataSource.filteredData.forEach(data => {
      this.buildData(data);
    });
  }

  buildData(data: any) {
    this.content = [];
    this.content.numeroSolicitud = data.id;
    this.content.fechaEntrega = data.fechaRetiro;
    this.content.turno = data.turnoObj ? data.turnoObj.descripcion : '';
    this.content.tipoMaterial = data.tipoMaterialObj ? data.tipoMaterialObj.descripcion : '';

    this.dataSourceExcel.push(this.content);
  }

  exportAsXLSX(): void {
    this.loadData();
    this.loadDataExcel();
    this.cargandoExcel = false;

    let exportData: any = [];
    exportData = [...this.headers, ...this.dataSourceExcel];
    this.excelService.exportAsExcelFileCustom(exportData, 'Personal', true, '');

  }

}
