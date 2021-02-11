import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PlanillaOperacion } from '../models/planilla-operacion.model';
import { PlanillaOperacionService } from '../services/planilla-operacion.service';
import { MatSnackBar } from '@angular/material';
import { CONST_REGISTRAR_PLANILLA_OPERACION } from './../planilla-operacion.constant';
import { UtilitiesService } from '../../../shared/services/utilities.service';

@Component({
  selector: 'sigma-produccion-planilla-operacion-delete',
  templateUrl: './planilla-operacion-delete.component.html'
})
export class PlanillaOperacionDeleteComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_PLANILLA_OPERACION;
  equipo: any;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dialogRef: MatDialogRef<PlanillaOperacionDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: PlanillaOperacion,
    private servicio: PlanillaOperacionService,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService
  ) {
    this.equipo = data;
    this.form = fb.group( { id: [this.equipo.data.id, Validators.required] }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog*/
  close() {
    this.dialogRef.close(0);
  }

  save () {
    if (this.equipo.bandera === 'Eliminar_List'){
        this.disableSubmit = true;
        this.servicio.delete(this.equipo.data.id).subscribe(
          data => {
            this.dialogRef.close(this.form.value);
            this.snackBar.open('¡Se elimino el elemento!', 'X', {
              duration: 10000,
              panelClass: ['success-snackbar']
            });
          },
          error => {
            this.disableSubmit = false;
            this.utilitiesService.formErrorMessages(error, this.form, this.snackBar); 
          }
        );
    } else if (this.equipo.bandera === 'Eliminar_Actividad') {
      this.disableSubmit = true;
      this.dialogRef.close(this.form.value);
      this.snackBar.open('¡Se elimino el elemento!', 'X', {
        duration: 10000,
        panelClass: ['success-snackbar']
      });
    }
  }

}
