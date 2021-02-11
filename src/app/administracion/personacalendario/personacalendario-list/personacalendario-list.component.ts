import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { PersonacalendarioService } from '../services/personacalendario.service';
import { PersonacalendarioCriteria } from '../models/personacalendario-criteria.model';
import { PersonacalendarioDatasource } from '../services/personacalendario.datasource';
import { Personacalendario } from '../models/personacalendario.model';
import { PersonacalendarioEditComponent } from '../personacalendario-edit/personacalendario-edit.component';
import { PersonacalendarioDetailComponent } from '../personacalendario-detail/personacalendario-detail.component';
import { PersonacalendarioDeleteComponent } from '../personacalendario-delete/personacalendario-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_PERSONACALENDARIO } from './../personacalendario.constant';
import { SelectionModel } from '@angular/cdk/collections';

/** Componente encargado de gestionar la visualización del listados de persona calendario */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-administracion-personacalendario-list',
  templateUrl: './personacalendario-list.component.html'
})

export class PersonacalendarioListComponent implements OnInit, AfterViewInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONACALENDARIO;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: PersonacalendarioDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: PersonacalendarioDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new PersonacalendarioCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new PersonacalendarioCriteria();
  /**  Columnas de la grilla que se van a exportar */
  dataExport = [];
  /** Se agrega el código del mapa */
  public selection = new SelectionModel<Personacalendario>(true, []);
  /** Listado de pks seleccionados en la grilla */
  public listaPksSelect = [];
  /** objeto lista checkboxes usado en el componente */
  @ViewChildren('listCheckboxes') private listCheckboxes: QueryList<any>;
  /** objeto lista de Pks en formato de Salida del componente */
  @Output() listaPks = new EventEmitter<any>();

  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'id',
    'disponibleId',
    'fechaFin',
    'fechaInicio',
    'personaDisponibilidadId',
    'select',
    'activo',
    'acciones'
  ];

  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    activo: this.constants.activo,
    disponibleId: this.constants.disponibleId,
    fechaFin: this.constants.fechaFin,
    fechaInicio: this.constants.fechaInicio,
    id: this.constants.id,
    personaDisponibilidadId: this.constants.personaDisponibilidadId,

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
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
  */
  constructor(
    private servicio: PersonacalendarioService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar
  ) {
  }

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new PersonacalendarioDatasource(this.servicio);
    this.loadData();
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
      if (datos.personacalendarioSubject.value.length > 0) {
        datos.personacalendariodSubject.value.map(data => {
          this.listaPksSelect.push(data.pk);
          data.select = true;
        });
      }
    } else {
      if (datos.personacalendarioSubject.value.length > 0) {
        datos.personacalendarioSubject.value.map(data => {
          data.select = false;
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
      this.listaPksSelect.push(filaTabla.pk);
    } else {
      for (const index in this.listaPksSelect) {
        if (this.listaPksSelect[index] === filaTabla.pk) {
          this.listaPksSelect.splice(+index, 1);
        }
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

  /**
   * Método encargado de gestionar la carga de los pks
   * de la grilla al iniciar el componente.
   */
  loadData(): void {
    this.listaPksSelect = [];
    this.dataSource.loadData(this.criteria);
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

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param personacalendario Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(personacalendario: Personacalendario): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = personacalendario;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(PersonacalendarioEditComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param personacalendario Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(personacalendario: Personacalendario): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = personacalendario;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(PersonacalendarioDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param personacalendario Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(personacalendario: Personacalendario): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = personacalendario;

    const dialogRef = this.dialog.open(PersonacalendarioDeleteComponent, dialogConfig);

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
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSX(): void {
    this.dataSourceExport = new PersonacalendarioDatasource(this.servicio);
    this.cargandoExcel = true;
    const total = this.dataSource.totalelementsSubject.value;

    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteriaExport[key] = this.criteria[key];
      }
    }
    this.criteriaExport.size = total;
    this.criteriaExport.page = 0;

    this.dataSourceExport.loadData(this.criteriaExport);

    this.dataSourceExport.loading$.subscribe(response => {
      if (!response) {
        let content = [];
        try {
          content = this.dataSourceExport.personacalendarioData.map((personacalendario: any) => {
            return {
              activo: personacalendario.activo ? this.constants.si : this.constants.no,
              disponibleId: personacalendario.disponibleValor,
              fechaFin: personacalendario.fechaFin,
              fechaInicio: personacalendario.fechaInicio,
              id: personacalendario.id,
              personaDisponibilidadId: personacalendario.personaDisponibilidadValor,
            };
          });
        } catch (error) { }
        this.dataExport = [...this.headers, ...content];
        const order = ['activo', 'disponibleId', 'fechaFin', 'fechaInicio', 'id', 'personaDisponibilidadId'];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'personacalendario', true, order);
        this.cargandoExcel = false;
      }
    });
  }

  /** Método encargado de reemplazar el objeto disponibleId con
  * @param _id variable tipo String seleccionado
  */
  setDisponiblePersonacalendario(_id: string) {
    this.criteria.disponibleId = _id;
  }

  /** Método encargado de reemplazar el objeto personaDisponibilidadId con
  * @param _id variable tipo String seleccionado
  */
  setPersonaDisponibilidadPersonacalendario(_id: string) {
    this.criteria.personaDisponibilidadId = _id;
  }

}
