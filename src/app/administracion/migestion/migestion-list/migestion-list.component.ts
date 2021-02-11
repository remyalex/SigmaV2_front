import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { MatSnackBar, MatPaginator, MatSort } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { CONST_ADMINISTRACION_MIGESTION } from '../migestion.constant';
import { MiGestionDatasource } from '../services/migestion.datasource';
import { MiGestionCriteria } from '../models/migestion-criteria.model';
import { MiGestionService } from '../services/migestion.service';
import { Router } from '@angular/router';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { FormGroup } from '@angular/forms';
import { MenuService } from 'src/app/theme/components/menu/menu.service';


@Component({
  selector: 'sigma-administracion-migestion-list',
  templateUrl: './migestion-list.component.html'
})

export class MiGestionListComponent implements OnInit, AfterViewInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_MIGESTION;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: MiGestionDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria: MiGestionCriteria;
  workflowService: WorkflowService;
  tokenStorageService: TokenStorageService;
  mantenimientoActividad: WorkflowMantenimientoActividadModel;
  forms: FormGroup[] = [];
  snackBar: MatSnackBar;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk',
    'actividadActual',
    'fechaAsignacion',
    'estadoPk',
    'acciones'
  ];

  /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;



  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: MiGestionService,
    _workflowService: WorkflowService,
    tokenStorageService: TokenStorageService,
    private router: Router,
    private utilitiesService: UtilitiesService,
    snackBar: MatSnackBar,
    public menuService: MenuService, private tokenStore: TokenStorageService
  ) {
    this.workflowService = _workflowService;
    this.criteria = new MiGestionCriteria(utilitiesService);
    this.tokenStorageService = tokenStorageService;
    this.snackBar = snackBar;
  }

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new MiGestionDatasource(this.servicio);
    this.loadData();
  }

  defaultCriteria(): void {
    this.criteria.responsableId = this.tokenStorageService.getId();
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
    this.defaultCriteria();
    this.dataSource.loadData(this.criteria);
  }

  /**
   * Método encargado de limpiar los campos de filtros de la grilla
   * y refrescar la grilla.
   */
  clear(): void {
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters', 'tieneActividadActual'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteria[key] = '';
      }
    }
    this.paginator.pageIndex = 0;
    this.loadData();
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
   * Método encargado de redireccionar la acción del usuario a la acción del servicio
   *
   * @param mantenimiento Mantenimiento al cual se le va a aplicar la
   * accion realizada por el usuario
   */
  work(mantenimiento: any) {
    this.menuService.removeAllActiveLinks(this.tokenStore.getStorage(this.tokenStore.MENU));
    // document.getElementById('menu-item-'+JSON.parse(window.sessionStorage.getItem('mainMenuSelected'))).classList.remove('active-link');
    if (mantenimiento.actividadActual.id === 75) {
      this.router.navigate(['/produccion/programar-personal-planta/admin/' + mantenimiento.pk]);
    } else {
      this.workflowService.work(mantenimiento.id, mantenimiento.actividadActual.id).subscribe((data) => {
        this.mantenimientoActividad = data;
        // const actividadBase = mantenimiento.actividadActual.nombre.toLocaleLowerCase();
        this.router.navigate(['/workflow/' + this.mantenimientoActividad.actividad.proceso.url + '/'
          + this.mantenimientoActividad.actividad.url + '/'
          + mantenimiento.id
          + '/work'
        ]);
      },
        error => {
          this.utilitiesService.formErrorMessages(error, this.forms, this.snackBar);
        });
    }
  }

}
