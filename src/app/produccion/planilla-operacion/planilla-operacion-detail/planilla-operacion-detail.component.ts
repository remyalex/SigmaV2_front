import { Component, OnInit, Inject } from '@angular/core';
import { PlanillaOperacion } from '../models/planilla-operacion.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_REGISTRAR_PLANILLA_OPERACION } from './../planilla-operacion.constant';

@Component({
  selector: 'sigma-produccion-planilla-operacion-detail',
  templateUrl: './planilla-operacion-detail.component.html'
})
export class PlanillaOperacionDetailComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_PLANILLA_OPERACION;
  equipo: PlanillaOperacion;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dialogRef: MatDialogRef<PlanillaOperacionDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: PlanillaOperacion
  ) {
    this.equipo = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    let horaFullIni = '';
    let hora = '';
    let min = '';
  }

}
