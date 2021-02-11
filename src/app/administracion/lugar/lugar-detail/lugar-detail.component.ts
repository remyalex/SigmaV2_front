import { Component, OnInit, Inject } from '@angular/core';
import { Lugar } from '../models/lugar.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_LUGAR } from './../lugar.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import * as moment from 'moment';

/** Clase encargada del detalle del componente */
@Component({
  selector: 'sigma-administracion-lugar-detail',
  templateUrl: './lugar-detail.component.html'
})
export class LugarDetailComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LUGAR;
  /** Objeto usado para enviar al servicio de CRUD*/
  lugar: Lugar;


  /**
  * Método encargado de construir una instancia de la clase
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<LugarDetailComponent>,
    private utilitiesService: UtilitiesService,
    @Inject(MAT_DIALOG_DATA) data: Lugar
  ) {
    this.lugar = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
