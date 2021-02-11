import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PlanillaoperacionesService } from '../services/planillaoperaciones.service';
import { ItemPlanillaoperacionesCriteria } from '../models/planillaoperaciones-criteria.model';
import { ItemPlanillaoperaiconesModel } from '../models/planillaoperaciones.model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { CONST_ADMINISTRACION_PLANILLAOPERACIONES } from '../planillaoperaciones.constant';
import { Router } from '@angular/router';
import { PlanillaoperacionesDeleteComponent } from '../planillaoperaciones-delete/planillaoperaciones-delete.component';
import { ListasService } from '../../listas/services/listas.service';
import { PlanillaoperacionesEditComponent } from '../planillaoperaciones-edit/planillaoperaciones-edit.component';
import { ListaItem } from '../../listas-items/models/listas-items.model';
import { Lista } from '../../listas/models/lista.model';
import { ListaCriteria } from '../../listas/models/lista-criteria.model';

@Component({
  selector: 'sigma-administracion-planillaoperaciones-list',
  templateUrl: './planillaoperaciones-list.component.html'
})
export class PlanillaoperacionesListComponent implements OnInit, AfterViewInit {

  loader: Boolean = true;
  noInfoToShow: Boolean = false;
  listaItems: any;
  lengthList: Number;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new ItemPlanillaoperacionesCriteria();
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PLANILLAOPERACIONES;
  listaItemsTipoPlanilla: Lista[];
  criteriaList: ListaCriteria[];
  selectedTarjeta: Lista;
  selectedValue: ListaItem;
  listaItemsPlanillaoperaciones: any = [];
  listItemsPlanillaOperacionesAll: any = [];
  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'tipoPlanilla',
    'item',
    'actividad',
    'unidad',
    'activo',
    'operaciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    item: this.constants.itemName,
    actividad: this.constants.actividadName,
    unidad: this.constants.unidadMedida,
    activo: this.constants.activoName
  }];

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
    private servicio: PlanillaoperacionesService,
    private router: Router,
    private dialog: MatDialog,
    private servicioListas: ListasService
  ) {
    this.listaItemsTipoPlanilla = [];
    this.listaItemsPlanillaoperaciones = [];
    this.listItemsPlanillaOperacionesAll = [];
    this.criteriaList = [new ListaCriteria(), new ListaCriteria()];
  }

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
    this.criteriaList[0].nombre = 'TARJETA_MAQUINARIA';
    this.criteriaList[0].descripcion = 'TARJETA_MAQUINARIA';
    this.criteriaList[1].nombre = 'TARJETA_VEHICULOS';
    this.criteriaList[1].descripcion = 'TARJETA_VEHICULOS';

    for (let criteria of this.criteriaList) {
      this.servicioListas.search(criteria).subscribe(
        data => {
          this.loader = false;
          this.listaItemsTipoPlanilla.push(data.content[0]);
          this.listaItemsPlanillaoperaciones = this.listaItemsPlanillaoperaciones.concat(data.content[0].items);
          this.listItemsPlanillaOperacionesAll = this.listItemsPlanillaOperacionesAll.concat(data.content[0].items);
        }
      );
    }

    this.servicio.updateListItem$.subscribe(
      (listUpdated: ItemPlanillaoperaiconesModel) => {
        if (listUpdated) {
          this.loader = true;
          this.getItemList();
        }
      }
    );
    this.getItemList();
  }

  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.criteria.page = this.paginator.pageIndex;
      this.criteria.size = this.paginator.pageSize;
    });

    this.sort.sortChange.subscribe(() => {
      this.criteria.sortBy = this.sort.active;
      this.criteria.sortOrder = this.sort.direction || 'asc';
    });
  }

  getItemList() {
    this.servicio.list().subscribe(
      (listaItems: ItemPlanillaoperaiconesModel[]) => {
        this.listaItems = new MatTableDataSource(listaItems);
        this.listaItems.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'tipoPlanilla': return item.tipoPlanilla.nombre;
            case 'item': return item.item ? item.item.valor : '';
            case 'unidad': return item.unidad ? item.unidad.descripcion : '';
            default: return item[property];
          }
        };
        this.lengthList = this.listaItems.filteredData.length;
        this.listaItems.sort = this.sort;
        this.listaItems.paginator = this.paginator;
        this.noInfoToShow = false;
        this.loader = false;
      },
      error => {
        this.noInfoToShow = true;
        this.loader = false;
      }
    );
  }

  putTipoPlanillaToSearch(tipoPlanillaInfo) {
    this.criteria.tipoPlanilla = tipoPlanillaInfo.id;
    this.listaItemsPlanillaoperaciones = tipoPlanillaInfo.items;
  }

  putItemToSearch(itemInfo) {
    this.criteria.item = itemInfo.id;
  }

  /**
  * Método encargado de invocar la petición de consulta
  * al servicio según los criterios definidos
  */
  search(): void {
    this.loader = true;
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    this.servicio.search(this.criteria).subscribe(
      (searchItem) => {
        this.listaItems = new MatTableDataSource(searchItem.content);
        this.listaItems.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'tipoPlanilla': return item.tipoPlanilla.nombre;
            case 'item': return item.item ? item.item.valor : '';
            case 'unidad': return item.unidad ? item.unidad.descripcion : '';
            default: return item[property];
          }
        };
        this.lengthList = this.listaItems.filteredData.length;
        this.listaItems.sort = this.sort;
        this.listaItems.paginator = this.paginator;
        this.noInfoToShow = false;
        this.loader = false;
      },
      error => {
        this.noInfoToShow = true;
        this.loader = false;
        this.listaItems = [];
      }
    );
  }

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(itemToEdit: ItemPlanillaoperaiconesModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      itemToEdit
    };
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(PlanillaoperacionesEditComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(proceso: ItemPlanillaoperaiconesModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = proceso;

    const dialogRef = this.dialog.open(PlanillaoperacionesDeleteComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.search();
        }
      }
    );
  }

  /**
   * Método encargado de limpiar los campos de filtros de la grilla
   * y refrescar la grilla.
   */
  clear(): void {
    this.selectedValue = undefined;
    this.selectedTarjeta = undefined;
    this.listaItemsPlanillaoperaciones = undefined;
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    let noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (let key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteria[key] = '';
      }
    }

    this.listaItemsPlanillaoperaciones = this.listItemsPlanillaOperacionesAll;

    this.paginator.pageIndex = 0;
  }

  getSelectUnidad(event) {
    this.criteria.unidadId = event.id;
  }
}
