import { UtilitiesService } from './../../../shared/services/utilities.service';
import { CONST_PRODUCCION_REGISTRO_VALE_PLANTA } from './../registrarValePlanta.constant';
import { Component, OnInit, Inject } from '@angular/core';
import { RegistrarValePlanta } from '../models/registrar-vale-planta.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'sigma-produccion-registrar-vale-planta-detail',
  templateUrl: './registrar-vale-planta-detail.component.html'
})
export class RegistrarValePlantaDetailComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_REGISTRO_VALE_PLANTA;
  registro: RegistrarValePlanta;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dialogRef: MatDialogRef<RegistrarValePlantaDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: RegistrarValePlanta,
    private utilitiesService: UtilitiesService,
  ) {
    this.registro = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  formatHora(value): string {
    return this.utilitiesService.formatoHora(value);
  }

}
