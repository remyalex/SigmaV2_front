import { ViewChild, Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatSnackBar, MatTableDataSource } from '@angular/material';
import { RolService } from '../services/rol.service';
import { RolCriteria } from '../models/rol-criteria.model';
import { RolDatasource } from '../services/rol.datasource';
import { Rol } from '../models/rol.model';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { RolEditComponent } from '../rol-edit/rol-edit.component';
import { RolDetailComponent } from '../rol-detail/rol-detail.component';
import { RolDeleteComponent } from '../rol-delete/rol-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { CONST_ADMINISTRACION_ROL } from '../rol.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { BehaviorSubject, combineLatest } from 'rxjs';

/** Componente encargado de gestionar la visualización del listados de roles */
@Component({
  selector: 'sigma-administracion-rol-list',
  templateUrl: './rol-list.component.html'
})

export class RolListComponent implements OnInit, AfterViewInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_ROL;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: RolDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: RolDatasource;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /** lista de roles usada en la grilla del componente */
  listRoles: any;
  /** lista de permisos usada en la grilla del componente */
  listPermisos: any;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new RolCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new RolCriteria();
  /** objeto que se usa para determinar el tamaño de la grilla del componente */
  lengthList: Number;
  /** Objeto usado para enviar al servicio de CRUD */
  roles: Rol[];
  /** variable que recibe  permiso asignado del rol */
  permisos: any;
  /** variable de pagina auxiliar para la grilla */
  pagAux: number;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'nombre',
    'descripcion',
    'activo',
    'acciones'
  ];
  /** Listado de nombre de las columnas que se presentarán en la grilla Rol */
  orderRol = [
    'id',
    'nombre',
    'descripcion',
    'activo'
  ];
  /** Listado de nombre de las columnas que se presentarán en la grilla Permiso */
  orderPermiso = [
    'id',
    'permiso'
  ];
  /**  */
  orderPermisoExport = ['rolId', 'permiso'];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    nombre: 'Nombre',
    descripcion: 'Descripción',
    activo: 'Activo'
  }];
  /**  Nombres de columnas que presentará la grilla Rol de mantenimiento usada en el componente */
  headersRolesExport = [{
    id: 'Id',
    nombre: 'Nombre',
    descripcion: 'Descripción',
    activo: 'Activo',
  }];
  /**  Nombres de columnas que presentará la grilla Permisos de mantenimiento usada en el componente */
  headersPermisosExport = [{
    rolId: 'rolId',
    permiso: 'permiso',
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
  * @param utilitiesServices Componente de utilidades de peticiones a servicios
  */
  constructor(
    private servicio: RolService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
    private utilitiesServices: UtilitiesService
  ) { }

  /** Bandera para indicar si el componente se encuentra en procesamiento por el servicio  */
  loader = true;
  /** Variable que se encarga de Mostrar o no la informacion en el componente  */
  noInfoToShow = false;
  /**  Variable que se encarga de habilitar la opcion de exportar */
  exportOption = true;
  /**  Columnas de la grilla Roles que se van a exportar */
  dataRolesExport: any = [];
  /**  Columnas de la grilla Permisos que se van a exportar */
  dataPermisosExport: any = [];

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    //this.search();
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new RolDatasource(this.servicio);
    this.loadData();
    /*this.servicio.rol$.subscribe(
      (listUpdated: string) => {
        if (listUpdated) {
          this.search();
        } else {
          this.loader = true;
        }
      }
    );*/
  }

  /**
  * Método encargado de invocar la petición de consulta
  * al servicio según los criterios definidos
  */
  search(): void {
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    this.loadData();
    /*this.servicio.search(this.criteria).subscribe(
      (searchEvento: CollectionResponse<Rol>) => {
        this.roles = searchEvento.content;
        this.loadData();
      },
      error => {
        this.utilitiesServices.formErrorMessages(error, '', this.snackBar);
      }
    );*/
  }

  /** Método encargado de limpiar los datos del formulario de consulta */
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
   * Método encargado de gestionar la carga de los pks
   * de la grilla al iniciar el componente.
   */
  loadData(): void {
    this.dataSource.loadData(this.criteria);
    /*this.listRoles = new MatTableDataSource(this.roles);
    this.listRoles.sort = this.sort;
    this.listRoles.paginator = this.paginator;
    this.lengthList = this.listRoles.filteredData.length;
    if (this.listRoles.filteredData.length === 0) {
      this.noInfoToShow = true;
      this.loader = false;
      this.exportOption = true;
    } else {
      this.noInfoToShow = false;
      this.loader = false;
      this.exportOption = false;
    }*/
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
   * @param rol Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(rol: Rol): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = rol;

    const dialogRef = this.dialog.open(RolEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      val => {
        if (val) {
          this.loadData();
        }
      }
    );
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param rol Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(rol: Rol): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = rol;


    const dialogRef = this.dialog.open(RolDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param rol Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(rol: Rol): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = rol;

    const dialogRef = this.dialog.open(RolDeleteComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.loadData();
          // this.servicio.delete(val.id).subscribe(data => {
          //   this.loadData();
          // }, error => {
          //   this.utillilb.formErrorMessages(error, '', this.snackBar);
          // });
        }
      }
    );
  }

  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSX(): void {
    let worksheetRoles: XLSX.WorkSheet;
    let worksheetPermisos: XLSX.WorkSheet;

    let rolesSubject = new BehaviorSubject<any>([]);
    let permisosSubject = new BehaviorSubject<any>([]);

    let loadingRoles$ = rolesSubject.asObservable();
    let loadingPermisos$ = permisosSubject.asObservable();

    this.dataSourceExport = new RolDatasource(this.servicio);
    this.cargandoExcel = true;
    const total = this.dataSource.totalelementsSubject.value;
    this.criteriaExport.size = total;
    this.criteriaExport.page = 0;
    this.criteriaExport.nombre = this.criteria.nombre;
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteriaExport) {
      if (!noLimpiar.includes(key)) {
        this.criteriaExport[key] = this.criteriaExport[key];
      }
    }
    this.dataSourceExport.loadData(this.criteriaExport);

    this.cargandoExcel = true;
    this.dataSourceExport.loading$.subscribe(response => {
      if (!response) {
        //ROLES
        let contentRoles = [];
        try {
          contentRoles = this.dataSourceExport.rolData.map((evento: Rol) => {
            return {
              id: evento.id,
              nombre: evento.nombre,
              descripcion: evento.descripcion,
              activo: evento.activo ? this.constants.si : this.constants.no
            };
          });

        } catch (error) { }
        this.dataRolesExport = [...this.headersRolesExport, ...contentRoles];
        rolesSubject.next(this.dataRolesExport);

        //ROLES PERMISOS
        let contentPermisos = [];
        try {
          for (let erol = 0; erol < this.dataSourceExport.rolData.length; erol++) {
            this.dataSourceExport.rolData[erol].permisos.forEach(element => {
              element.rol = this.dataSourceExport.rolData[erol].id;
            });
            let permisosTemp = this.dataSourceExport.rolData[erol].permisos.map((rolPermiso: any) => {
              return {
                rolId: rolPermiso.rol,
                permiso: rolPermiso.nombre,
              };
            });
            contentPermisos = contentPermisos.concat(permisosTemp);
          }
        } catch (error) { }
        this.dataPermisosExport = [...this.headersPermisosExport, ...contentPermisos];
        permisosSubject.next(this.dataPermisosExport);

        // tslint:disable-next-line: deprecation
        combineLatest(
          loadingRoles$,
          loadingPermisos$,
          (rol, permisos) => {
            const hayRol = rol.length > 0;
            const hayPermiso = permisos.length > 0;
            if (hayRol && hayPermiso) {
              const compilado = { 'roles': rol, 'permisos': permisos };
              return compilado;
            }
          })
          .subscribe((data: any) => {
            if (typeof data !== 'undefined') {

              const hayRol = data.roles.length > 0;
              const hayPermisos = data.permisos.length > 0;

              worksheetRoles = XLSX.utils.json_to_sheet(data.roles, { skipHeader: true, header: this.orderRol });
              worksheetPermisos = XLSX.utils.json_to_sheet(data.permisos, { skipHeader: true, header: this.orderPermisoExport });
              let workbook;

              if (hayRol && hayPermisos) {
                workbook = {
                  Sheets: { 'roles': worksheetRoles, 'permisos': worksheetPermisos },
                  SheetNames: ['roles', 'permisos']
                };
              } else {
                if (hayRol) {
                  workbook = {
                    Sheets: { 'roles': worksheetRoles },
                    SheetNames: ['roles']
                  };
                }
              }

              if (hayRol) {
                const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                this.saveAsExcelFile(excelBuffer, 'roles');
                this.cargandoExcel = false;
              }
            }
          });
      }
    });
  }

  /** Método encargado de almacenar el archivo Excel
   * @param buffer Objeto que recibe el archivo xlsx
   * @param fileName nombre del archivo
   */
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';

    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}