import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Eventorol } from '../models/eventorol.model';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_EVENTOROL } from '../eventorol.constant';
import { Evento } from '../../models/evento.model';
import { EventoService } from '../../services/evento.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Clase encargada de la eliminacion del componente */
@Component({
  selector: 'sigma-administracion-eventorol-delete',
  templateUrl: './eventorol-delete.component.html'
})
export class EventorolDeleteComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EVENTOROL;
  /** Objeto usado para enviar al servicio de CRUD*/
  evento: Evento;
  /** Objeto rol usado para enviar al servicio de CRUD*/
  eventorolToDelete: Eventorol;


  /**
   * Método encargado de construir una instancia de componente
   *
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param data Información a procesar
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param snackBar Componente usado para abrir un recuadro modal
  */
  constructor(
    private dialogRef: MatDialogRef<EventorolDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private servicio: EventoService,
    private snackBar: MatSnackBar,
    private dataGenericService:  DataGenericService
  ) {
    this.evento = data.evento,
    this.eventorolToDelete = data.eventorolToDelete;
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
    for (let eve = 0; eve < this.evento.eventosRol.length; eve++) {
      if (this.evento.eventosRol[eve].id === this.eventorolToDelete.id) {
        this.evento.eventosRol.splice(eve, 1);
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
        this.dataGenericService.removeCacheListContain(this.constants.path_administracion_eventorol);
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
