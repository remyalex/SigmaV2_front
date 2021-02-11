import { ViewChild, Component, Inject, OnInit, AfterViewInit, PipeTransform } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { MenuadminService } from '../services/menuadmin.service';
import { MenuCriteria } from '../models/menu-criteria.model';
import { MenuDatasource } from '../services/menu.datasource';
import { Menu } from '../models/menu.model';
import { MenuEditComponent } from '../menu-edit/menu-edit.component';
import { MenuDetailComponent } from '../menu-detail/menu-detail.component';
import { MenuDeleteComponent } from '../menu-delete/menu-delete.component';
import { debug } from 'util';
import { CdkTable } from '@angular/cdk/table';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { CONST_MENU } from './../constantes-menu';
import { PermisosService } from '../../permisos/services/permisos.service';
import { AuthService } from 'src/app/seguridad/services/auth.service';
import { ProfileService } from 'src/app/seguridad/services/profile.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { AppSettings } from 'src/app/app.settings';
import { Router } from '@angular/router';
import { MenuBase } from '../menu-admin/menu-base';

/** Componente encargado de gestionar la visualización del listados de menús */
@Component({
  selector: 'sigma-administracion-menu-list',
  templateUrl: './menu-list.component.html'
})

export class MenuListComponent extends MenuBase implements OnInit, AfterViewInit {

  /** Constantes que utiliza el componente */
  constantes = CONST_MENU;
  /** Componente incluido para ser usado como grilla */
  @ViewChild('TABLE') table: CdkTable<any>;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: MenuDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: MenuDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new MenuCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new MenuCriteria();
  /** Bandera usada para ocultar el botón guardar */
  disabledButton = false;
  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'titulo',
    'descripcion',
    'routerLink',
    'parentId',
    'activo',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    //id: this.constantes.id,
    titulo: this.constantes.titulo,
    descripcion: this.constantes.descripcion,
    tipoEnlace: this.constantes.tipoEnlace,
    // orden: this.constantes.orden,
    routerLink: this.constantes.routerLink,
    href: this.constantes.href,
    // target: this.constantes.target,
    padre: this.constantes.padre,
    // permiso: this.constantes.permiso,
    // icon: this.constantes.icon,
    activo: this.constantes.activo
  }];

  /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort

  /**
	   * Método encargado de construir una instancia de componente
	   * @param servicio Servicio usado en el componente para gestionar las peticiones
	   * @param servicioPermiso Servicio permiso usado en el componente para gestionar las peticiones
	   * @param snackBar Componente usado para abrir un recuadro modal
	   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
	   * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
	   */
  constructor(
    servicio: MenuadminService,
    private servicioPermiso: PermisosService,
    private dialog: MatDialog,
    snackBar: MatSnackBar,
    private excelService: ExcelService,
    authService: AuthService,
    profileService: ProfileService,
    tokenStorage: TokenStorageService,
    appSettings: AppSettings,
    router: Router,
  ) {
    super(servicio, authService, profileService, tokenStorage, appSettings, snackBar, router);
  }

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    this.dataSource = new MenuDatasource(this.servicio, this.servicioPermiso);
    this.loadData();
  }

  /** Método encargado de invocar la petición de consulta 
  * al servicio según los criterios definidos 
  */
  search(): void {
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    this.loadData();
  }

  /**
   * Método encargado de solicitar el listado de los pks al servicio
   */
  loadData(): void {
    this.dataSource.cargarListas();
    this.dataSource.loadData(this.criteria);

  }

  /** Método no funcional */
  menuSelected(): void {
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
   * @param menu Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(menu: Menu): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = menu;

    const dialogRef = this.dialog.open(MenuEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      val => {
        if (val) {
          this.loadData();
        }
      }
    );
  }

  /**
   * Método encargado de realizar el llamado al componente de visualización del detalle
   * de un registro de la grilla.
   *
   * @param menu Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(menu: Menu): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = "70%";
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = menu;

    const dialogRef = this.dialog.open(MenuDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param menu Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(menu: Menu): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = menu;

    const dialogRef = this.dialog.open(MenuDeleteComponent, dialogConfig);
    const _this = this;
    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.loadData();
          this.actualizarMenuVertical();
        }
      }
    );
  }

  /**
   * Método encargado de limpiar los campos de filtros de la grilla
   * y refrescar la grilla.
   */
  Limpiar(): void {
    this.criteria.titulo = "";
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  /** Método encargado de mostrar mensajes de error en el componente
   * @param message mensaje que se mostrará en snackBar
   * @param action el label for the snackbar.
   */
  public enviarMensaje(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  dataExport: any = [{}];
  exportAsXLSX(): void {
    this.disabledButton = true;
    this.dataSourceExport = new MenuDatasource(this.servicio, this.servicioPermiso);
    const total = this.dataSource.totalelementsSubject.value;

    this.criteriaExport.titulo = this.criteria.titulo;
    this.criteriaExport.sortBy = this.criteria.sortBy;
    this.criteriaExport.sortOrder = this.criteria.sortOrder;
    this.criteriaExport.size = total;
    this.criteriaExport.page = 0;

    this.dataSourceExport.loadData(this.criteriaExport);

    this.dataSourceExport.loading$.subscribe(response => {

      if (!response && typeof this.dataSourceExport.menuData !== 'undefined') {
        const content = this.dataSourceExport.menuData.map((data: any) => {
          return {
            //  id: data.id,
            titulo: data.titulo,
            descripcion: data.descripcion,
            tipoEnlace: data.routerLink ? 'Interno' : 'Externo',
            // orden: data.orden,
            routerLink: data.routerLink,
            href: data.href,
            // target: data.target,
            padre: data.parent != null ? data.parent.titulo : '',
            // permiso: data.permiso != null ? data.permiso.nombre : '',
            // icon: data.icon,
            activo: data.activo ? 'Si' : 'No'
          };
        });
        this.dataExport = [...this.headers, ...content];
        //const order = [ 'titulo', 'descripcion', 'tipoEnlace', 'orden', 'routerLink', 'href', 'target', 'padre', 'permiso',  'icon', 'activo'];
        const order = ['titulo', 'descripcion', 'tipoEnlace', 'routerLink', 'href', 'padre', 'activo'];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'menus', true, order);
        this.disabledButton = false;
      }
    });
  }
}