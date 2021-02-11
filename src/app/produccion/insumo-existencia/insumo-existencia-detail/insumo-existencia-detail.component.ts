import { CONST_PRODUCCION_REGISTRO_INSUMO_EXISTENCIA } from './../insumoExistencia.constant';
import { UtilitiesService } from './../../../shared/services/utilities.service';
import { Component, OnInit, Inject } from '@angular/core';
import { InsumoExistencia } from '../models/insumo-existencia.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'sigma-produccion-insumo-existencia-detail',
  templateUrl: './insumo-existencia-detail.component.html'
})
export class InsumoExistenciaDetailComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_REGISTRO_INSUMO_EXISTENCIA;
  registro: InsumoExistencia;
  siTipoMezcla = false;

  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dialogRef: MatDialogRef<InsumoExistenciaDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: InsumoExistencia,
    private utilitiesService: UtilitiesService,
  ) {
    this.registro = data;
    if (this.registro.insumo.claseInsumo.descripcion === 'MEZCLAS') {
      this.siTipoMezcla = true;
    }
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  formatHora(value): string {
    return this.utilitiesService.formatoHora(value);
  }

}
