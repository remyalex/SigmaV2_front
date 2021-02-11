import { ListasService } from './../../../listas/services/listas.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { GrupoModel } from '../../models/grupo.model';
import { GrupoService } from '../../services/grupo.service';
import { CONST_ADMINISTRACION_MANTENIMIENTO } from '../mantenimiento.constant';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { ListaItemsService } from 'src/app/administracion/listas-items/services/listas-items.service';

/** Componente usado para eliminar registro del grupo de mantenimiento */
@Component({
  selector: 'sigma-administracion-grupo-mantenimiento-remove',
  templateUrl: './mantenimiento-remove.component.html'
})
export class MantenimientoRemoveComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_MANTENIMIENTO;
  /** Objeto de tipo Grupo que se desea eliminar */
  grupo: GrupoModel;
  /** Mantenimiento perteneciente al grupo a eliminar */
  MantenimientoToRemove: WorkflowMantenimientoModel;
  /** Bandera para identificar si el componente tiene el boton submit deshabilitado */
  disabledSubmit = false;


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param data Información a procesar
  * @param snackBar Componente usado para abrir un recuadro modal
  */
  constructor(
    private dialogRef: MatDialogRef<MantenimientoRemoveComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private servicio: GrupoService,
    private snackBar: MatSnackBar,
    private servicioLista: ListasService
  ) {
    this.grupo = data.grupo;
    this.MantenimientoToRemove = data.MantenimientoToRemove;
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog*/
  close() {
    this.dialogRef.close(0);
  }

  /** Método encargado de realizar solicitud de almacenamiento al servicio*/
  save () {
    this.disabledSubmit = true;
    for (let act = 0 ; act <= this.grupo.mantenimientos.length ; act++) {
      if (this.grupo.mantenimientos[act].id === this.MantenimientoToRemove.id) {
        this.grupo.mantenimientos[act].grupoActivo = false;
        break;
      }
    }
    this.servicio.update(this.grupo).subscribe(
      (data: GrupoModel) => {
        this.servicio.updateGroupList(data);
        this.dialogRef.close(1);
        this.snackBar.open('¡Se elimino el elemento!', 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.disabledSubmit = false;
        let descripcionError = '';
        try {
          descripcionError = error.error[0].message;
        } catch (error) {
          if (error.erro === undefined) {
            descripcionError = error.message;
          } else {
            descripcionError = error.error.message;
          }
        }
        this.snackBar.open( descripcionError, 'X', {
          duration: 10000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }

}
