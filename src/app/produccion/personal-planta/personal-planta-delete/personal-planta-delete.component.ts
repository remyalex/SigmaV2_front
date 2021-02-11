import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PersonalPlanta } from '../models/personal-planta.model';
import { PlanillaOperacionService } from '../services/personal-planta.service';
import { MatSnackBar } from '@angular/material';
import { CONST_REGISTRAR_PLANILLA_OPERACION } from './../personal-planta.constant';
import { UtilitiesService } from '../../../shared/services/utilities.service';

@Component({
  selector: 'sigma-produccion-personal-planta-delete',
  templateUrl: './personal-planta-delete.component.html'
})
export class PersonalPlantaDeleteComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_PLANILLA_OPERACION;
  equipo: PersonalPlanta;
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
    private dialogRef: MatDialogRef<PersonalPlantaDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: PersonalPlanta,
    private servicio: PlanillaOperacionService,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService
  ) {
    this.equipo = data;
    this.form = fb.group( { id: [this.equipo.id, Validators.required] }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog*/
  close() {
    this.dialogRef.close(0);
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.disableSubmit = true;
    this.dialogRef.close(this.form.value);
    this.snackBar.open('¡Se elimino el elemento!', 'X', {
      duration: 10000,
      panelClass: ['success-snackbar']
    });
  }

}
