import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';
import { CONST_WORKFLOW_DIAGNOSTICO } from '../diagnostico.constants';
import { CONST_ADMINISTRACION_EQUIPO } from 'src/app/administracion/equipo/equipo.constant';

/** Componente encargado de gestionar la visualización de un equipo*/
@Component({
  selector: 'app-detail-equipo',
  templateUrl: './detail-equipo.component.html'
})
export class DetailEquipoComponent implements OnInit {

  /** Constantes de workflow a usar en el componente */
  constants = CONST_WORKFLOW_DIAGNOSTICO;
  /** Constantes de equipo a usar en el componente */
  constantsEquipo = CONST_ADMINISTRACION_EQUIPO;
  /** Constantes a usar en el componente */
  public equipo: Equipo = new Equipo();
  /** Definición de las columnas presentadas en la grilla */
  public columns = ['conductor', 'movil', 'placa', 'telefono'];
  /** Listado de equipos a presentar */
  public equipos: Array<Equipo> = Array<Equipo>();
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  public dataSource = new MatTableDataSource([]);

  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param dialogRef Componente de dialog usado para presentar la información adicional
  * @param data Datos asociados a la funcionalidad a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<DetailEquipoComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.equipo = data;

    this.equipos.push(this.equipo);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.equipos);
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close();
  }
}
