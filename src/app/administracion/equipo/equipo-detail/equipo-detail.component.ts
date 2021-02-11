import { Component, OnInit, Inject } from '@angular/core';
import { Equipo } from '../models/equipo.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_EQUIPO } from './../equipo.constant';


/** Clase encargada de la eliminación de equipos */
@Component({
  selector: 'sigma-administracion-equipo-detail',
  templateUrl: './equipo-detail.component.html'
})
export class EquipoDetailComponent implements OnInit {
  /**  Constantes que utiliza el componente */
  constants = CONST_ADMINISTRACION_EQUIPO;
  /** Objeto usado para enviar al servicio de CRUD*/
  equipo: Equipo;

   /**
   * Método encargado de construir una instancia de componente
   *
   * @param data Información a presentar
   * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
   */
  constructor(
    private dialogRef: MatDialogRef<EquipoDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Equipo
  ) {
    this.equipo = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close();
  }

 /** Método encargado de inicializar el componente */
 ngOnInit() {
    let horaFullIni = '';
    let hora = '';
    let min = '';

    if (this.equipo.horaInicioProgramacion != null)
    {
      horaFullIni = this.equipo.horaInicioProgramacion.replace('0 ', '').replace(':0.0', '');
      hora = horaFullIni.split(':')[0];
      min = horaFullIni.split(':')[1];

      if (hora.length==1) hora = '0' + hora;
      if (min.length==1) min = '0' + min;

      this.equipo.horaInicioProgramacion = hora + ':' + min;
    }
    if (this.equipo.horaFinProgramacion != null)
    {
      horaFullIni = this.equipo.horaFinProgramacion.replace('0 ', '').replace(':0.0', '');
      hora = horaFullIni.split(':')[0];
      min = horaFullIni.split(':')[1];

      if (hora.length==1) hora = '0' + hora;
      if (min.length==1) min = '0' + min;

      this.equipo.horaFinProgramacion = hora + ':' + min;
    }

  }

}
