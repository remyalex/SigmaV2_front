import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { GrupoModel } from '../models/grupo.model';
import { GrupoService } from '../services/grupo.service';
import { CONST_ADMINISTRACION_GRUPO } from '../grupo.constant';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar la eliminación de un grupo del sistema */
@Component({
  selector: 'sigma-administracion-grupo-delete',
  templateUrl: './grupo-delete.component.html'
})
export class GrupoDeleteComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_GRUPO;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  groupToDelete: GrupoModel;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;


   /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  */
  constructor(
    private dialogRef: MatDialogRef<GrupoDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: GrupoModel,
    private servicio: GrupoService,
    private snackBar: MatSnackBar,
    private dataGenericService:  DataGenericService
  ) {
    this.groupToDelete = data;
    this.form = fb.group({ id: [this.groupToDelete.id, Validators.required] }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close(0);
  }
   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    if (this.groupToDelete.mantenimientos.length > 0) {
      this.snackBar.open(
        'Pks asociados, por favor elimínelos e intente nuevamente', 'X', {
        duration: 10000,
        panelClass: ['error-snackbar']
      }
      );
      this.dialogRef.close(this.form.value);
    } else {
      this.servicio.delete(this.groupToDelete.id).subscribe(
        data => {
          this.servicio.updateGroupList(data);
          this.dataGenericService.removeCacheListContain(this.constants.path_administracion_grupo);
          this.dialogRef.close(this.form.value);
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

}
