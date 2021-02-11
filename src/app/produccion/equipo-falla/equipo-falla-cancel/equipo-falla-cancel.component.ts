import { CONST_PRODUCCION_EQUIPOFALLA } from '../equipo-falla.constant';
import { CONST_ADMINISTRACION_EQUIPO } from '../../../administracion/equipo/equipo.constant';
import { Component, OnInit, Inject } from '@angular/core';
import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { EquipoFallaservice } from '../services/equipo-falla.service';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { EquipoMantenimiento } from '../../equipo-mantenimiento/models/equipo-mantenimiento.models';
import { debug } from 'util';

@Component({
  selector: 'app-equipo-falla-cancel',
  templateUrl: './equipo-falla-cancel.component.html'
})
export class EquipoFallaCancelComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_EQUIPOFALLA;
  equipo: Equipo;
  equipoFalla: EquipoMantenimiento;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  disabledButton: boolean;
  enviada: boolean;
  motivoCancelacion: string;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dialogRef: MatDialogRef<EquipoFallaCancelComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Equipo,
    private service: EquipoFallaservice,
    private snackBar: MatSnackBar,
    private utilitiesServices: UtilitiesService,
  ) {
    this.equipo = data;
    this.form = fb.group({
      'motivoCancelacion': [null, Validators.compose([Validators.required, Validators.maxLength(140)])],
    }
    );
    this.enviada = false;
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.equipoFalla = new EquipoMantenimiento();
    this.equipoFalla.equipo = this.equipo;
    console.log(this.equipo);
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close(0);
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    if (this.motivoCancelacion !== undefined && this.motivoCancelacion.length > 0) {
      this.disabledButton = true;

      for (const index in this.equipo.equipoMantenimientos) {
        if (this.equipo.equipoMantenimientos[index].tipoMantenimiento.id === 4
          && this.equipo.equipoMantenimientos[index].estadoMantenimiento.id !== 9
          && this.equipo.equipoMantenimientos[index].estadoMantenimiento.id !== 7) {
          this.equipoFalla = this.equipo.equipoMantenimientos[index];
          break;
        }
      }
      this.equipoFalla.motivoCancelacion = this.motivoCancelacion;
      this.equipoFalla.fechaCancelacion = new Date();
      this.service.cancel(this.equipoFalla).subscribe(
        data => {
          this.equipoFalla = data;
          this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close();
        },
        error => {
          this.snackBar.open('Se presento un problema con el servidor, por favor comuníquese con el administrador', 'X', {
            duration: 10000,
            panelClass: ['error-snackbar']
          });
        }
      );
    }
  }


}
