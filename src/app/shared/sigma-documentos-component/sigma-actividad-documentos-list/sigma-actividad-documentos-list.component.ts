import { Component, OnInit, Input } from '@angular/core';
import { CONST_DOCUMENTOS_COMPONENTE } from '../sigma-actividad-documentos.constant';
import { SigmaActividadDocumentosCreateComponent } from '../sigma-actividad-documentos-create/sigma-actividad-documentos-create.component';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { Documento } from 'src/app/administracion/proceso/transicion/documentos/models/documento.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { DocService } from '../services/sigma-actividad-documentos.services';
import { SigmaActividadDocumentosDeleteComponent } from '../sigma-actividad-documentos-delete/sigma-actividad-documentos-delete.component';
import { SigmaActividadDocumentosEditComponent } from '../sigma-actividad-documentos-edit/sigma-actividad-documentos-edit.component';

@Component({
  selector: 'sigma-actividad-documentos-component',
  templateUrl: './sigma-actividad-documentos-list.component.html'
})
export class SigmaActividadDocumentosListComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_DOCUMENTOS_COMPONENTE;
  /** Listado de documentos a procesar */
  listaDocumentos;
  /** Bandera para indicar si el componente se encuentra en procesamiento por el servicio  */
  loader: Boolean = true;
  /** Variable que se encarga de Mostrar o no la informacion en el componente  */
  noInfoToShow: Boolean;
  /** Cantidad de elementos de la lista */
  lengthList;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'tipoDocumento',
    'archivoId',
    'activo',
    'acciones'
  ];

  /**
  * Mantenimiento para el cual se realizará el procesamiento
  * de la información */
  @Input() mantenimiento: WorkflowMantenimientoModel;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dialog: MatDialog,
    private servicio: DocService
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.loadData();
    this.servicio.docs$.subscribe(
      signalToUpdate => {
        console.log(signalToUpdate);
        this.loadData();
      }
    );
  }

  /**
  * Método encargado de solicitar el listado de los pks al servicio
  */
  loadData() {
    this.servicio.listDocuments(this.mantenimiento.id).subscribe(
      (listDocs: any) => {
        this.listaDocumentos = new MatTableDataSource(listDocs);
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
      mantenimiento: this.mantenimiento
    };

    const dialogRef = this.dialog.open(SigmaActividadDocumentosCreateComponent, dialogConfig);
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
    dialogConfig.width = '70%';
    dialogConfig.data = {
      mantenimientoId: this.mantenimiento.id,
      documento
    };

    const dialogRef = this.dialog.open(SigmaActividadDocumentosEditComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param documento Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(documento) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.data = {
      documento
    };

    const dialogRef = this.dialog.open(SigmaActividadDocumentosDeleteComponent, dialogConfig);
  }
}
