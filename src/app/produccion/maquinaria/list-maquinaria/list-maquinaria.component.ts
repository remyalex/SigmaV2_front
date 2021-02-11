import { Component, OnInit, AfterContentInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { CONST_PRODUCCION_MAQUINARIA } from '../maquinaria.constant'
import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator, MatSort } from '@angular/material';
import { MaquinariaAction } from '../models/maquinaria-action.model';
import { EquipoDatasource } from 'src/app/administracion/equipo/services/equipo.datasource';
import { EquipoService } from 'src/app/administracion/equipo/services/equipo.service';
import { EquipoCriteria } from 'src/app/administracion/equipo/models/equipo-criteria.model';

@Component({
  selector: 'sigma-list-maquinaria',
  templateUrl: './list-maquinaria.component.html'
})
export class ListMaquinariaComponent implements OnInit, AfterContentInit {
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_MAQUINARIA;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: EquipoDatasource;
  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'id',
    'numeroContrato',
    'contratista',
    'tipoEquipoId',
    'claseEquipoId',
    'placaInventario',
    'marcaEquipoId',
    'lugarEquipoId',
    'acciones'
  ];

  placaInventarioCriteria: Equipo;

  @Input()
  acciones: [MaquinariaAction];

  @Output()
  runAction: EventEmitter<any>;

  searchForm: FormGroup;
  newMaquinaria: Equipo;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new EquipoCriteria();

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
    private service: EquipoService,
    private fb: FormBuilder) {
    this.runAction = new EventEmitter<any>();
    this.dataSource = new EquipoDatasource(this.service);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.criteria.esMaquinariaProduccion = true;
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.searchForm = this.fb.group({
      placaInventario: [this.newMaquinaria.placaInventario],
      claseEquipoId: [this.newMaquinaria.claseEquipo],
      tipoEquipoId: [this.newMaquinaria.equipoTipo],
      marcaEquipoId: [this.newMaquinaria.marcaEquipo]
    });
  }

  ngAfterContentInit() {
    console.log("Acciones", this.acciones);
    this.paginator.page.subscribe(() => {
      this.criteria.page = this.paginator.pageIndex;
      this.criteria.size = this.paginator.pageSize;
      this.dataSource.loadData(this.criteria);
    });

    this.sort.sortChange.subscribe(() => {
      this.criteria.sortBy = this.sort.active;
      this.criteria.sortOrder = this.sort.direction || 'asc';
      this.dataSource.loadData(this.criteria);
    });

    this.dataSource.loadData(this.criteria);
  }

  /**
  * Método encargado de invocar la petición de consulta
  * al servicio según los criterios definidos
  */
  search(): void {
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    this.criteria.placaInventario = this.placaInventarioCriteria ? this.placaInventarioCriteria.placaInventario : '';
    console.log("criteria", this.criteria);
    this.dataSource.loadData(this.criteria);
  }

  setData(event, param) {
    console.log("setting " + param, event);
    this.criteria[param] = event;
  }

  /**
   * Método encargado de limpiar los campos de filtros de la grilla
   * y refrescar la grilla.
   */
  clear(): void {
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters', 'esMaquinariaProduccion'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteria[key] = '';
        this.placaInventarioCriteria = null;
      }
    }
    this.searchForm.reset();
    this.paginator.pageIndex = 0;
    this.dataSource.loadData(this.criteria);
  }

  executeAction(maquinaria: Equipo, action: MaquinariaAction) {
    this.runAction.emit({
      action: action,
      maquinaria: maquinaria
    });
  }

  loadData() {
    this.dataSource.loadData(this.criteria);
  }

}
