import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Eventousuario } from '../models/eventousuario.model';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_EVENTOUSUARIO } from '../eventousuario.constant';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/evento.model';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Clase encargada de la eliminación del componente */
@Component({
  selector: 'sigma-administracion-eventousuario-delete',
  templateUrl: './eventousuario-delete.component.html'
})
export class EventousuarioDeleteComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EVENTOUSUARIO;
  evento: Evento;
  eventousuarioToDelete: Eventousuario;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;


  /**
  * Método encargado de construir una instancia de la clase
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param data Información a procesar
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param snackBar Componente usado para abrir un recuadro modal
  */
  constructor(
    private dialogRef: MatDialogRef<EventousuarioDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private servicio: EventoService,
    private snackBar: MatSnackBar,
    private dataGenericService:  DataGenericService
  ) {
    this.evento = data.evento;
    this.eventousuarioToDelete = data.eventousuarioToDelete;
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
    for (let act = 0 ; act <= this.evento.eventosUsuario.length ; act++) {
      if (this.evento.eventosUsuario[act].id === this.eventousuarioToDelete.id) {
        this.evento.eventosUsuario.splice(act, 1);
        break;
      }
    }
    this.servicio.update(this.evento).subscribe(
      data => {
        this.servicio.updateEventData(this.evento);
        this.dialogRef.close();
        this.snackBar.open(this.constants.deleteSuccess, 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
        this.dataGenericService.removeCacheListContain(this.constants.path_administracion_eventousuario);
      },
      error => {
        this.snackBar.open(
          this.constants.deleteError, 'X', {
            duration: 10000,
            panelClass: ['error-snackbar']
          }
        );
      }
    );
  }

}
