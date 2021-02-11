import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Auditoria } from '../models/auditoria.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_AUDITORIA } from './../auditoria.constant';

/** Componente usado para presentar el detalle de la auditoria */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-administracion-auditoria-detail',
  templateUrl: './auditoria-detail.component.html'
})
export class AuditoriaDetailComponent implements OnInit, OnDestroy {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_AUDITORIA;
  /** Elemento de auditoria para registro de la misma */
  auditoria: Auditoria;
  /** Elemento usado para representar el elemento a auditar */
  objeto: any;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param data Información a procesar
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  */
  constructor(
    private dialogRef: MatDialogRef<AuditoriaDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Auditoria
  ) {
    this.auditoria = data;
    this.objeto = JSON.parse(data.data);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método que se ejecuta una vez invocada la destrucción del componente */
  ngOnDestroy() { }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close();
  }
}
