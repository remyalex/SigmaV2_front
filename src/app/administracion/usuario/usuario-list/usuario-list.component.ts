import {
  ViewChild,
  Component,
  OnInit,
  AfterViewInit
} from '@angular/core';
import {
  MatPaginator,
  MatSort,
  MatDialog,
  MatDialogConfig
} from '@angular/material';
import { UsuarioService } from '../services/usuario.service';
import { UsuarioCriteria } from '../models/usuario-criteria.model';
import { UsuarioDatasource } from '../services/usuario.datasource';
import { Usuario } from '../models/usuario.model';
import { UsuarioEditComponent } from '../usuario-edit/usuario-edit.component';
import { UsuarioDetailComponent } from '../usuario-detail/usuario-detail.component';
import { UsuarioDeleteComponent } from '../usuario-delete/usuario-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_USUARIO } from './../usuario.constant';
import { ProfileService } from 'src/app/seguridad/services/profile.service';
import { UsuarioChangePasswordComponent } from '../usuario-change-password/usuario-change-password.component';

/** Componente encargado de gestionar la visualización del listados de usuarios */
@Component({
  selector: 'sigma-administracion-usuario-list',
  templateUrl: './usuario-list.component.html'
})
export class UsuarioListComponent implements OnInit, AfterViewInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_USUARIO;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: UsuarioDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: UsuarioDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new UsuarioCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new UsuarioCriteria();
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'identificacion',
    'nombres',
    'correoElectronico',
    'usuario',
    'origenId',
    'estado',
    'acciones',
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    identificacion: this.constants.identificacion,
    nombre: this.constants.nombre,
    correoElectronico: this.constants.correoElectronico,
    usuario: this.constants.login,
    origenId: this.constants.origenId,
    estado: this.constants.estado,
    roles: this.constants.roles,
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
  * @param profileService Servicio Perfil usado en el componente para gestionar las peticiones
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
  */
  constructor(
    private servicio: UsuarioService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private profileService: ProfileService,
  ) { }

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new UsuarioDatasource(this.servicio);
    this.loadData();
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
   * @param usuario Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(usuario: Usuario): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = usuario;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(UsuarioEditComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(val => {
      if (val) {
        this.loadData();
      }
    });
  }

  /**
   * Método encargado de realizar el llamado al componente Cambiar Contraseña
   * de un registro de la grilla.
   *
   * @param usuario Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  changePassword(usuario: Usuario): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = usuario;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(UsuarioChangePasswordComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(val => {
      if (val) {
        this.loadData();
      }
    });
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param usuario Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(usuario: Usuario): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = usuario;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(UsuarioDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param usuario Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(usuario: Usuario): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = usuario;

    const dialogRef = this.dialog.open(UsuarioDeleteComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val) {
        this.loadData();
      }
    });
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

  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [];
  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSX(): void {
    this.dataSourceExport = new UsuarioDatasource(this.servicio);
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
          content = this.dataSourceExport.usuarioData.map((usuario: any) => {
            return {
              nombre: usuario.nombres + ' ' + usuario.apellidos,
              correoElectronico: usuario.correoElectronico,
              identificacion: usuario.identificacion,
              usuario: usuario.usuario,
              origenId: usuario.origen ? usuario.origen.descripcion : '',
              estado: usuario.estado ? usuario.estado.descripcion : '',
              roles: this.getRolesString(usuario.roles)
            };
          });
        } catch (error) { }
        this.dataExport = [...this.headers, ...content];
        const order = [
          'identificacion',
          'nombre',
          'correoElectronico',
          'usuario',
          'origenId',
          'estado',
          'roles'
        ];
        this.excelService.exportAsExcelFileCustom(
          this.dataExport,
          'usuario',
          true,
          order
        );
        this.cargandoExcel = false;
      }
    });
  }

  /** Método encargado de retornar el nombre del rol
   * @param roles bojeto lista a usar
   */
  getRolesString(roles): string {
    if (!roles) {
      return '';
    }

    let texto = [];
    texto = roles.map((data: any) => {
      return data.nombre;
    });

    return texto.toString();
  }

  /** Método encargado de retornar un valor booleano sí el usuario
   * cumple la condición 
   * @param usuario objeto tipo Usuario que será evaluado*/
  showChangePassword(usuario: Usuario): boolean {
    if (typeof(usuario.origen) !== 'undefined' && usuario.origen.valor === this.constants.usuarioExterno) {
      return true;
    } else {
      return false;
    }
  }
}
