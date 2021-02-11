import { ViewChild, Component, Inject, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatTab, MatTable, MatSnackBar } from '@angular/material';
import { UsuarioActividadesService } from '../services/usuario-actividades.service';
import { UsuarioActividadesDatasource } from '../services/usuario-actividades.datasource';
import { UsuarioActividades } from '../models/usuario-actividades.model';
import { CdkTable } from '@angular/cdk/table';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { CONST_ADMINISTRACION_USUARIO_ACTIVIDADES } from '../usuario-actividades.constant';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';

/** Componente encargado de gestionar la visualización del listados de actividades de usuario */
@Component({
  selector: 'sigma-usuario-actividades-list',
  templateUrl: './usuario-actividades-list.component.html'
})
export class UsuarioActividadesListComponent implements OnInit, AfterViewInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_USUARIO_ACTIVIDADES;
  @ViewChild('TABLE') table: CdkTable<any>;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: UsuarioActividadesDatasource;
  ruta = null;
  /** Definición de las columnas presentadas en la grilla */
  columns = ['actividadNombre', 'pendientes', 'acciones'];

  /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;
  /** Columnas de los datos que se exportarán a presionar el botón exportar del componente*/
  dataExport: any = [{}];

  /**
  * Método encargado de construir una instancia
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param router Componente usado para redireccionar entre componentes
  */
  constructor(
    private servicio: UsuarioActividadesService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
    private router: Router) { }

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    //this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
    this.dataSource = new UsuarioActividadesDatasource(this.servicio);
    this.loadData();
  }

  /**
  * Método encargado de invocar la petición de consulta
  * al servicio según los criterios definidos
  */
  search(): void {
    //this.paginator.pageIndex = 0;
    this.loadData();
  }

  /**
   * Método encargado de gestionar la carga de los pks
   * de la grilla al iniciar el componente.
   */
  loadData(): void {
    this.dataSource.loadData();
  }

  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(): void {
    // this.paginator.page.subscribe(() => {
    //   this.loadData();
    // });

    this.sort.sortChange.subscribe(() => {
      //this.paginator.pageIndex = 0;
      this.loadData();
    });
  }

  /** Método encargado de redireccionar la página
   * @param actividad objeto usado en la dirección URL
   */
  redirect(actividad: any) {
    if (actividad.actividadUrl === 'programar-personal-planta') {
      this.router.navigate(['/produccion/programar-personal-planta/admin']);
    } else {
      this.ruta = '/workflow/' + actividad.procesoUrl + '/' + actividad.actividadUrl;
      this.router.navigate([this.ruta]);
    }
  }

}