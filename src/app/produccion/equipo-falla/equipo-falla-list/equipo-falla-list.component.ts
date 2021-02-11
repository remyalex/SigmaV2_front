import { CONST_ADMINISTRACION_EQUIPO } from './../../../administracion/equipo/equipo.constant';
import { CONST_PRODUCCION_EQUIPOFALLA } from '../equipo-falla.constant';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EquipoDatasource } from 'src/app/administracion/equipo/services/equipo.datasource';
import { EquipoCriteria } from 'src/app/administracion/equipo/models/equipo-criteria.model';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { EquipoService } from 'src/app/administracion/equipo/services/equipo.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';
import { EquipoMantenimiento } from '../../equipo-mantenimiento/models/equipo-mantenimiento.models';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { EquipoFallaservice } from '../services/equipo-falla.service';
import { ListasService } from 'src/app/administracion/listas/services/listas.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { EquipoFallaCancelComponent } from '../equipo-falla-cancel/equipo-falla-cancel.component';
import { EquipoFallaCriteria } from '../models/equipo-falla-criteria.model';

@Component({
  selector: 'app-produccion-equipo-falla-list',
  templateUrl: './equipo-falla-list.component.html'
})
export class EquipofallaListComponent implements OnInit {

  equipo: Equipo;
  equipoMantenimiento: EquipoMantenimiento;
  tipoMantenimientoChoque: ListaItem;
  origenEquipo: ListaItem;

 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_EQUIPOFALLA;
  constantsEquipo = CONST_ADMINISTRACION_EQUIPO;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: EquipoDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new EquipoFallaCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new EquipoCriteria();
  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [];
  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'numeroInterno',
    'equipoTipo.valor',
    'claseEquipo.valor',
    'placaInventario',
    'marcaEquipo.valor',
    'estadoEquipo.valor',
    'lugar.nombre',
    'acciones',
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    numeroInterno: this.constants.numeroInterno,
    tipoEquipoId: this.constants.tipoEquipoId,
    claseEquipoId: this.constants.claseEquipoId,
    placaInventario: this.constants.placaInventario,
    marcaEquipoId: this.constants.marcaEquipoId,
    estadoEquipoId: this.constants.estadoEquipoId,
    lugar: this.constants.lugar,
    acciones: this.constants.acciones
  }];

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
    private servicio: EquipoService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
    private listasService: ListasService,
    private service: EquipoFallaservice,
  ) {

  }

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new EquipoDatasource(this.servicio);
    this.listasService.listByNombreItem('ADMINISTRACION_EQUIPO_ORIGEN_EQUIPO', 'PROPIO').subscribe(_origenEquipo => {
      this.origenEquipo = _origenEquipo;
      this.criteria.origenEquipoId = this.origenEquipo;
      this.loadData();
    });
    this.listasService.getFirstItemByValor('MANTENIMIENTO DE CHOQUE').subscribe(_mtto => {
      this.tipoMantenimientoChoque = _mtto;
    });
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

  // tslint:disable-next-line: use-life-cycle-interface
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
   * Método encargado de limpiar los campos de filtros de la grilla
   * y refrescar la grilla.
   */
  clear(): void {
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters', 'origenEquipoId'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteria[key] = '';
      }
    }
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  public mostrarBotonRegistrar(equipo: Equipo): boolean {

    if (equipo.estadoEquipo && equipo.estadoEquipo.id === 3) {
      if (equipo.equipoMantenimientos !== undefined && equipo.equipoMantenimientos.length > 0) {

        for (const index in equipo.equipoMantenimientos) {
          if (equipo.equipoMantenimientos[index].tipoMantenimiento.id === this.tipoMantenimientoChoque.id
            && equipo.equipoMantenimientos[index].estadoMantenimiento.id !== 9
            && equipo.equipoMantenimientos[index].estadoMantenimiento.id !== 7) {
            return false;
          }
        }
      }
    } else {
      return false;
    }
    return true;
  }

  public mostrarBotonCancelar(equipo: Equipo): boolean {

    if (equipo.estadoEquipo && equipo.estadoEquipo.id === 3) {
      if (equipo.equipoMantenimientos !== undefined && equipo.equipoMantenimientos.length > 0) {

        for (const index in equipo.equipoMantenimientos) {
          if (equipo.equipoMantenimientos[index].tipoMantenimiento.id === this.tipoMantenimientoChoque.id
            && equipo.equipoMantenimientos[index].estadoMantenimiento.id !== 7
            && equipo.equipoMantenimientos[index].estadoMantenimiento.id !== 9) {
            return true;
          }
        }
      }
    } else {
      return false;
    }
    return false;
  }

  public reportarFalla(event: any) {
    this.equipo = new Equipo();
    this.equipo = event;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      mensaje: this.constants.bodyEquipoFallaCreate,
      titulo: this.constants.titleEquipoFallaCreate,
    };

    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          this.saveFalla();
        }
      }
    );
  }

  saveFalla() {
    this.createEquipoMantenimiento();

    this.service.create(this.equipoMantenimiento).subscribe(
      data => {
        this.equipoMantenimiento = data;
        this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.loadData();
      },
      error => {
        this.snackBar.open('Se presento un problema con el servidor, por favor comuníquese con el administrador', 'X', {
          duration: 10000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }

  createEquipoMantenimiento() {
    this.equipoMantenimiento = new EquipoMantenimiento();
    this.equipoMantenimiento.id = null;
    this.equipoMantenimiento.fechaInicio = null;
    this.equipoMantenimiento.fechaFin = null;
    this.equipoMantenimiento.fechaCancelacion = null;
    this.equipoMantenimiento.motivoCancelacion = '';
    this.equipoMantenimiento.activo = true;
    this.equipoMantenimiento.equipo = this.equipo;
    this.equipoMantenimiento.tipoMantenimiento = this.tipoMantenimientoChoque;
  }

  cancelarMantenimiento(equipo) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      mensaje: this.constants.bodyEquipoFallaCancel,
      titulo: this.constants.titleEquipoFallaCancel,
    };

    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = false;
          dialogConfig.autoFocus = true;
          dialogConfig.data = equipo;
          dialogConfig.width = '60%';
          const dialogRefCancel = this.dialog.open(EquipoFallaCancelComponent, dialogConfig);
          dialogRefCancel.afterClosed().subscribe(val => {
            this.loadData();
          });
        }
      }
    );
  }

}
