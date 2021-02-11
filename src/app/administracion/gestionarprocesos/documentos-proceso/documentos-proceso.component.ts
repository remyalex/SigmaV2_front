import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CONST_ADMINISTRACION_GESTIONARPROCESOS } from '../gestionarprocesos.constant';
import { GestionarprocesosService } from '../services/gestionarprocesos.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

/** Componente encargado de gestionar los documentos asociados a los procesos */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'documentos-proceso',
  templateUrl: './documentos-proceso.component.html'
})
export class DocumentosProcesoComponent implements OnInit {

  /** Variable con el valor del mantenimiento al que se le va a gestionar los documentos */
  @Input() mantId: Number;

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_GESTIONARPROCESOS;
  /** Listado de documentos a procesar */
  listaDocumentos;
  /** Bandera que permite identificar si la página está procesando para presentar el loader */
  loader: Boolean = true;
  /** Bandera que permite identiicar si hay información a mostrar al usuario */
  noInfoToShow: Boolean;
  /** Variable usada para saber el tamaño de la lista de mantenimientos */
  lengthList;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'idTipoDocumento',
    'tipoDocumento',
    'fecha',
    'archivoId',
    'estado'
  ];

   /** Elemento usado para gestionar la paginación de la grilla */
   @ViewChild(MatPaginator)
   paginator: MatPaginator;

   /** Elemento usado para gestionar el ordenamiento de la grilla */
   @ViewChild(MatSort)
   sort: MatSort;

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  */
  constructor(
    private servicio: GestionarprocesosService
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.loadData();
  }

   /**
   * Método encargado de cargar los datos de mantenimientos del formulario
   */
  loadData() {
    this.servicio.listDocuments(this.mantId).subscribe(
      (listDocs: any) => {
        this.listaDocumentos = new MatTableDataSource(listDocs);
        this.listaDocumentos.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'idTipoDocumento': return item.id;
            case 'tipoDocumento': return item.tipoDocumento ? item.tipoDocumento.descripcion : '';
            case 'estado': return item.estadoDocumento ? item.estadoDocumento.descripcion : '';
            default: return item[property];
          }
        };
        this.listaDocumentos.sort = this.sort;
        this.listaDocumentos.paginator = this.paginator;
        this.loader = false;
        this.lengthList = this.listaDocumentos.filteredData.length;
        if (this.listaDocumentos.filteredData.length > 0) {
          this.noInfoToShow = false;
        } else {
          this.noInfoToShow = true;
        }
      }
    );
  }

}
