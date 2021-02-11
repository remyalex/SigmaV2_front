import { ListasService } from './../services/listas.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Lista } from '../models/lista.model';
import { ListaItemsService } from '../../listas-items/services/listas-items.service';
import { ListasItemsDatasource } from '../../listas-items/services/listas-items.datasource';
import { ListaItemCriteria } from '../../listas-items/models/listas-items-criteria.model';
import { CdkTable } from '@angular/cdk/table';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { CONST_ADMINISTRACION_LISTAS } from '../listas.constant';

/** Componente encargado de gestionar la visualización de una lista*/
@Component({
  selector: 'app-listas-detail',
  templateUrl: './listas-detail.component.html'
})
export class ListasDetailComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LISTAS;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  lista: Lista;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource = new MatTableDataSource();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new ListaItemCriteria();
  /** Definición de las columnas presentadas en la grilla */
  columns = ['valor', 'descripcion', 'activo']
  /**  Nombres de columnas que presentará la grilla de mantenimiento usada en el componente */
  headers = [{
    valor: 'Valor',
    descripcion: 'Descripción',
    activo: 'Activo'
  }];

  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [{}];

  /** Tabla en la que se presentará la información */
  @ViewChild('TABLE') table: CdkTable<any>;
  /** Paginador de la grilla presentada al usuario */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** Ordenamiento de la grilla presentada al usuario */
  @ViewChild(MatSort) sort: MatSort;


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
  * @param lista Lista de elementos a presentar el detalle
  * @params servicioItem Componente encargado de gestionar los item de la lista
  * @param servicioLista Componente encargado de gestionar la informacción de la lista
  * @param form Formualario con los datos a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<ListasDetailComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Lista,
    private servicioItem: ListaItemsService,
    private servicioLista: ListasService,
    private dialog: MatDialog,
    private excelService: ExcelService) {
    this.lista = data;
    this.criteria.listaId = data.id;
    this.form = fb.group(
      {
        id: [this.lista.id, Validators.required],
        nombre: [this.lista.nombre, Validators.required],
        descripcion: [this.lista.descripcion, Validators.required],
        activo: [this.lista.activo, Validators.required]
      }
    );
  }
  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.loadData();
  }
  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close();
 }

 /**
  * Método encargado de gestionar la carga de los pks
  * de la grilla al iniciar el componente.
  */
  loadData(): void {
    this.dataSource = new MatTableDataSource(this.lista.items);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSXItems(): void {
    const result = this.lista.items.map(data => {
      return {
        valor: data.valor,
        descripcion: data.descripcion,
        activo:  data.activo ? this.constants.si : this.constants.no,
      }
    });

    this.dataExport = [...this.headers, ...result];
    const order = ['valor', 'descripcion', 'activo'];
    this.excelService.exportAsExcelFileCustom(this.dataExport, 'listas-items', true, order);
  }
}
