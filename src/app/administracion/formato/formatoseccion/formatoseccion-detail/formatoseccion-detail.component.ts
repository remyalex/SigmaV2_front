import { Component, OnInit, Inject } from '@angular/core';
import { Formatoseccion } from '../models/formatoseccion.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_FORMATOSECCION } from '../formatoseccion.constant';
import { FormatoService } from '../../services/formato.service';
import { Formato } from '../../models/formato.model';

/** Clase encargada de la detalle del componente */
@Component({
  selector: 'sigma-administracion-formatoseccion-detail',
  templateUrl: './formatoseccion-detail.component.html'
})
export class FormatoseccionDetailComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_FORMATOSECCION;
  /** Objeto Seccion usado para enviar al servicio de CRUD*/
  formatoseccion: Formatoseccion;
  /** Objeto usado para enviar al servicio de CRUD*/
  formato: Formato;


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  */
  constructor(
    private dialogRef: MatDialogRef<FormatoseccionDetailComponent>,
    private servicio: FormatoService,
    @Inject(MAT_DIALOG_DATA) data: Formatoseccion
  ) {
    this.formatoseccion = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.servicio.format$.subscribe(
      (objectFormato: Formato) => {
        this.formato = objectFormato;
      }
    );
  }

}
