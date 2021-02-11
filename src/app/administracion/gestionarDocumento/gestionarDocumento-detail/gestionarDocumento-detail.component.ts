import { Component, OnInit, Inject } from '@angular/core';
import { GestionarDocumento } from '../models/gestionarDocumento.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_GESTIONAR_DOCUMENTO } from './../gestionarDocumento.constant';

/** Componente encargado de gestionar la presentación
 * del detalle de los documentos en el sistema*/
@Component({
  selector: 'sigma-administracion-gestionarDocumento-detail',
  templateUrl: './gestionarDocumento-detail.component.html'
})
export class GestionarDocumentoDetailComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_GESTIONAR_DOCUMENTO;
  /** Objeto encagrado de agrupar los datos del modelo que se procesarán en el componente */
  gestionarDocumento: GestionarDocumento;

  /**
  * Método encargado de construir una instancia del componente
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param data Información a procesar
   */
  constructor(
    private dialogRef: MatDialogRef<GestionarDocumentoDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: GestionarDocumento
  ) {
    this.gestionarDocumento = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
