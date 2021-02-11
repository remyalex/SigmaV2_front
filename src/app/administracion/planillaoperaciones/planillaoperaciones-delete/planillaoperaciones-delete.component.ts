import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_PLANILLAOPERACIONES } from '../planillaoperaciones.constant';
import { PlanillaoperacionesService } from '../services/planillaoperaciones.service';
import { ItemPlanillaoperaiconesModel } from '../models/planillaoperaciones.model';

@Component({
  selector: 'sigma-administracion-planillaoperaciones-delete',
  templateUrl: './planillaoperaciones-delete.component.html'
})
export class PlanillaoperacionesDeleteComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PLANILLAOPERACIONES;
  itemPlanillaoperacionesToDelete: ItemPlanillaoperaiconesModel;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dialogRef: MatDialogRef<PlanillaoperacionesDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private servicio: PlanillaoperacionesService,
    private snackBar: MatSnackBar
  ) { 
    this.itemPlanillaoperacionesToDelete = data;
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog*/
  close() {
    this.dialogRef.close(0);
  }

  save () {
    this.servicio.delete(this.itemPlanillaoperacionesToDelete.id).subscribe(
      (listWithItemDeleted: ItemPlanillaoperaiconesModel) => {
        this.dialogRef.close(1);
        this.snackBar.open('¡Se elimino el elemento!', 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.snackBar.open(
          'Se presento un problema con el servidor, por favor comuníquese con el administrador', 'X', {
            duration: 10000,
            panelClass: ['error-snackbar']
          }
        );
      }
    );
  }

}

