import { Documento } from '../models/documento.model';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { CONST_ADMINISTRACION_DOCUMENTO } from '../documentos.constant';
import { MatTableDataSource, MatDialogConfig, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatSort } from '@angular/material';
import { DocumentosCreateComponent } from '../documentos-create/documentos-create.component';
import { Proceso } from '../../../models/proceso.model';
import { ProcesoService } from '../../../services/proceso.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { DocumentosUpdateComponent } from '../documentos-update/documentos-update.component';
import { DocumentosDeleteComponent } from '../documentos-delete/documentos-delete.component';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { TransicionModel } from '../../../models/transicion.model';

/** Componente encargado de gestionar la visualización del listados de documento de trancisiones*/
@Component({
  selector: 'app-documentos-list',
  templateUrl: './documentos-list.component.html'
})
export class DocumentosListComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_DOCUMENTO;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo para proceso */
  objetoProceso: Proceso;
  /** Variable usada para diccionario de llaves de lista de documentos */
  listaDocumentos: MatTableDataSource<any>;
  /** Bandera para indicar si el componente se encuentra en procesamiento por el servicio  */
  loader: Boolean = true;
  /** Variable que se encarga de Mostrar o no la informacion en el componente  */
  noInfoToShow: Boolean;
  /** Variable usada para controlar las opcines de la exportación */
  exportOption: Boolean = false;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo para proceso */
  proceso: Proceso;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo para  trsansición */
  transicion: TransicionModel;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'transicion',
    'tipoDocumento',
    'estadoDocumentoInicial',
    'estadoDocumentoFinal',
    'activo',
    'acciones'
  ];
  /**  Nombres de columnas que presentará la grilla de mantenimiento usada en el componente */
  headers = [{
    transicion: this.constants.transicion,
    tipoDocumento: this.constants.tipoDocumento,
    estadoDocumentoInicial: this.constants.estadoDocumentoInicial,
    estadoDocumentoFinal: this.constants.estadoDocumentoFinal,
    activo: this.constants.activo
  }];

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;

  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param data Información a procesar
   * @param actualDialog Referencia al componente dialog que invoco la funcionalidad
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private actualDialog: MatDialogRef<DocumentosListComponent>,
    private servicio: ProcesoService
  ) {
    this.proceso = data.proceso;
    this.transicion = data.transicion;
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.listaDocumentos = new MatTableDataSource(this.transicion.transicionEstadoDocumento);
    this.load();
  }

  /**
  * Método encargado de solicitar el listado de los pks al servicio
  */
  load() {
    this.servicio.Procesodata.subscribe(
      (proceso: Proceso) => {
        if (Object.keys(proceso).length === 0) {
          this.loader = true;
        } else {
          this.objetoProceso = proceso;
          proceso.transiciones.forEach(transicion => {
            if (transicion.id === this.transicion.id) {
              this.transicion = transicion;
              this.listaDocumentos = new MatTableDataSource(transicion.transicionEstadoDocumento);
              this.listaDocumentos.sortingDataAccessor = (item, property) => {
                switch (property) {
                  case 'tipoDocumento':
                    return item.tipoDocumento.descripcion;
                    break;
                  case 'estadoDocumento':
                    return item.estadoDocumento.descripcion;
                    break;
                }
              };
              this.listaDocumentos.sort = this.sort;
              this.listaDocumentos.paginator = this.paginator;
              if (this.listaDocumentos.filteredData.length === 0) {
                this.noInfoToShow = true;
                this.loader = false;
                this.exportOption = true;
              } else {
                this.noInfoToShow = false;
                this.loader = false;
                this.exportOption = false;
              }
            }
          });
        }
      },
      error => {
        this.noInfoToShow = true;
      });
  }

  /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la creación de un objeto del componente.
   */
  create(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.data = {
      proceso: this.objetoProceso,
      transicion: this.transicion
    }

    const dialogRef = this.dialog.open(DocumentosCreateComponent, dialogConfig);
  }

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param documento Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(documento) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      proceso: this.objetoProceso,
      transicion: this.transicion,
      documentoToEdit: documento
    };
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(DocumentosUpdateComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param documento Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(documento: Documento): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      proceso: this.objetoProceso,
      transicion: this.transicion,
      documento: documento
    };

    const dialogRef = this.dialog.open(DocumentosDeleteComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.load();
        }
      }
    );
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val == 1) {
        this.actualDialog.close();
      }
    });
  }

  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [];

  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSX(): void {
    this.cargandoExcel = true;
    let content = [];
    try {
      content = this.listaDocumentos.filteredData.map((documento: any) => {
        return {
          transicion: this.transicion.nombre,
          tipoDocumento: documento.tipoDocumento ? documento.tipoDocumento.descripcion : '',
          estadoDocumentoInicial: documento.estadoDocumentoInicial ? documento.estadoDocumentoInicial.descripcion : '',
          estadoDocumentoFinal: documento.estadoDocumentoFinal ? documento.estadoDocumentoFinal.descripcion : '',
          activo: documento.activo ? this.constants.si : this.constants.no,
        };
      });
    } catch (error) { }
    this.dataExport = [...this.headers, ...content];
    const order = ['transicion', 'tipoDocumento', 'estadoDocumento', 'activo'];
    this.excelService.exportAsExcelFileCustom(
      this.dataExport,
      'documento',
      true,
      order
    );
    this.cargandoExcel = false;
  }

}
