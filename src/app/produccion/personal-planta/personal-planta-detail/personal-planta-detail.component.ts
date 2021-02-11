import { Component, OnInit, Inject } from '@angular/core';
import { PersonalPlanta } from '../models/personal-planta.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_REGISTRAR_PLANILLA_OPERACION } from './../personal-planta.constant';

@Component({
  selector: 'sigma-produccion-personal-planta-detail',
  templateUrl: './personal-planta-detail.component.html'
})
export class PersonalPlantaDetailComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_PLANILLA_OPERACION;
  equipo: PersonalPlanta;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dialogRef: MatDialogRef<PersonalPlantaDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: PersonalPlanta
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
